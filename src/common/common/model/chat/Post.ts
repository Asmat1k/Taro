import { z } from "zod"

export interface Post {
  userId: number,
  id: number,
  title: string,
  body: string,
}

export const PostSchema: z.ZodType<Post>  = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
})
