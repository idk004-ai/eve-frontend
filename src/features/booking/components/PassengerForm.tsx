import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { PassengerContact } from "../store";

const passengerSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  phone: z.string().regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
});

export type PassengerFormValues = z.infer<typeof passengerSchema>;

interface PassengerFormProps {
  defaultValues?: Partial<PassengerFormValues>;
  /** Gọi mỗi khi form hợp lệ (react-hook-form `watch` subscription) — dùng để đồng bộ thẳng vào store. */
  onChangeValid: (values: PassengerContact) => void;
}

export function PassengerForm({ defaultValues, onChangeValid }: PassengerFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    const subscription = watch((values) => {
      const result = passengerSchema.safeParse(values);
      if (result.success) onChangeValid(result.data);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChangeValid]);

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Thông tin hành khách</h2>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="passenger-fullName">Họ và tên</Label>
          <Input id="passenger-fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="passenger-phone">Số điện thoại</Label>
          <Input id="passenger-phone" placeholder="0901234567" {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="passenger-email">Email</Label>
          <Input
            id="passenger-email"
            type="email"
            placeholder="ban@email.com"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>
    </div>
  );
}
