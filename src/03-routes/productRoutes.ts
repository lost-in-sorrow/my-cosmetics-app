import { Router } from 'express';
import { productController } from '../02-controllers/productController';

const router = Router();

/**
 * @openapi
 * /api/products/variants/{variantId}/finish:
 *   patch:
 *     summary: Mark a product variant as finished
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/VariantIdPathParam'
 *     responses:
 *       200:
 *         description: Variant status updated to finished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/variants/:variantId/finish', productController.markVariantAsFinished);

/**
 * @openapi
 * /api/products/variants/{variantId}/expire:
 *   patch:
 *     summary: Mark a product variant as expired
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/VariantIdPathParam'
 *     responses:
 *       200:
 *         description: Variant status updated to expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/variants/:variantId/expire', productController.markVariantAsExpired);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Create a product with its first variant
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductWithVariantInput'
 *     responses:
 *       201:
 *         description: Product and first variant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductWithVariant'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', productController.create);

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get products with variants
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/PageQueryParam'
 *       - $ref: '#/components/parameters/LimitQueryParam'
 *     responses:
 *       200:
 *         description: List of products that have variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductListItem'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', productController.getAll);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', productController.update);

/**
 * @openapi
 * /api/products/{id}/variants:
 *   post:
 *     summary: Add a variant to a product
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariantUpdateInput'
 *     responses:
 *       201:
 *         description: Variant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/variants', productController.addVariant);

/**
 * @openapi
 * /api/products/variants/{variantId}:
 *   put:
 *     summary: Update a product variant
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/VariantIdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariantInput'
 *     responses:
 *       200:
 *         description: Variant updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/variants/:variantId', productController.updateVariant);


export default router;
