import { Router } from 'express';
import { productController } from '../02-controllers/productController';

const router = Router();

router.patch('/variants/:variantId/finish', productController.markVariantAsFinished);
router.patch('/variants/:variantId/expire', productController.markVariantAsExpired);

router.post('/', productController.create);
router.get('/', productController.getAll);
router.put('/:id', productController.update);

router.post('/:id/variants', productController.addVariant);
router.put('/variants/:variantId', productController.updateVariant);


export default router;