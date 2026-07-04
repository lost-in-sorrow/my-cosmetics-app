import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cosmetics API',
      version: '1.0.0',
      description: 'API for managing cosmetic products, brands, categories, and product variants.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'Brands', description: 'Brand management' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Products', description: 'Product and variant management' },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Validation error' },
          },
        },
        Brand: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'The Ordinary' },
          },
        },
        BrandInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50, example: 'The Ordinary' },
          },
        },
        Category: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Serums' },
            parent_id: { type: 'integer', nullable: true, example: null },
          },
        },
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 2, example: 'Serums' },
            parent_id: { type: 'integer', nullable: true, example: null },
          },
        },
        Product: {
          type: 'object',
          required: ['id', 'name', 'brand_id', 'category_id'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Niacinamide 10% + Zinc 1%' },
            brand_id: { type: 'integer', example: 1 },
            category_id: { type: 'integer', example: 1 },
            description: { type: 'string', nullable: true, example: 'Daily facial serum.' },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'brand_id', 'category_id'],
          properties: {
            name: { type: 'string', example: 'Niacinamide 10% + Zinc 1%' },
            brand_id: { type: 'integer', example: 1 },
            category_id: { type: 'integer', example: 1 },
            description: { type: 'string', nullable: true, example: 'Daily facial serum.' },
          },
        },
        ProductUpdateInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Niacinamide Serum' },
            brand_id: { type: 'integer', example: 1 },
            category_id: { type: 'integer', example: 1 },
            description: { type: 'string', nullable: true, example: 'Updated description.' },
          },
        },
        ProductVariant: {
          type: 'object',
          required: ['id', 'product_id'],
          properties: {
            id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            volume: { type: 'number', nullable: true, example: 30 },
            price: { type: 'number', nullable: true, example: 12.99 },
            purchase_date: { type: 'string', format: 'date-time', nullable: true, example: '2026-06-20T10:00:00.000Z' },
            opened_date: { type: 'string', format: 'date-time', nullable: true, example: null },
            finished_date: { type: 'string', format: 'date-time', nullable: true, example: null },
            image_url: { type: 'string', format: 'uri', nullable: true, example: 'https://example.com/product.jpg' },
            features: {
              type: 'object',
              nullable: true,
              additionalProperties: true,
              example: { skin_type: 'oily' },
            },
            status: {
              type: 'string',
              nullable: true,
              enum: ['new', 'in_use', 'finished', 'expired'],
              example: 'new',
            },
          },
        },
        ProductVariantInput: {
          type: 'object',
          required: ['status'],
          properties: {
            volume: { type: 'number', nullable: true, example: 30 },
            price: { type: 'number', nullable: true, example: 12.99 },
            purchase_date: { type: 'string', format: 'date-time', nullable: true, example: '2026-06-20T10:00:00.000Z' },
            opened_date: { type: 'string', format: 'date-time', nullable: true, example: null },
            finished_date: { type: 'string', format: 'date-time', nullable: true, example: null },
            image_url: { type: 'string', format: 'uri', nullable: true, example: 'https://example.com/product.jpg' },
            features: {
              type: 'object',
              nullable: true,
              additionalProperties: true,
              example: { skin_type: 'oily' },
            },
            status: {
              type: 'string',
              enum: ['new', 'in_use', 'finished', 'expired'],
              example: 'new',
            },
          },
        },
        ProductVariantUpdateInput: {
          type: 'object',
          properties: {
            volume: { type: 'number', nullable: true, example: 30 },
            price: { type: 'number', nullable: true, example: 12.99 },
            purchase_date: { type: 'string', format: 'date-time', nullable: true, example: '2026-06-20T10:00:00.000Z' },
            opened_date: { type: 'string', format: 'date-time', nullable: true, example: null },
            finished_date: { type: 'string', format: 'date-time', nullable: true, example: null },
            image_url: { type: 'string', format: 'uri', nullable: true, example: 'https://example.com/product.jpg' },
            features: {
              type: 'object',
              nullable: true,
              additionalProperties: true,
              example: { skin_type: 'oily' },
            },
            status: {
              type: 'string',
              enum: ['new', 'in_use', 'finished', 'expired'],
              example: 'in_use',
            },
          },
        },
        ProductWithVariantInput: {
          allOf: [
            { $ref: '#/components/schemas/ProductInput' },
            { $ref: '#/components/schemas/ProductVariantInput' },
          ],
        },
        ProductWithVariant: {
          allOf: [
            { $ref: '#/components/schemas/Product' },
            {
              type: 'object',
              properties: {
                variant: { $ref: '#/components/schemas/ProductVariant' },
              },
            },
          ],
        },
        ProductListItem: {
          allOf: [
            { $ref: '#/components/schemas/Product' },
            {
              type: 'object',
              properties: {
                product_variants: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ProductVariant' },
                },
              },
            },
          ],
        },
      },
      parameters: {
        IdPathParam: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
        VariantIdPathParam: {
          name: 'variantId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
        PageQueryParam: {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        LimitQueryParam: {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 10 },
        },
      },
    },
  },
  apis: ['./src/03-routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
