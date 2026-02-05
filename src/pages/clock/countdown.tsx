import { useEffect, useState } from "react";

const DEFAULT_TIMES = [
  "7:25", "8:10", "8:15", "9:00", "9:05", "9:50", "10:10", "10:55",
  "11:00", "11:45", "11:50", "12:35", "13:35", "14:20",
  "14:25", "15:10", "15:25", "16:10", "16:15", "17:00"
];

export default function LessonCountdown() {
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [DEFAULT_TIMES]);


  const getNextTime = () => {
    const now = new Date();
    const nowSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const lessonSeconds = DEFAULT_TIMES.map(t => {
      const [h, m] = t.split(":").map(Number);
      return h * 3600 + m * 60;
    });

    let next = lessonSeconds.find(t => t > nowSeconds);

    if (next === undefined) {
      next = lessonSeconds[0] + 86400; // next day rollover
    }

    const diff = next - nowSeconds;

    const h = Math.floor(diff / 3600) % 24;
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const updateCountdown = () => {
    setCountdown(getNextTime());
  };

  return (
    <div className="flex flex-col pt-60 min-h-screen text-center">
      <h1 className="text-9xl font-bold text-foreground mb-6">
        {countdown}
      </h1>

      {/* <button
        onClick={editTimes}
        className="px-6 py-2 text-lg rounded bg-green-500 text-black hover:bg-green-400 transition"
      >
        Edit times
      </button> */}
    </div>
  );
}