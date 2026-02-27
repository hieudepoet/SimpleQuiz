import { Router } from 'express';
import * as controller from '../../controllers/ui/question.ui.controller';

const router = Router();

router.get('/new', controller.formCreate);
router.get('/:id/edit', controller.formEdit);
router.post('/:id/add-to-quiz', controller.addToQuiz);
router.post('/:id/remove-from-quiz', controller.removeFromQuiz);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.details);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
