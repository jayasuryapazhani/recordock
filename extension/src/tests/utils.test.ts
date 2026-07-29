import {
  describe,
  expect,
  it,
} from "vitest";
import { formatDuration } from "../utils/formatDuration";
import { formatFileSize } from "../utils/formatFileSize";
import { generateRecordingFilename } from "../utils/generateRecordingFilename";

describe("formatDuration", () => {
  it("formats zero seconds", () => {
    expect(formatDuration(0)).toBe("00:00:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125)).toBe("00:02:05");
  });

  it("formats hours, minutes, and seconds", () => {
    expect(formatDuration(3723)).toBe("01:02:03");
  });

  it("prevents negative duration output", () => {
    expect(formatDuration(-10)).toBe("00:00:00");
  });

  it("rounds duration down to a whole second", () => {
    expect(formatDuration(65.9)).toBe("00:01:05");
  });
});

describe("formatFileSize", () => {
  it("formats one megabyte", () => {
    expect(formatFileSize(1_048_576)).toBe(
      "1.00 MB",
    );
  });

  it("formats fractional megabytes", () => {
    expect(formatFileSize(12_949_504)).toBe(
      "12.35 MB",
    );
  });

  it("prevents negative file-size output", () => {
    expect(formatFileSize(-100)).toBe("0.00 MB");
  });
});

describe("generateRecordingFilename", () => {
  it("generates the expected Recordock filename", () => {
    const recordingDate = new Date(
      2026,
      6,
      29,
      13,
      5,
      9,
    );

    expect(
      generateRecordingFilename(recordingDate),
    ).toBe(
      "recordock-20260729-130509.webm",
    );
  });
});