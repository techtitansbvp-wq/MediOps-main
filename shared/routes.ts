import { z } from 'zod';
import { insertConsumerSchema, insertInventorySchema, consumers, inventory, analytics } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  consumers: {
    list: {
      method: 'GET' as const,
      path: '/api/consumers',
      input: z.object({
        search: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof consumers.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/consumers/:id',
      responses: {
        200: z.custom<typeof consumers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/consumers',
      input: insertConsumerSchema,
      responses: {
        201: z.custom<typeof consumers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/consumers/:id',
      input: insertConsumerSchema.partial(),
      responses: {
        200: z.custom<typeof consumers.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/consumers/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  inventory: {
    list: {
      method: 'GET' as const,
      path: '/api/inventory',
      responses: {
        200: z.array(z.custom<typeof inventory.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/inventory',
      input: insertInventorySchema,
      responses: {
        201: z.custom<typeof inventory.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/inventory/:id',
      input: insertInventorySchema.partial(),
      responses: {
        200: z.custom<typeof inventory.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/inventory/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  analytics: {
    list: {
      method: 'GET' as const,
      path: '/api/analytics',
      responses: {
        200: z.array(z.custom<typeof analytics.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CreateConsumerRequest = z.infer<typeof api.consumers.create.input>;
export type UpdateConsumerRequest = z.infer<typeof api.consumers.update.input>;
export type ConsumerResponse = z.infer<typeof api.consumers.get.responses[200]>;
export type InventoryResponse = z.infer<typeof api.inventory.list.responses[200][number]>;
export type AnalyticsResponse = z.infer<typeof api.analytics.list.responses[200][number]>;
