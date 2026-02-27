import { Request, Response } from "express";
import axios from "axios";

const PORT = process.env.PORT || 3000;
const API_BASE = `http://localhost:${PORT}/api/quizzes`;
const API_QUESTIONS = `http://localhost:${PORT}/api/questions`;

const logError = (err: any) => {
  if (axios.isAxiosError(err)) {
    console.error("Axios Error:", err.response?.data || err.message);
  } else {
    console.error("Error:", err);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(API_BASE);
    res.render("quiz/list.ejs", { quizzes: response.data });
  } catch (err) {
    logError(err);
    res.render("quiz/list.ejs", { quizzes: [], error: "Failed to fetch quizzes" });
  }
};

export const formCreate = (_req: Request, res: Response) => {
  res.render("quiz/create.ejs");
};

export const create = async (req: Request, res: Response) => {
  try {
    await axios.post(API_BASE, req.body);
    res.redirect("/quizzes");
  } catch (err) {
    logError(err);
    res.render("quiz/create.ejs", {
      error: "Failed to create quiz",
      formData: req.body,
    });
  }
};

export const details = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${API_BASE}/${req.params.id}`);
    res.render("quiz/details.ejs", { quiz: response.data });
  } catch (err) {
    logError(err);
    res.redirect("/quizzes");
  }
};

export const formEdit = async (req: Request, res: Response) => {
  try {
    const [quizRes, questionsRes] = await Promise.all([
      axios.get(`${API_BASE}/${req.params.id}`),
      axios.get(API_QUESTIONS),
    ]);
    const quiz = quizRes.data;
    const allQuestions = questionsRes.data;

    // Filter out questions already in the quiz
    const quizQuestionIds = (quiz.questions || []).map((q: any) => (q._id || q).toString());
    const availableQuestions = allQuestions.filter((q: any) => !quizQuestionIds.includes(q._id.toString()));

    res.render("quiz/edit.ejs", { quiz, availableQuestions });
  } catch (err) {
    logError(err);
    res.redirect("/quizzes");
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    await axios.put(`${API_BASE}/${req.params.id}`, req.body);
    res.redirect(`/quizzes/${req.params.id}`);
  } catch (err) {
    logError(err);
    res.redirect(`/quizzes/${req.params.id}/edit`);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await axios.delete(`${API_BASE}/${req.params.id}`);
    res.redirect("/quizzes");
  } catch (err) {
    logError(err);
    res.redirect("/quizzes");
  }
};

// Method for Batch Creating and Adding NEW Questions
export const addQuestions = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let questionsData = req.body.questions;

        // Ensure array format (if it comes as object with keys '0', '1', etc.)
        if (questionsData && typeof questionsData === 'object' && !Array.isArray(questionsData)) {
            questionsData = Object.values(questionsData);
        }

        if (Array.isArray(questionsData)) {
            const formattedQuestions = questionsData.map((q: any) => ({
                text: q.text,
                options: q.options,
                keywords: [],
                correctAnswerIndex: parseInt(q.correctIndex)
            }));

            // Use the bulk create endpoint
            await axios.post(`${API_BASE}/${id}/questions`, formattedQuestions);
        }

        res.redirect(`/quizzes/${id}/edit`);
    } catch (err) {
        logError(err);
        res.redirect(`/quizzes/${req.params.id}/edit`);
    }
};

// New Methods for Managing Questions within Quiz
export const addQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // CASE 1: Add Existing Question
    if (req.body.questionId) {
        const { questionId } = req.body;
        // Fetch current quiz
        const quizRes = await axios.get(`${API_BASE}/${id}`);
        const quiz = quizRes.data;
        
        const currentQuestionIds = (quiz.questions || []).map((q: any) => q._id || q);
        if (!currentQuestionIds.includes(questionId)) {
            currentQuestionIds.push(questionId);
            await axios.put(`${API_BASE}/${id}`, { questions: currentQuestionIds });
        }
    } 
    // CASE 2: Create New Question directly in Quiz
    else if (req.body.text) {
         await axios.post(`${API_BASE}/${id}/question`, {
             text: req.body.text,
             options: req.body.options,
             correctAnswerIndex: parseInt(req.body.correctIndex)
         });
    }

    res.redirect(`/quizzes/${id}/edit`);
  } catch (err) {
    logError(err);
    res.redirect(`/quizzes/${req.params.id}/edit`);
  }
};

export const removeQuestion = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const { questionId } = req.body;

      // Fetch current quiz
      const quizRes = await axios.get(`${API_BASE}/${id}`);
      const quiz = quizRes.data;

      const currentQuestionIds = (quiz.questions || []).map((q: any) => (q._id || q).toString());
      const updatedQuestionIds = currentQuestionIds.filter((qId: string) => qId !== questionId);

      await axios.put(`${API_BASE}/${id}`, { questions: updatedQuestionIds });

      res.redirect(`/quizzes/${id}/edit`);
  } catch (err) {
      logError(err);
      res.redirect(`/quizzes/${req.params.id}/edit`);
  }
}
