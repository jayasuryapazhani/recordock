// @vitest-environment node

import "fake-indexeddb/auto";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  deleteLatestRecording,
  getLatestRecording,
  saveLatestRecording,
} from "../storage/recordingBlobStore";

const DATABASE_NAME = "recordock";

function deleteTestDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request =
      indexedDB.deleteDatabase(DATABASE_NAME);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(
        request.error ??
          new Error(
            "The Recordock test database could not be deleted.",
          ),
      );
    };

    request.onblocked = () => {
      reject(
        new Error(
          "The Recordock test database deletion was blocked.",
        ),
      );
    };
  });
}

describe("recordingBlobStore", () => {
  beforeEach(async () => {
    await deleteTestDatabase();
  });

  afterEach(async () => {
    await deleteTestDatabase();
  });

  it("returns null when no recording has been saved", async () => {
    const recording = await getLatestRecording();

    expect(recording).toBeNull();
  });

  it("saves and retrieves the latest recording", async () => {
    const recordingBlob = new Blob(
      ["recordock-video-data"],
      {
        type: "video/webm",
      },
    );

    await saveLatestRecording({
      blob: recordingBlob,
      filename:
        "recordock-20260729-132500.webm",
      mimeType: "video/webm",
      fileSizeBytes: recordingBlob.size,
      createdAt: 1_775_000_000_000,
    });

    const storedRecording =
      await getLatestRecording();

    expect(storedRecording).not.toBeNull();

    expect(storedRecording).toMatchObject({
      id: "latest",
      filename:
        "recordock-20260729-132500.webm",
      mimeType: "video/webm",
      fileSizeBytes: recordingBlob.size,
      createdAt: 1_775_000_000_000,
    });

    expect(storedRecording?.blob.type).toBe(
      "video/webm",
    );

    expect(storedRecording?.blob.size).toBe(
      recordingBlob.size,
    );

    expect(
      await storedRecording?.blob.text(),
    ).toBe("recordock-video-data");
  });

  it("replaces the previous recording", async () => {
    const firstBlob = new Blob(["first"], {
      type: "video/webm",
    });

    const secondBlob = new Blob(
      ["second-recording"],
      {
        type: "video/webm",
      },
    );

    await saveLatestRecording({
      blob: firstBlob,
      filename:
        "recordock-20260729-132500.webm",
      mimeType: "video/webm",
      fileSizeBytes: firstBlob.size,
      createdAt: 1_775_000_000_000,
    });

    await saveLatestRecording({
      blob: secondBlob,
      filename:
        "recordock-20260729-132600.webm",
      mimeType: "video/webm",
      fileSizeBytes: secondBlob.size,
      createdAt: 1_775_000_060_000,
    });

    const storedRecording =
      await getLatestRecording();

    expect(storedRecording).toMatchObject({
      id: "latest",
      filename:
        "recordock-20260729-132600.webm",
      mimeType: "video/webm",
      fileSizeBytes: secondBlob.size,
      createdAt: 1_775_000_060_000,
    });

    expect(
      await storedRecording?.blob.text(),
    ).toBe("second-recording");
  });

  it("deletes the latest recording", async () => {
    const recordingBlob = new Blob(
      ["recording-to-delete"],
      {
        type: "video/webm",
      },
    );

    await saveLatestRecording({
      blob: recordingBlob,
      filename:
        "recordock-20260729-132700.webm",
      mimeType: "video/webm",
      fileSizeBytes: recordingBlob.size,
      createdAt: 1_775_000_120_000,
    });

    expect(
      await getLatestRecording(),
    ).not.toBeNull();

    await deleteLatestRecording();

    expect(
      await getLatestRecording(),
    ).toBeNull();
  });
});