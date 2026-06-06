const { z } = require("zod");

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title cannot be empty")
  .max(200, "Title must be 200 characters or fewer");

const contentSchema = z
  .string()
  .max(100000, "Content must be 100,000 characters or fewer");

const tagsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Tags cannot be empty")
      .max(50, "Each tag must be 50 characters or fewer")
  )
  .max(20, "A note can have at most 20 tags");

const createNoteSchema = z
  .object({
    title: titleSchema.optional(),
    content: contentSchema.optional(),
    tags: tagsSchema.optional(),
  })
  .strict();

const updateNoteSchema = createNoteSchema.refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update" }
);

const noteIdSchema = z.object({
  id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Note ID must be a valid MongoDB ObjectId"),
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
};
