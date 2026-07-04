import { Router } from 'express';
import { brandController } from '../02-controllers/brandController';
import { validate } from '../06-middleware/validate';
import { brandSchema } from '../07-schemas/brandSchema';

const router = Router();

/**
 * @openapi
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags:
 *       - Brands
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', brandController.getAll);

/**
 * @openapi
 * /api/brands:
 *   post:
 *     summary: Create a brand or return an existing brand with the same name
 *     tags:
 *       - Brands
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       201:
 *         description: Brand created or found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validate(brandSchema), brandController.create);

/**
 * @openapi
 * /api/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags:
 *       - Brands
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       200:
 *         description: Brand updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Invalid id or request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', validate(brandSchema), brandController.update); 

/**
 * @openapi
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags:
 *       - Brands
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       204:
 *         description: Brand deleted
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', brandController.delete);

export default router;
