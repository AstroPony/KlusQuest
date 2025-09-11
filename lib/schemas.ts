import { z } from "zod";

export const frequencyEnum = z.enum(["DAILY", "WEEKLY", "ONE_OFF"], {
  required_error: "frequency is required",
  invalid_type_error: "frequency must be a string",
});

export const cuidString = z
  .string({ required_error: "id is required", invalid_type_error: "id must be a string" })
  .min(1, "id is required");

export const choreCreateSchema = z
  .object({
    title: z
      .string({ required_error: "title is required", invalid_type_error: "title must be a string" })
      .trim()
      .min(1, "title cannot be empty")
      .max(120, "title is too long"),
    description: z
      .string({ invalid_type_error: "description must be a string" })
      .trim()
      .max(1000, "description is too long")
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
    frequency: frequencyEnum,
    kidId: z
      .string({ invalid_type_error: "kidId must be a string" })
      .trim()
      .min(1, "kidId cannot be empty")
      .optional(),
    baseXp: z
      .number({ invalid_type_error: "baseXp must be a number" })
      .int("baseXp must be an integer")
      .min(0, "baseXp must be >= 0")
      .max(10000, "baseXp too large")
      .optional()
      .default(10),
    baseCoins: z
      .number({ invalid_type_error: "baseCoins must be a number" })
      .int("baseCoins must be an integer")
      .min(0, "baseCoins must be >= 0")
      .max(10000, "baseCoins too large")
      .optional()
      .default(1),
  })
  .strict();

export const choreUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z
      .string({ invalid_type_error: "description must be a string" })
      .trim()
      .max(1000)
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
    frequency: frequencyEnum.optional(),
    kidId: z.string().trim().min(1).optional().nullable().transform((v) => (v ? v : null)),
    baseXp: z.number().int().min(0).max(10000).optional(),
    baseCoins: z.number().int().min(0).max(10000).optional(),
    active: z.boolean().optional(),
  })
  .strict();

