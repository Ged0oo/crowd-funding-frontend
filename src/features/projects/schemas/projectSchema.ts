import { z } from "zod";

export const projectDetailsSchema = z
    .object({
        title: z
            .string()
            .min(5, "Title must be at least 5 characters")
            .max(255, "Title must be under 255 characters"),
        details: z
            .string()
            .min(20, "Description must be at least 20 characters")
            .max(5000, "Description must be under 5000 characters"),
        category_id: z
            .number()
            .int("Category must be a valid integer")
            .positive("Please select a category"),
        total_target: z
            .number()
            .positive("Target must be a positive amount")
            .max(100_000_000, "Target cannot exceed 100,000,000 EGP"),
        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().min(1, "End date is required"),
        start_time: z.string().min(1, "Start time is required"),
        end_time: z.string().min(1, "End time is required"),
    })
    .refine(
        (data) => {
            if (data.start_date && data.end_date && data.start_time && data.end_time) {
                const start = new Date(`${data.start_date}T${data.start_time}:00`);
                const end = new Date(`${data.end_date}T${data.end_time}:00`);
                return end > start;
            }
            return true;
        },
        {
            message: "End date/time must be after start date/time",
            path: ["end_date"],
        }
    );

export type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;

export const projectTagsSchema = z.object({
    tags: z
        .array(z.string().min(1).max(50))
        .max(10, "Maximum 10 tags allowed"),
});

export type ProjectTagsFormData = z.infer<typeof projectTagsSchema>;

export const fullProjectSchema = projectDetailsSchema.and(projectTagsSchema);

export type FullProjectFormData = z.infer<typeof fullProjectSchema>;