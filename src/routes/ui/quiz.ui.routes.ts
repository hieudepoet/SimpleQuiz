import { Router } from 'express';
import * as controller from '../../controllers/ui/quiz.ui.controller';

const router = Router();

// Order matters: /new must be before /:id
router.get('/new', controller.formCreate);
router.get('/:id/edit', controller.formEdit);
router.post('/:id/add-question', controller.addQuestion);
router.post('/:id/add-questions', controller.addQuestions);
router.post('/:id/remove-question', controller.removeQuestion);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.details);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
