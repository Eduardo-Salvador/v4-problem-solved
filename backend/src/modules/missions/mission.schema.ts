import { z } from "zod";

export const findMissionsQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export const createMissionBody = z.object({
  nome: z.string().trim().min(1),
  astronautId: z.number().int().positive(),
  supplyId: z.number().int().positive()
});

export type FindMissionsParams = z.infer<typeof findMissionsQuery>;
export type CreateMissionData = z.infer<typeof createMissionBody>;