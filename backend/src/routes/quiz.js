const express = require('express');
const { authGuard } = require('../middleware/authMiddleware');
const {
    getAllQuizzes,
    getQuizById,
    getQuestionsByQuizId,
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

// Start quiz attempt (requires auth)
router.post('/:quizId/attempt/start', authGuard, async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user.id;

        // Verify quiz exists
        const quiz = await getQuizById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Create attempt
        const attempt = await createQuizAttempt(userId, quizId);

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
                attempt_id: attempt.id,
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

        if (!question_id || user_answer === undefined) {
            return res.status(400).json({ error: 'question_id and user_answer are required' });
        }

        // Verify attempt exists and belongs to user
        const attempt = await getQuizAttemptById(attemptId);
        if (!attempt || attempt.user_id !== req.user.id || attempt.quiz_id !== parseInt(quizId)) {
            return res.status(403).json({ error: 'Unauthorized access to this attempt' });
        }

        if (attempt.status !== 'in_progress') {
            return res.status(400).json({ error: 'Attempt is not in progress' });
        }

        // Get the question to verify correct answer
        const question = await getQuestionsByQuizId(quizId);
        const targetQuestion = question.find(q => q.id === parseInt(question_id));

        if (!targetQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Check if answer is correct
        const is_correct = targetQuestion.correct_answer === user_answer;

        // Submit answer
        const answer = await submitQuizAnswer(attemptId, question_id, user_answer, is_correct);

        res.json({
            success: true,
            data: {
                answer_recorded: true,
                question_id,
                is_correct,
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
                return {
                    question_id: answer.question_id,
                    question_text: question.question_text,
                    user_answer: answer.user_answer,
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
                const questions = await getQuestionsByQuizId(quizId);
                const question = questions.find(q => q.id === answer.question_id);
                return {
                    question_id: answer.question_id,
                    question_text: question.question_text,
                    user_answer: answer.user_answer,
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
