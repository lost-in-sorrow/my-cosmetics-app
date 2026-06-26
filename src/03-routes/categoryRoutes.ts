import { Router } from 'express';
import { categoryController } from '../02-controllers/categoryController';
import { validate } from '../06-middleware/validate';
import { categorySchema } from '../07-schemas/categorySchema';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', validate(categorySchema), categoryController.create);
router.put('/:id', validate(categorySchema), categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;