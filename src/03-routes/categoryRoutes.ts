import { Router } from 'express';
import { categoryController } from '../02-controllers/categoryController';
import { validate } from '../06-middleware/validate';
import { categorySchema } from '../07-schemas/categorySchema';

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Get categories
 *     tags:
 *       - Categories
 *     parameters:
 *       - $ref: '#/components/parameters/PageQueryParam'
 *       - $ref: '#/components/parameters/LimitQueryParam'
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', categoryController.getAll);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Create a category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
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
router.post('/', validate(categorySchema), categoryController.create);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
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
router.put('/:id', validate(categorySchema), categoryController.update);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - $ref: '#/components/parameters/IdPathParam'
 *     responses:
 *       204:
 *         description: Category deleted
 *       400:
 *         description: Category cannot be deleted or request is invalid
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Cannot delete a category with child categories.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', categoryController.delete);

export default router;
