const express = require('express');
const { authGuard, adminOnly } = require('../middleware/authMiddleware');
const {
    createQuiz,
    getQuizById,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz,
    createQuestion,
    getQuestionsByQuizId,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    createQuizOption,
    getOptionsByQuestionId,
    updateQuizOption,
    deleteQuizOption,
} = require('../utils/db');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authGuard, adminOnly);

// ===== QUIZ MANAGEMENT =====

// Create a new quiz
router.post('/', async (req, res) => {
    try {
        const { title, description, duration, passing_score, difficulty } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const quiz = await createQuiz(title, description, duration, passing_score || 60, difficulty || 'medium', req.user.id);
        res.json({ success: true, data: quiz });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a quiz
router.put('/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { title, description, duration, passing_score, difficulty } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const quiz = await updateQuiz(quizId, title, description, duration, passing_score, difficulty);
        res.json({ success: true, data: quiz });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a quiz
router.delete('/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        await deleteQuiz(quizId);
        res.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== QUESTION MANAGEMENT =====

// Create a question
router.post('/:quizId/questions', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { question_text, question_type, correct_answer, explanation, time_limit, options } = req.body;

        if (!question_text || !question_type) {
            return res.status(400).json({ error: 'question_text and question_type are required' });
        }

        // Validate question type
        const validTypes = ['mcq', 'true_false', 'short_answer'];
        if (!validTypes.includes(question_type)) {
            return res.status(400).json({ error: 'Invalid question_type' });
        }

        // Create question
        const question = await createQuestion(quizId, question_text, question_type, correct_answer, explanation, time_limit);

        // If MCQ, create options
        let createdOptions = [];
        if (question_type === 'mcq' && options && Array.isArray(options)) {
            for (const option of options) {
                const createdOption = await createQuizOption(question.id, option.option_text, option.is_correct || false);
                createdOptions.push(createdOption);
            }
        }

        res.json({
            success: true,
            data: {
                ...question,
                options: createdOptions,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all questions for a quiz (with options)
router.get('/:quizId/questions', async (req, res) => {
    try {
        const { quizId } = req.params;
        const questions = await getQuestionsByQuizId(quizId);

        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const options = await getOptionsByQuestionId(question.id);
                return {
                    ...question,
                    options,
                };
            })
        );

        res.json({ success: true, data: questionsWithOptions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific question with options
router.get('/:quizId/questions/:questionId', async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        const question = await getQuestionById(questionId);

        if (!question || question.quiz_id !== parseInt(quizId)) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const options = await getOptionsByQuestionId(questionId);
        res.json({
            success: true,
            data: {
                ...question,
                options,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a question
router.put('/:quizId/questions/:questionId', async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        const { question_text, question_type, correct_answer, explanation, time_limit } = req.body;

        // Verify question exists and belongs to this quiz
        const question = await getQuestionById(questionId);
        if (!question || question.quiz_id !== parseInt(quizId)) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const updated = await updateQuestion(questionId, question_text, question_type, correct_answer, explanation, time_limit);
        const options = await getOptionsByQuestionId(questionId);

        res.json({
            success: true,
            data: {
                ...updated,
                options,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a question
router.delete('/:quizId/questions/:questionId', async (req, res) => {
    try {
        const { quizId, questionId } = req.params;

        // Verify question exists and belongs to this quiz
        const question = await getQuestionById(questionId);
        if (!question || question.quiz_id !== parseInt(quizId)) {
            return res.status(404).json({ error: 'Question not found' });
        }

        await deleteQuestion(questionId);
        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== QUIZ OPTION MANAGEMENT =====

// Create/add an option to a question
router.post('/:quizId/questions/:questionId/options', async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        const { option_text, is_correct } = req.body;

        if (!option_text) {
            return res.status(400).json({ error: 'option_text is required' });
        }

        // Verify question exists
        const question = await getQuestionById(questionId);
        if (!question || question.quiz_id !== parseInt(quizId)) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const option = await createQuizOption(questionId, option_text, is_correct || false);
        res.json({ success: true, data: option });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an option
router.put('/:quizId/questions/:questionId/options/:optionId', async (req, res) => {
    try {
        const { optionId } = req.params;
        const { option_text, is_correct } = req.body;

        if (!option_text) {
            return res.status(400).json({ error: 'option_text is required' });
        }

        const option = await updateQuizOption(optionId, option_text, is_correct);
        res.json({ success: true, data: option });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an option
router.delete('/:quizId/questions/:questionId/options/:optionId', async (req, res) => {
    try {
        const { optionId } = req.params;
        await deleteQuizOption(optionId);
        res.json({ success: true, message: 'Option deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
