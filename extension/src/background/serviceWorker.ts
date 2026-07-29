import type {
  MessageResponse,
  OffscreenCommand,
  RecordockMessage,
} from "../types/messages";
import {
  IDLE_RECORDING_STATE,
  RECORDING_STATE_KEY,
  type RecordingState,
} from "../types/recording";

const OFFSCREEN_DOCUMENT_PATH = "offscreen.html";

let creatingOffscreenDocument: Promise<void> | null = null;

async function getRecordingState(): Promise<RecordingState> {
  const result = await chrome.storage.session.get(
    RECORDING_STATE_KEY,
  );

  const storedState = result[RECORDING_STATE_KEY] as
    | RecordingState
    | undefined;

  return storedState ?? { ...IDLE_RECORDING_STATE };
}

async function setRecordingState(
  state: RecordingState,
): Promise<void> {
  await chrome.storage.session.set({
    [RECORDING_STATE_KEY]: state,
  });
}

async function clearBadge(): Promise<void> {
  await chrome.action.setBadgeText({
    text: "",
  });
}

async function showRecordingBadge(): Promise<void> {
  await chrome.action.setBadgeBackgroundColor({
    color: "#dc2626",
  });

  await chrome.action.setBadgeText({
    text: "REC",
  });
}

async function resetRecordingState(): Promise<void> {
  await setRecordingState({
    ...IDLE_RECORDING_STATE,
  });

  await clearBadge();
}

async function setErrorState(
  errorMessage: string,
): Promise<void> {
  await setRecordingState({
    status: "error",
    startedAt: null,
    filename: null,
    fileSizeBytes: null,
    hasAudio: null,
    errorMessage,
  });

  await clearBadge();
}

async function hasOffscreenDocument(): Promise<boolean> {
  const offscreenUrl = chrome.runtime.getURL(
    OFFSCREEN_DOCUMENT_PATH,
  );

  const existingContexts =
    await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [offscreenUrl],
    });

  return existingContexts.length > 0;
}

async function ensureOffscreenDocument(): Promise<void> {
    if (await hasOffscreenDocument()) {
      return;
    }

  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen
      .createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: ["DISPLAY_MEDIA"],
        justification:
          "Record a user-selected screen source and create a local WebM file.",
      })
      .finally(() => {
        creatingOffscreenDocument = null;
      });
  }

  await creatingOffscreenDocument;
}


async function sendToOffscreen(
  message: OffscreenCommand,
): Promise<MessageResponse> {
  return (await chrome.runtime.sendMessage(
    message,
  )) as MessageResponse;
}
async function recoverInterruptedRecording(): Promise<RecordingState> {
    const recoveredState: RecordingState = {
      status: "error",
      startedAt: null,
      filename: null,
      fileSizeBytes: null,
      hasAudio: null,
      errorMessage:
        "The previous recording session ended unexpectedly. Start a new recording.",
    };

  await setRecordingState(recoveredState);
  await clearBadge();

  return recoveredState;
}

async function reconcileRecordingState(): Promise<RecordingState> {
  const currentState = await getRecordingState();

  if (
    currentState.status !== "recording" &&
    currentState.status !== "stopping"
  ) {
    return currentState;
  }

  const offscreenExists =
    await hasOffscreenDocument();

  if (!offscreenExists) {
    return recoverInterruptedRecording();
  }

  /*
   * During the stopping state, MediaRecorder may already be
   * inactive while the Blob is still being generated and saved.
   * Therefore, the presence of the offscreen document is enough.
   */
  if (currentState.status === "stopping") {
    return currentState;
  }

  try {
    const response = await sendToOffscreen({
      target: "offscreen",
      type: "GET_MEDIA_RECORDER_STATUS",
    });

    const recorderIsActive =
      response.ok &&
      (response.recorderStatus === "recording" ||
        response.recorderStatus === "paused");

    if (!recorderIsActive) {
      return recoverInterruptedRecording();
    }

    await showRecordingBadge();

    return currentState;
  } catch {
    return recoverInterruptedRecording();
  }
}

