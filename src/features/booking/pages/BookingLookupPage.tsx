import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { useBookingLookupMutation } from "../hooks";

export function BookingLookupPage() {
  const navigate = useNavigate();
  const [bookingCode, setBookingCode] = useState("");
  const [notFound, setNotFound] = useState(false);
  const lookupMutation = useBookingLookupMutation();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setNotFound(false);
    lookupMutation.mutate(bookingCode, {
      onSuccess: (booking) => {
        if (booking) {
          navigate(`/bookings/${booking.id}`);
        } else {
          setNotFound(true);
        }
      },
    });
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Tra cứu vé</CardTitle>
        <CardDescription>Nhập mã vé để xem chi tiết đơn đặt vé của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bookingCode">Mã vé</Label>
            <Input
              id="bookingCode"
              placeholder="BK-00000001"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
            />
          </div>
          {notFound && (
            <p className="text-sm text-red-600">Không tìm thấy vé với mã này, vui lòng kiểm tra lại.</p>
          )}
          <Button type="submit" disabled={!bookingCode.trim() || lookupMutation.isPending}>
            {lookupMutation.isPending && <Spinner />}
            Tra cứu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
