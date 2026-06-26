import { Router } from 'express';
import { brandController } from '../02-controllers/brandController';
import { validate } from '../06-middleware/validate';
import { brandSchema } from '../07-schemas/brandSchema';

const router = Router();

router.get('/', brandController.getAll);
router.post('/', validate(brandSchema), brandController.create);
// Добавляем validate(brandSchema) и в PUT:
router.put('/:id', validate(brandSchema), brandController.update); 
router.delete('/:id', brandController.delete);

export default router;