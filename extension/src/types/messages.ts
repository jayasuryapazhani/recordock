import type { RecordingState } from "./recording";

export type RecorderRuntimeStatus =
  | "inactive"
  | "recording"
  | "paused";

export type BackgroundRequest =
  | {
      target: "background";
      type: "GET_RECORDING_STATE";
    }
  | {
      target: "background";
      type: "START_RECORDING";
    }
  | {
      target: "background";
      type: "STOP_RECORDING";
    };

export type OffscreenCommand =
  | {
      target: "offscreen";
      type: "START_MEDIA_RECORDER";
    }
  | {
      target: "offscreen";
      type: "STOP_MEDIA_RECORDER";
    }
  | {
      target: "offscreen";
      type: "GET_MEDIA_RECORDER_STATUS";
    };

export type OffscreenEvent =
  | {
      target: "background";
      type: "RECORDING_STARTED";
      startedAt: number;
    }
  | {
      target: "background";
      type: "RECORDING_READY";
      filename: string;
      fileSizeBytes: number;
    }
  | {
      target: "background";
      type: "RECORDING_FAILED";
      errorMessage: string;
    };

export type RecordockMessage =
  | BackgroundRequest
  | OffscreenCommand
  | OffscreenEvent;

export interface MessageResponse {
  ok: boolean;
  state?: RecordingState;
  recorderStatus?: RecorderRuntimeStatus;
  error?: string;
}