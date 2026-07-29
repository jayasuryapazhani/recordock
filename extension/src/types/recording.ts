export const RECORDING_STATE_KEY = "recordingState";

export type RecordingStatus =
  | "idle"
  | "selecting"
  | "recording"
  | "stopping"
  | "ready"
  | "error";

export interface RecordingState {
  status: RecordingStatus;
  startedAt: number | null;
  filename: string | null;
  fileSizeBytes: number | null;
  hasAudio: boolean | null;
  errorMessage: string | null;
}

export const IDLE_RECORDING_STATE: RecordingState = {
  status: "idle",
  startedAt: null,
  filename: null,
  fileSizeBytes: null,
  hasAudio: null,
  errorMessage: null,
};