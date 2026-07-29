import { saveLatestRecording } from "../storage/recordingBlobStore";
import type {
  MessageResponse,
  OffscreenCommand,
  OffscreenEvent,
} from "../types/messages";

let capturedStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordingChunks: Blob[] = [];
let recordingFailed = false;

function selectSupportedMimeType(): string | undefined {
  const mimeTypes = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  return mimeTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );
}


function padNumber(value: number): string {
  return value.toString().padStart(2, "0");
}

function generateRecordingFilename(): string {
  const now = new Date();

  const date = [
    now.getFullYear(),
    padNumber(now.getMonth() + 1),
    padNumber(now.getDate()),
  ].join("");

  const time = [
    padNumber(now.getHours()),
    padNumber(now.getMinutes()),
    padNumber(now.getSeconds()),
  ].join("");

  return `recordock-${date}-${time}.webm`;
}

function stopCapturedTracks(): void {
  capturedStream?.getTracks().forEach((track) => {
    track.stop();
  });

  capturedStream = null;
}

function resetRecorder(): void {
  mediaRecorder = null;
  recordingChunks = [];
}

async function sendToBackground(
  message: OffscreenEvent,
): Promise<void> {
  await chrome.runtime.sendMessage(message);
}


async function finalizeRecording(): Promise<void> {
  if (recordingFailed) {
    return;
  }

  try {
    const mimeType =
      mediaRecorder?.mimeType || "video/webm";

    const recordingBlob = new Blob(recordingChunks, {
      type: mimeType,
    });

    stopCapturedTracks();

    if (recordingBlob.size === 0) {
      throw new Error(
        "The recording stopped before any video data was created.",
      );
    }

    const filename = generateRecordingFilename();

    await saveLatestRecording({
      blob: recordingBlob,
      filename,
      mimeType,
      fileSizeBytes: recordingBlob.size,
      createdAt: Date.now(),
    });

    resetRecorder();

    await sendToBackground({
      target: "background",
      type: "RECORDING_READY",
      filename,
      fileSizeBytes: recordingBlob.size,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Recordock could not prepare the recording.";

    await failRecording(errorMessage);
  }
}
async function failRecording(
  errorMessage: string,
): Promise<void> {
  if (recordingFailed) {
    return;
  }

  recordingFailed = true;

  stopCapturedTracks();
  resetRecorder();

  await sendToBackground({
    target: "background",
    type: "RECORDING_FAILED",
    errorMessage,
  });
}

function stopCurrentRecording(): MessageResponse {
  if (
    !mediaRecorder ||
    mediaRecorder.state === "inactive"
  ) {
    return {
      ok: false,
      error: "There is no active recording to stop.",
    };
  }

  mediaRecorder.stop();

  return {
    ok: true,
  };
}

async function startMediaRecorder(): Promise<void> {
  if (
    mediaRecorder &&
    mediaRecorder.state !== "inactive"
  ) {
    throw new Error("A recording is already active.");
  }

  recordingChunks = [];
  recordingFailed = false;

  try {
    capturedStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "NotAllowedError"
    ) {
      throw new Error(
        "Screen selection was cancelled or permission was denied.",
      );
    }

    throw error;
  }

  const videoTrack = capturedStream.getVideoTracks()[0];

  if (!videoTrack) {
    stopCapturedTracks();

    throw new Error(
      "Recordock could not access the selected screen.",
    );
  }

  const supportedMimeType = selectSupportedMimeType();

  mediaRecorder = supportedMimeType
    ? new MediaRecorder(capturedStream, {
        mimeType: supportedMimeType,
      })
    : new MediaRecorder(capturedStream);

  mediaRecorder.addEventListener(
    "dataavailable",
    (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordingChunks.push(event.data);
      }
    },
  );

  mediaRecorder.addEventListener("stop", () => {
    void finalizeRecording();
  });

  mediaRecorder.addEventListener("error", () => {
    void failRecording(
      "The browser encountered an error while recording.",
    );
  });

  videoTrack.addEventListener("ended", () => {
    if (
      mediaRecorder &&
      mediaRecorder.state !== "inactive"
    ) {
      mediaRecorder.stop();
    }
  });

  mediaRecorder.start(1000);

  await sendToBackground({
    target: "background",
    type: "RECORDING_STARTED",
    startedAt: Date.now(),
  });
}
chrome.runtime.onMessage.addListener(
  (
    rawMessage: unknown,
    _sender,
    sendResponse,
  ): boolean => {
    const message = rawMessage as OffscreenCommand;

    if (message.target !== "offscreen") {
      return false;
    }

    if (message.type === "STOP_MEDIA_RECORDER") {
      sendResponse(stopCurrentRecording());
      return false;
    }

    if (message.type === "START_MEDIA_RECORDER") {
void startMediaRecorder()
        .then(() => {
          sendResponse({
            ok: true,
          } satisfies MessageResponse);
        })
        .catch(async (error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Recordock could not start MediaRecorder.";

          await failRecording(errorMessage);

          sendResponse({
            ok: false,
            error: errorMessage,
          } satisfies MessageResponse);
        });

      return true;
    }

    return false;
  },
);

console.info("Recordock offscreen recording engine loaded.");