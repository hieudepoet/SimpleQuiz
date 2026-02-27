import { Router } from 'express';
import quizRoutes from './quiz.ui.routes';
import questionRoutes from './question.ui.routes';

const router = Router();

// Home page
router.get('/', (req, res) => {
    res.render('index'); // Renders index.hbs using default engine
});

router.use('/quizzes', quizRoutes);
router.use('/questions', questionRoutes);

export default router;
