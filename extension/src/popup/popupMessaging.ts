import type {
  BackgroundRequest,
  MessageResponse,
} from "../types/messages";
import type { RecordingState } from "../types/recording";

async function sendToBackground(
  message: BackgroundRequest,
): Promise<MessageResponse> {
  return (await chrome.runtime.sendMessage(
    message,
  )) as MessageResponse;
}

export async function getRecordingState(): Promise<RecordingState> {
  const response = await sendToBackground({
    target: "background",
    type: "GET_RECORDING_STATE",
  });

  if (!response.ok || !response.state) {
    throw new Error(
      response.error ??
        "Recordock could not retrieve the recording state.",
    );
  }

  return response.state;
}

export async function requestStartRecording(): Promise<void> {
  const response = await sendToBackground({
    target: "background",
    type: "START_RECORDING",
  });

  if (!response.ok) {
    throw new Error(
      response.error ?? "Recordock could not start recording.",
    );
  }
}

export async function requestStopRecording(): Promise<void> {
  const response = await sendToBackground({
    target: "background",
    type: "STOP_RECORDING",
  });

  if (!response.ok) {
    throw new Error(
      response.error ?? "Recordock could not stop recording.",
    );
  }
}