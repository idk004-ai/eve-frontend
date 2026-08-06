import { useEffect, useState } from "react";
import { formatCountdown, secondsUntil } from "../utils";

interface HoldCountdownProps {
  expiresAt: string;
  onExpire: () => void;
}

export function HoldCountdown({ expiresAt, onExpire }: HoldCountdownProps) {
  // Lazy init đọc `expiresAt` tại thời điểm mount — component được remount bằng `key={hold.id}`
  // ở nơi gọi mỗi khi có hold mới nên không cần đồng bộ lại giá trị này trong effect.
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(expiresAt));

  // Luôn tính lại từ `expiresAt` thay vì đếm dồn từng giây — đồng bộ đúng với TTL
  // ngay cả khi tab bị throttle/ngủ, không bị trôi so với thời điểm hold thật hết hạn.
  useEffect(() => {
    const interval = setInterval(() => setSecondsLeft(secondsUntil(expiresAt)), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (secondsLeft <= 0) onExpire();
  }, [secondsLeft, onExpire]);

  return (
    <p className="text-sm font-medium text-amber-700">
      Đang giữ ghế — còn lại <span className="tabular-nums">{formatCountdown(secondsLeft)}</span>
    </p>
  );
}
