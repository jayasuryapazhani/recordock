import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import App from "../App";
import {
  IDLE_RECORDING_STATE,
  type RecordingState,
} from "../types/recording";

const mocks = vi.hoisted(() => ({
  getRecordingState: vi.fn(),
  requestStartRecording: vi.fn(),
  requestStopRecording: vi.fn(),
  getLatestRecording: vi.fn(),
  deleteLatestRecording: vi.fn(),
}));

vi.mock("../popup/popupMessaging", () => ({
  getRecordingState: mocks.getRecordingState,
  requestStartRecording:
    mocks.requestStartRecording,
  requestStopRecording:
    mocks.requestStopRecording,
}));

vi.mock(
  "../storage/recordingBlobStore",
  () => ({
    getLatestRecording:
      mocks.getLatestRecording,
    deleteLatestRecording:
      mocks.deleteLatestRecording,
  }),
);

function createRecordingState(
  state: Partial<RecordingState>,
): RecordingState {
  return {
    ...IDLE_RECORDING_STATE,
    ...state,
  };
}

describe("Recordock popup states", () => {
  beforeEach(() => {
    mocks.getRecordingState.mockResolvedValue({
      ...IDLE_RECORDING_STATE,
    });

    mocks.requestStartRecording.mockResolvedValue(
      undefined,
    );

    mocks.requestStopRecording.mockResolvedValue(
      undefined,
    );

    mocks.getLatestRecording.mockResolvedValue(
      null,
    );

    mocks.deleteLatestRecording.mockResolvedValue(
      undefined,
    );
  });

  it("renders the idle state", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Choose what to include",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Browser tab"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Application window"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Complete monitor"),
    ).toBeInTheDocument();

    const screenAudioCheckbox =
      screen.getByRole("checkbox", {
        name: /screen audio/i,
      });

    expect(screenAudioCheckbox).toBeChecked();
    expect(screenAudioCheckbox).toBeEnabled();

    expect(
      screen.getByRole("checkbox", {
        name: /microphone/i,
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("checkbox", {
        name: /camera overlay/i,
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Start Recording",
      }),
    ).toBeEnabled();

    expect(
      screen.getByText("Privacy by design"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /recordings are processed locally and remain on your device/i,
      ),
    ).toBeInTheDocument();
  });

  it("starts a video-only recording when screen audio is disabled", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Choose what to include",
    });

    const screenAudioCheckbox =
      screen.getByRole("checkbox", {
        name: /screen audio/i,
      });

    await user.click(screenAudioCheckbox);

    expect(screenAudioCheckbox).not.toBeChecked();

    await user.click(
      screen.getByRole("button", {
        name: "Start Recording",
      }),
    );

    await waitFor(() => {
      expect(
        mocks.requestStartRecording,
      ).toHaveBeenCalledWith(false);
    });
  });

  it("renders the selecting state", async () => {
    mocks.getRecordingState.mockResolvedValue(
      createRecordingState({
        status: "selecting",
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Choose what to record",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /select a browser tab, application window, or monitor/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /enable audio in chrome’s picker when you want to include source sound/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Waiting for selection"),
    ).toBeInTheDocument();
  });

  it("renders the recording state with restored timer", async () => {
    const currentTimestamp =
      1_775_000_125_000;

    vi.spyOn(Date, "now").mockReturnValue(
      currentTimestamp,
    );

    mocks.getRecordingState.mockResolvedValue(
      createRecordingState({
        status: "recording",
        startedAt:
          currentTimestamp - 125_000,
        hasAudio: true,
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Recording in progress",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("00:02:05"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Screen audio included",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Stop Recording",
      }),
    ).toBeEnabled();
  });

  it("renders the stopping state", async () => {
    mocks.getRecordingState.mockResolvedValue(
      createRecordingState({
        status: "stopping",
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Preparing recording",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /creating your local webm file/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        "Processing recording",
      ),
    ).toBeInTheDocument();
  });

  it("renders the ready state with preview controls", async () => {
    const recordingBlob = new Blob(
      ["recordock-preview"],
      {
        type: "video/webm",
      },
    );

    mocks.getRecordingState.mockResolvedValue(
      createRecordingState({
        status: "ready",
        filename:
          "recordock-20260729-120000.webm",
        fileSizeBytes: 1_048_576,
        hasAudio: false,
      }),
    );

    mocks.getLatestRecording.mockResolvedValue({
      id: "latest",
      blob: recordingBlob,
      filename:
        "recordock-20260729-120000.webm",
      mimeType: "video/webm",
      fileSizeBytes: recordingBlob.size,
      createdAt: 1_775_000_000_000,
    });

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Preview and download",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Recording ready"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "recordock-20260729-120000.webm",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("1.00 MB"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Video only"),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", {
        name: "Download",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Expand",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Record Again",
      }),
    ).toBeEnabled();

    expect(
      document.querySelector(
        "video.recording-preview",
      ),
    ).toBeInTheDocument();
  });

  it("renders the error state", async () => {
    mocks.getRecordingState.mockResolvedValue(
      createRecordingState({
        status: "error",
        errorMessage:
          "Recordock could not start recording.",
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Choose what to include",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent(
      "Recordock could not start recording.",
    );

    expect(
      screen.getByRole("button", {
        name: "Start Recording",
      }),
    ).toBeEnabled();
  });
});