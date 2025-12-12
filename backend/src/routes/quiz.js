const express = require('express');
const { authGuard } = require('../middleware/authMiddleware');
const {
    getAllQuizzes,
    getQuizById,
    getQuestionsByQuizId,
    getQuestionsByQuizIdWithAnswers,
    getOptionsByQuestionId,
    createQuizAttempt,
    getQuizAttemptById,
    submitQuizAnswer,
    completeQuizAttempt,
    getQuizAttemptAnswers,
    getUserQuizAttempts,
} = require('../utils/db');

const router = express.Router();

// Get all quizzes (public endpoint)
router.get('/', async (req, res) => {
    try {
        const quizzes = await getAllQuizzes();
        res.json({ success: true, data: quizzes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get quiz details (public endpoint)
router.get('/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await getQuizById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json({ success: true, data: quiz });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get quiz questions with options (public endpoint)
router.get('/:quizId/questions', async (req, res) => {
    try {
        const { quizId } = req.params;
        const questions = await getQuestionsByQuizId(quizId);

        // Fetch options for each question
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const options = await getOptionsByQuestionId(question.id);
                return {
                    ...question,
                    options: options.map(opt => ({
                        id: opt.id,
                        option_text: opt.option_text,
                        // Do NOT send is_correct to frontend for security
                    })),
                };
            })
        );

        res.json({ success: true, data: questionsWithOptions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start quiz attempt (requires auth) - Just load quiz, don't create attempt yet
router.post('/:quizId/attempt/start', authGuard, async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user.id;

        // Verify quiz exists
        const quiz = await getQuizById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Generate a temporary attempt ID (will be created on first answer submission)
        const tempAttemptId = `temp_${userId}_${quizId}_${Date.now()}`;

        // Get questions for this attempt
        const questions = await getQuestionsByQuizId(quizId);
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const options = await getOptionsByQuestionId(question.id);
                return {
                    ...question,
                    options: options.map(opt => ({
                        id: opt.id,
                        option_text: opt.option_text,
                    })),
                };
            })
        );

        res.json({
            success: true,
            data: {
                attempt_id: tempAttemptId,
                quiz: quiz,
                questions: questionsWithOptions,
                total_questions: questionsWithOptions.length,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit answer for a question (requires auth)
router.post('/:quizId/attempt/:attemptId/answer', authGuard, async (req, res) => {
    try {
        const { attemptId, quizId } = req.params;
        const { question_id, user_answer } = req.body;
        const userId = req.user.id;

        if (!question_id || user_answer === undefined || user_answer === null || user_answer === '') {
            return res.status(400).json({ error: 'question_id and user_answer are required' });
        }

        // Handle temporary attempt ID - create real attempt on first answer
        let realAttemptId = attemptId;
        if (attemptId.startsWith('temp_')) {
            // Create the actual attempt on first answer submission
            const attempt = await createQuizAttempt(userId, parseInt(quizId));
            realAttemptId = attempt.id;
        } else {
            // Verify attempt exists and belongs to user
            const attempt = await getQuizAttemptById(attemptId);
            if (!attempt || attempt.user_id !== userId || attempt.quiz_id !== parseInt(quizId)) {
                return res.status(403).json({ error: 'Unauthorized access to this attempt' });
            }

            if (attempt.status !== 'in_progress') {
                return res.status(400).json({ error: 'Attempt is not in progress' });
            }
        }

        // Get the question to verify correct answer
        const questions = await getQuestionsByQuizIdWithAnswers(quizId);
        const targetQuestion = questions.find(q => q.id === parseInt(question_id));

        if (!targetQuestion) {
            return res.status(404).json({ error: `Question ${question_id} not found in quiz ${quizId}` });
        }

        // Get the option text for the user's answer (if it's an option ID)
        let userAnswerText = user_answer;
        if (!isNaN(user_answer)) {
            // This is an option ID, get the actual option text
            const options = await getOptionsByQuestionId(parseInt(question_id));
            const selectedOption = options.find(opt => opt.id == user_answer);
            if (!selectedOption) {
                return res.status(400).json({ error: `Option ${user_answer} not found for question ${question_id}` });
            }
            userAnswerText = selectedOption.option_text;
        }

        // Check if answer is correct
        // For MCQ: compare with correct_answer letter (A, B, C, D)
        // For True/False: compare with "true" or "false"
        let is_correct = false;
        if (targetQuestion.question_type === 'mcq') {
            // Extract the letter from option_text (e.g., "A) something" -> "A")
            const answerLetter = userAnswerText.charAt(0).toUpperCase();
            is_correct = targetQuestion.correct_answer && targetQuestion.correct_answer.toUpperCase() === answerLetter;
        } else if (targetQuestion.question_type === 'true_false') {
            // For true/false, check if the option text is "True" or "False"
            is_correct = targetQuestion.correct_answer && targetQuestion.correct_answer.toLowerCase() === userAnswerText.toLowerCase();
        } else {
            // For short answer, do a direct comparison
            is_correct = targetQuestion.correct_answer === user_answer;
        }

        // Submit answer
        const answer = await submitQuizAnswer(realAttemptId, question_id, user_answer, is_correct);

        res.json({
            success: true,
            data: {
                answer_recorded: true,
                question_id,
                is_correct,
                attempt_id: realAttemptId,
                feedback: targetQuestion.explanation,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Complete quiz attempt and get results (requires auth)
router.post('/:quizId/attempt/:attemptId/submit', authGuard, async (req, res) => {
    try {
        const { attemptId, quizId } = req.params;

        // Verify attempt exists and belongs to user
        const attempt = await getQuizAttemptById(attemptId);
        if (!attempt || attempt.user_id !== req.user.id || attempt.quiz_id !== parseInt(quizId)) {
            return res.status(403).json({ error: 'Unauthorized access to this attempt' });
        }

        // Get all answers for this attempt
        const answers = await getQuizAttemptAnswers(attemptId);
        const correctAnswers = answers.filter(a => a.is_correct).length;
        const totalQuestions = answers.length;
        const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        // Complete attempt
        await completeQuizAttempt(attemptId, correctAnswers, percentage.toFixed(2));

        // Get quiz to check passing score
        const quiz = await getQuizById(quizId);
        const passed = percentage >= quiz.passing_score;

        // Get all answers with details
        const answersWithDetails = await Promise.all(
            answers.map(async (answer) => {
                const questions = await getQuestionsByQuizId(quizId);
                const question = questions.find(q => q.id === answer.question_id);

                // Get option text for MCQ and True/False questions
                let userAnswerText = answer.user_answer;
                if (answer.user_answer && !isNaN(answer.user_answer)) {
                    // This is an option ID, fetch the option text
                    const options = await getOptionsByQuestionId(answer.question_id);
                    const selectedOption = options.find(opt => opt.id == answer.user_answer);
                    userAnswerText = selectedOption ? selectedOption.option_text : answer.user_answer;
                }

                return {
                    question_id: answer.question_id,
                    question_text: question.question_text,
                    user_answer: userAnswerText,
                    correct_answer: question.correct_answer,
                    is_correct: answer.is_correct,
                    explanation: question.explanation,
                };
            })
        );

        res.json({
            success: true,
            data: {
                attempt_id: attemptId,
                quiz_title: quiz.title,
                score: correctAnswers,
                total_questions: totalQuestions,
                percentage: percentage.toFixed(2),
                passing_score: quiz.passing_score,
                passed: passed,
                answers: answersWithDetails,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get attempt results (requires auth)
router.get('/:quizId/attempt/:attemptId/results', authGuard, async (req, res) => {
    try {
        const { attemptId, quizId } = req.params;

        // Verify attempt exists and belongs to user
        const attempt = await getQuizAttemptById(attemptId);
        if (!attempt || attempt.user_id !== req.user.id || attempt.quiz_id !== parseInt(quizId)) {
            return res.status(403).json({ error: 'Unauthorized access to this attempt' });
        }

        const answers = await getQuizAttemptAnswers(attemptId);
        const quiz = await getQuizById(quizId);

        const answersWithDetails = await Promise.all(
            answers.map(async (answer) => {
                const questions = await getQuestionsByQuizIdWithAnswers(quizId);
                const question = questions.find(q => q.id === answer.question_id);

                // Get option text for MCQ and True/False questions
                let userAnswerText = answer.user_answer;
                if (answer.user_answer && !isNaN(answer.user_answer)) {
                    // This is an option ID, fetch the option text
                    const options = await getOptionsByQuestionId(answer.question_id);
                    const selectedOption = options.find(opt => opt.id == answer.user_answer);
                    userAnswerText = selectedOption ? selectedOption.option_text : answer.user_answer;
                }

                return {
                    question_id: answer.question_id,
                    question_text: question.question_text,
                    user_answer: userAnswerText,
                    correct_answer: question.correct_answer,
                    is_correct: answer.is_correct,
                    explanation: question.explanation,
                };
            })
        );

        res.json({
            success: true,
            data: {
                attempt_id: attemptId,
                quiz_title: quiz.title,
                score: attempt.score,
                total_questions: answers.length,
                percentage: attempt.percentage,
                passing_score: quiz.passing_score,
                passed: attempt.percentage >= quiz.passing_score,
                status: attempt.status,
                started_at: attempt.started_at,
                completed_at: attempt.completed_at,
                answers: answersWithDetails,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's quiz attempts (requires auth)
router.get('/:quizId/my-attempts', authGuard, async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user.id;

        const attempts = await getUserQuizAttempts(userId, quizId);

        res.json({
            success: true,
            data: {
                quiz_id: quizId,
                attempts: attempts,
                total_attempts: attempts.length,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
