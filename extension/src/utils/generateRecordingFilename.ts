function padNumber(value: number): string {
  return value.toString().padStart(2, "0");
}

export function generateRecordingFilename(
  date = new Date(),
): string {
  const datePart = [
    date.getFullYear(),
    padNumber(date.getMonth() + 1),
    padNumber(date.getDate()),
  ].join("");

  const timePart = [
    padNumber(date.getHours()),
    padNumber(date.getMinutes()),
    padNumber(date.getSeconds()),
  ].join("");

  return `recordock-${datePart}-${timePart}.webm`;
}