export const formatTime = (raw?: string): string => {
  if (!raw || typeof raw !== "string") return "0s";

  const parts = raw.split(":").map((p) => parseFloat(p));

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);

    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  return raw;
};
