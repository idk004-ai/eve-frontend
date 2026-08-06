import { z } from "zod";

export const heroSearchSchema = z
  .object({
    from: z.string().min(1, "Vui lòng chọn điểm đi"),
    to: z.string().min(1, "Vui lòng chọn điểm đến"),
    date: z.string().min(1, "Vui lòng chọn ngày đi"),
    returnDate: z.string().optional(),
  })
  .refine((values) => values.from !== values.to, {
    message: "Điểm đi và điểm đến phải khác nhau",
    path: ["to"],
  });

export type HeroSearchFormValues = z.infer<typeof heroSearchSchema>;
