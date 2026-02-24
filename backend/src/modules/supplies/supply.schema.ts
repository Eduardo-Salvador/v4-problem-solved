import { z } from "zod";

export const supplyId = z.coerce.number().int().positive();

export const findSuppliesQuery = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export const createSupplyBody = z.object({
  item: z.string().trim().min(1),
  categoria: z.string().trim().min(1),
  estoque: z.number().int().min(0).max(100)
});

export const updateSupplyBody = z
  .object({
    item: z.string().trim().min(1).optional(),
    categoria: z.string().trim().min(1).optional(),
    estoque: z.number().int().min(0).max(100).optional()
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "at least one field is required"
  });

export type FindSuppliesParams = z.infer<typeof findSuppliesQuery>;
export type CreateSupplyData = z.infer<typeof createSupplyBody>;
export type UpdateSupplyData = z.infer<typeof updateSupplyBody>;