async function startRecording(
  captureAudio: boolean,
): Promise<MessageResponse> {
    const currentState = await getRecordingState();

  if (
    currentState.status === "selecting" ||
    currentState.status === "recording" ||
    currentState.status === "stopping"
  ) {
    return {
      ok: false,
      error: "A recording operation is already active.",
    };
  }

    await setRecordingState({
      status: "selecting",
      startedAt: null,
      filename: null,
      fileSizeBytes: null,
      hasAudio: null,
      errorMessage: null,
    });

  try {
    await ensureOffscreenDocument();

    const response = await sendToOffscreen({
      target: "offscreen",
      type: "START_MEDIA_RECORDER",
      captureAudio,
    });

    if (!response.ok) {
      const errorMessage =
        response.error ??
        "The recording engine could not start.";

      if (
        errorMessage ===
        "Screen selection was cancelled or permission was denied."
      ) {
        await resetRecordingState();

        return {
          ok: false,
          error: errorMessage,
        };
      }

      throw new Error(errorMessage);
    }

    return {
      ok: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Recordock could not start the recording.";

    await setErrorState(errorMessage);

    return {
      ok: false,
      error: errorMessage,
    };
  }
}

async function stopRecording(): Promise<MessageResponse> {
  const currentState = await getRecordingState();

    if (currentState.status === "stopping") {
      return {
        ok: false,
        error: "The recording is already stopping.",
      };
    }

    if (currentState.status !== "recording") {
      return {
        ok: false,
        error: "There is no active recording to stop.",
      };
    }

  await setRecordingState({
    ...currentState,
    status: "stopping",
  });

  try {
    const response = await sendToOffscreen({
      target: "offscreen",
      type: "STOP_MEDIA_RECORDER",
    });

    if (!response.ok) {
      throw new Error(
        response.error ??
          "The recording engine could not stop.",
      );
    }

    return {
      ok: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Recordock could not stop the recording.";

    await setErrorState(errorMessage);

    return {
      ok: false,
      error: errorMessage,
    };
  }
}

async function handleMessage(
  message: RecordockMessage,
): Promise<MessageResponse> {
  if (message.target !== "background") {
    return {
      ok: false,
      error: "Message was not intended for the background.",
    };
  }

  switch (message.type) {
    case "GET_RECORDING_STATE":
      return {
        ok: true,
        state: await reconcileRecordingState(),
      };

    case "START_RECORDING":
      return startRecording(message.captureAudio);

    case "STOP_RECORDING":
      return stopRecording();

    case "RECORDING_STARTED":
      await setRecordingState({
        status: "recording",
        startedAt: message.startedAt,
        filename: null,
        fileSizeBytes: null,
        hasAudio: message.hasAudio,
        errorMessage: null,
      });

      await showRecordingBadge();

      return {
        ok: true,
      };

    case "RECORDING_READY": {
      const currentState = await getRecordingState();

      await setRecordingState({
        status: "ready",
        startedAt: null,
        filename: message.filename,
        fileSizeBytes: message.fileSizeBytes,
        hasAudio: currentState.hasAudio,
        errorMessage: null,
      });

      await clearBadge();

      return {
        ok: true,
      };
    }

    case "RECORDING_FAILED":
      await setErrorState(message.errorMessage);

      return {
        ok: true,
      };

    default:
      return {
        ok: false,
        error: "Unsupported Recordock background message.",
      };
  }
}

chrome.runtime.onInstalled.addListener(() => {
  void resetRecordingState().catch((error: unknown) => {
    console.error(
      "Recordock could not initialize its recording state.",
      error,
    );
  });
});

chrome.runtime.onStartup.addListener(() => {
  void resetRecordingState().catch((error: unknown) => {
    console.error(
      "Recordock could not reset its startup state.",
      error,
    );
  });
});

chrome.runtime.onMessage.addListener(
  (
    rawMessage: unknown,
    _sender,
    sendResponse,
  ): boolean => {
    const message = rawMessage as RecordockMessage;

    if (message.target !== "background") {
      return false;
    }

    void handleMessage(message)
      .then(sendResponse)
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unexpected background error.";

        sendResponse({
          ok: false,
          error: errorMessage,
        } satisfies MessageResponse);
      });

    return true;
  },
);