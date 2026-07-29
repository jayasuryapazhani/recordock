export function formatFileSize(
  bytes: number,
): string {
  const safeBytes = Number.isFinite(bytes)
    ? Math.max(0, bytes)
    : 0;

  const megabytes = safeBytes / (1024 * 1024);

  return `${megabytes.toFixed(2)} MB`;
}