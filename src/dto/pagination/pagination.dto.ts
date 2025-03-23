import { z } from "zod";

export const paginationDto = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
});

export const paginationResponseDto = <T>(schema: z.ZodType<T>) =>
  z.object({
    results: z.array(schema),
    total: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  });
