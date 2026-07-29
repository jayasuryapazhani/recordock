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

vi.mock("../storage/recordingBlobStore", () => ({
  getLatestRecording: mocks.getLatestRecording,
  deleteLatestRecording:
    mocks.deleteLatestRecording,
}));

function setInitialState(
  state: RecordingState,
): void {
  mocks.getRecordingState.mockResolvedValue(state);
}

describe("Recordock popup states", () => {
  beforeEach(() => {
    setInitialState({
      ...IDLE_RECORDING_STATE,
    });

    mocks.requestStartRecording.mockResolvedValue(
      undefined,
    );

    mocks.requestStopRecording.mockResolvedValue(
      undefined,
    );

    mocks.deleteLatestRecording.mockResolvedValue(
      undefined,
    );

    mocks.getLatestRecording.mockResolvedValue(
      null,
    );
  });

  it("renders the idle state", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Start a screen recording",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Start Recording",
      }),
    ).toBeEnabled();

    expect(
      screen.getByText("Browser tab"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Application window"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Complete monitor"),
    ).toBeInTheDocument();
  });

  it("renders the selecting state", async () => {
    setInitialState({
      status: "selecting",
      startedAt: null,
      filename: null,
      fileSizeBytes: null,
      errorMessage: null,
    });

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Choose what to record",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /select a browser tab, application window/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Start Recording",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the recording state with restored timer", async () => {
    const currentTime = new Date(
      "2026-07-29T12:00:00",
    ).getTime();

    vi.spyOn(Date, "now").mockReturnValue(currentTime);

    setInitialState({
      status: "recording",
      startedAt: currentTime - 125_000,
      filename: null,
      fileSizeBytes: null,
      errorMessage: null,
    });

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
      screen.getByRole("button", {
        name: "Stop Recording",
      }),
    ).toBeEnabled();
  });

  it("renders the stopping state", async () => {
    setInitialState({
      status: "stopping",
      startedAt: Date.now() - 10_000,
      filename: null,
      fileSizeBytes: null,
      errorMessage: null,
    });

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Preparing recording",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /creating your local WebM file/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        "Processing recording",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Stop Recording",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the ready state with preview controls", async () => {
    const filename =
      "recordock-20260729-120000.webm";

    setInitialState({
      status: "ready",
      startedAt: null,
      filename,
      fileSizeBytes: 1_048_576,
      errorMessage: null,
    });

    mocks.getLatestRecording.mockResolvedValue({
      id: "latest",
      blob: new Blob(["recording-data"], {
        type: "video/webm",
      }),
      filename,
      mimeType: "video/webm",
      fileSizeBytes: 1_048_576,
      createdAt: Date.now(),
    });

    const { container } = render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Recording ready",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/1\.00 MB/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        container.querySelector("video"),
      ).not.toBeNull();
    });

    expect(
      screen.getByRole("button", {
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
  });

  it("renders the error state", async () => {
    setInitialState({
      status: "error",
      startedAt: null,
      filename: null,
      fileSizeBytes: null,
      errorMessage:
        "The recording session ended unexpectedly.",
    });

    render(<App />);

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "The recording session ended unexpectedly.",
    );

    expect(
      screen.getByRole("button", {
        name: "Start Recording",
      }),
    ).toBeEnabled();
  });
});