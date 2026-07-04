import { useEffect, useMemo, useState } from "react";

export interface CountdownResult {
  isExpired: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
}

export function useCountdown(
  endsAt?: string | null,
  durationSeconds?: number
): CountdownResult {
  const target = useMemo(() => {
    const parsed = endsAt ? new Date(endsAt).getTime() : NaN;
    if (!Number.isNaN(parsed)) return parsed;
    return Date.now() + (durationSeconds ?? 0) * 1000;
  }, [endsAt, durationSeconds]);

  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, target - Date.now())
  );

  useEffect(() => {
    setRemainingMs(Math.max(0, target - Date.now()));

    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, target - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isExpired = remainingMs <= 0;

  return {
    isExpired,
    hours,
    minutes,
    seconds,
    label: isExpired
      ? "Süre doldu"
      : `${hours} Saat : ${minutes} Dakika : ${seconds} Saniye`,
  };
}