import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCommentSchema = z.object({
    wrappedId: z.uuid("Invalid wrappedId format"),
    content: z.string().min(1, "Content cannot be empty").
        max(500, "Content cannot exceed 500 characters")
})

export class CreateCommentDto extends createZodDto(CreateCommentSchema) { }
