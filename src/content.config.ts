import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

export const collections = {
  scene: defineCollection({
    // Load Typst files in the `content/article/` directory.
    loader: glob({ base: "content/scene", pattern: "*.typ" }),
    // Type-check frontmatter using a schema
    schema: z.object({
      title: z.string(),
      author: z.string().optional(),
      description: z.any().optional(),
    }),
  }),
};
