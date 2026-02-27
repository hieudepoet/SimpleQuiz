import { Request, Response } from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 3000;
const API_QUESTIONS = `http://localhost:${PORT}/api/questions`;
const API_QUIZZES = `http://localhost:${PORT}/api/quizzes`;

const logError = (err: any) => {
    if (axios.isAxiosError(err)) {
        console.error("Axios Error:", err.response?.status, err.response?.data || err.message);
    } else {
        console.error("Error:", err);
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(API_QUESTIONS);
        res.render('questions/list.ejs', { questions: response.data });
    } catch (err) {
        logError(err);
        res.render('questions/list.ejs', { questions: [], error: 'Failed to retrieve questions' });
    }
};

export const formCreate = async (req: Request, res: Response) => {
    try {
        const quizzesRes = await axios.get(API_QUIZZES);
        res.render('questions/create.ejs', { 
            quizzes: quizzesRes.data,
            selectedQuizId: req.query.quizId 
        });
    } catch (err) {
        res.render('questions/create.ejs', { quizzes: [], selectedQuizId: null });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        // Prepare data for API
        const questionData = {
            text: req.body.text,
            options: req.body.options, // Expecting array of strings from form
            keywords: [],
            correctAnswerIndex: parseInt(req.body.correctIndex)
        };

        // Create Question
        const qRes = await axios.post(API_QUESTIONS, questionData);
        const newQuestion = qRes.data;

        // If Quiz selected, assign it
        if (req.body.quizId) {
            try {
                const quizRes = await axios.get(`${API_QUIZZES}/${req.body.quizId}`);
                const quiz = quizRes.data;
                const currentQuestionIds = quiz.questions.map((q: any) => q._id || q);
                
                await axios.put(`${API_QUIZZES}/${req.body.quizId}`, {
                    questions: [...currentQuestionIds, newQuestion._id]
                });
            } catch (assignErr) {
                console.error("Failed to assign to quiz", assignErr);
            }
        }

        res.redirect('/questions');
    } catch (err) {
        logError(err);
        const quizzesRes = await axios.get(API_QUIZZES).catch(() => ({ data: [] }));
        res.render('questions/create.ejs', { 
            error: 'Failed to create question',
            formData: req.body, 
            quizzes: quizzesRes.data 
        });
    }
};

export const details = async (req: Request, res: Response) => {
    try {
        const [questionRes, quizzesRes] = await Promise.all([
            axios.get(`${API_QUESTIONS}/${req.params.id}`),
            axios.get(API_QUIZZES)
        ]);
        const question = questionRes.data;
        const allQuizzes = quizzesRes.data;

        const questionId = question._id.toString();
        const associatedQuizzes = allQuizzes.filter((q: any) => {
            const qIds = (q.questions || []).map((qid: any) => (qid._id || qid).toString());
            return qIds.includes(questionId);
        });

        res.render('questions/details.ejs', { question, associatedQuizzes });
    } catch (err) {
        logError(err);
        res.redirect('/questions');
    }
};

export const formEdit = async (req: Request, res: Response) => {
    try {
        const [questionRes, quizzesRes] = await Promise.all([
            axios.get(`${API_QUESTIONS}/${req.params.id}`),
            axios.get(API_QUIZZES)
        ]);
        const question = questionRes.data;
        const allQuizzes = quizzesRes.data;

        // Determine relationships
        // A quiz contains this question if its 'questions' array includes this question ID
        const questionId = question._id.toString();
        
        const associatedQuizzes = allQuizzes.filter((q: any) => {
            const qIds = (q.questions || []).map((qid: any) => (qid._id || qid).toString());
            return qIds.includes(questionId);
        });

        const availableQuizzes = allQuizzes.filter((q: any) => {
             const qIds = (q.questions || []).map((qid: any) => (qid._id || qid).toString());
             return !qIds.includes(questionId);
        });

        res.render('questions/edit.ejs', { question, associatedQuizzes, availableQuizzes });
    } catch (err) {
        logError(err);
        res.redirect('/questions');
    }
};

export const update = async (req: Request, res: Response) => {
    try {
         const questionData = {
            text: req.body.text,
            options: req.body.options,
            correctAnswerIndex: parseInt(req.body.correctIndex)
        };
        await axios.put(`${API_QUESTIONS}/${req.params.id}`, questionData);
        res.redirect(`/questions/${req.params.id}`);
    } catch (err) {
        logError(err);
        res.redirect(`/questions/${req.params.id}/edit`);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await axios.delete(`${API_QUESTIONS}/${req.params.id}`);
        res.redirect('/questions');
    } catch (err) {
        logError(err);
        res.redirect('/questions');
    }
};

// New Methods for Managing Quiz Membership from Question Side
export const addToQuiz = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Question ID
        const { quizId } = req.body;

        const quizRes = await axios.get(`${API_QUIZZES}/${quizId}`);
        const quiz = quizRes.data;

        const currentQuestionIds = (quiz.questions || []).map((q: any) => q._id || q);
        if(!currentQuestionIds.includes(id)) {
            currentQuestionIds.push(id);
            await axios.put(`${API_QUIZZES}/${quizId}`, { questions: currentQuestionIds });
        }
        
        res.redirect(`/questions/${id}/edit`);
    } catch (err) {
        logError(err);
        res.redirect(`/questions/${req.params.id}/edit`);
    }
};

export const removeFromQuiz = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Question ID
        const { quizId } = req.body;

        const quizRes = await axios.get(`${API_QUIZZES}/${quizId}`);
        const quiz = quizRes.data;

        const currentQuestionIds = (quiz.questions || []).map((q: any) => (q._id || q).toString());
        const updatedQuestionIds = currentQuestionIds.filter((qid: string) => qid !== id);

        await axios.put(`${API_QUIZZES}/${quizId}`, { questions: updatedQuestionIds });

        res.redirect(`/questions/${id}/edit`);
    } catch (err) {
        logError(err);
        res.redirect(`/questions/${req.params.id}/edit`);
    }
};
