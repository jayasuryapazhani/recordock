import {
  useEffect,
  useState,
} from "react";
import "./App.css";
import {
  getRecordingState,
  requestStartRecording,
  requestStopRecording,
} from "./popup/popupMessaging";
import {
  deleteLatestRecording,
  getLatestRecording,
} from "./storage/recordingBlobStore";
import {
  IDLE_RECORDING_STATE,
  RECORDING_STATE_KEY,
  type RecordingState,
} from "./types/recording";
import { formatDuration } from "./utils/formatDuration";
import { formatFileSize } from "./utils/formatFileSize";
const supportedSources = [
  "Browser tab",
  "Application window",
  "Complete monitor",
];


function App() {
  const [recordingState, setRecordingState] =
    useState<RecordingState>({
      ...IDLE_RECORDING_STATE,
    });

  const [currentTime, setCurrentTime] = useState(
    Date.now(),
  );

  const [previewUrl, setPreviewUrl] = useState<
    string | null
  >(null);

  const [previewLoading, setPreviewLoading] =
    useState(false);

  const [previewError, setPreviewError] = useState<
    string | null
  >(null);
const [captureAudio, setCaptureAudio] =
  useState(true);

  useEffect(() => {
    void getRecordingState()
      .then(setRecordingState)
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Recordock could not load its current state.";

        setRecordingState({
          status: "error",
          startedAt: null,
          filename: null,
          fileSizeBytes: null,
          hasAudio: null,
          errorMessage,
        });
      });

    const handleStorageChange = (
      changes: Record<
        string,
        chrome.storage.StorageChange
      >,
      areaName: string,
    ): void => {
      if (areaName !== "session") {
        return;
      }

      const stateChange =
        changes[RECORDING_STATE_KEY];

      if (!stateChange?.newValue) {
        return;
      }

      setRecordingState(
        stateChange.newValue as RecordingState,
      );
    };

    chrome.storage.onChanged.addListener(
      handleStorageChange,
    );

    return () => {
      chrome.storage.onChanged.removeListener(
        handleStorageChange,
      );
    };
  }, []);

  useEffect(() => {
    if (recordingState.status !== "recording") {
      return;
    }

    setCurrentTime(Date.now());

    const timerId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [recordingState.status]);

  useEffect(() => {
    let activeObjectUrl: string | null = null;
    let cancelled = false;

    if (recordingState.status !== "ready") {
      setPreviewUrl(null);
      setPreviewError(null);
      setPreviewLoading(false);

      return;
    }

    setPreviewLoading(true);
    setPreviewError(null);

    void getLatestRecording()
      .then((recording) => {
        if (cancelled) {
          return;
        }

        if (!recording) {
          throw new Error(
            "The completed recording could not be found.",
          );
        }

        activeObjectUrl = URL.createObjectURL(
          recording.blob,
        );

        setPreviewUrl(activeObjectUrl);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Recordock could not load the preview.";

        setPreviewError(errorMessage);
      })
      .finally(() => {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      });

    return () => {
      cancelled = true;

      if (activeObjectUrl) {
        URL.revokeObjectURL(activeObjectUrl);
      }
    };
  }, [
    recordingState.status,
    recordingState.filename,
  ]);

  const elapsedSeconds = recordingState.startedAt
    ? Math.max(
        0,
        Math.floor(
          (currentTime - recordingState.startedAt) /
            1000,
        ),
      )
    : 0;

  const startRecording = async (): Promise<void> => {
    setRecordingState({
      status: "selecting",
      startedAt: null,
      filename: null,
      fileSizeBytes: null,
      hasAudio: null,
      errorMessage: null,
    });

    try {
await requestStartRecording(captureAudio);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Recordock could not start recording.";

      if (
        errorMessage ===
        "Screen selection was cancelled or permission was denied."
      ) {
        setRecordingState({
          ...IDLE_RECORDING_STATE,
        });

        return;
      }

      setRecordingState({
        status: "error",
        startedAt: null,
        filename: null,
        fileSizeBytes: null,
        hasAudio: null,
        errorMessage,
      });
    }
  };

  const handleStart = (): void => {
    void startRecording();
  };

  const handleStop = (): void => {
    setRecordingState((currentState) => ({
      ...currentState,
      status: "stopping",
    }));

    void requestStopRecording().catch(
      (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Recordock could not stop recording.";

        setRecordingState({
          status: "error",
          startedAt: null,
          filename: null,
          fileSizeBytes: null,
          hasAudio: null,
          errorMessage,
        });
      },
    );
  };

  const handleDownload = (): void => {
    if (!previewUrl || !recordingState.filename) {
      setPreviewError(
        "The recording is not available for download.",
      );

      return;
    }

    const downloadLink =
      document.createElement("a");

    downloadLink.href = previewUrl;
    downloadLink.download =
      recordingState.filename;
    downloadLink.style.display = "none";

    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

const handleExpand = (): void => {
  const previewPageUrl =
    chrome.runtime.getURL("preview.html");

  void chrome.windows
    .create({
      url: previewPageUrl,
      type: "popup",
      state: "fullscreen",
      focused: true,
    })
    .catch((error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Recordock could not open the expanded preview.";

      setPreviewError(errorMessage);
    });
};

  const handleRecordAgain = (): void => {
    void deleteLatestRecording()
      .catch(() => {
        // A previous recording should not prevent
        // the user from starting another one.
      })
      .finally(() => {
        void startRecording();
      });
  };

  const isRecording =
    recordingState.status === "recording";

  const isSelecting =
    recordingState.status === "selecting";

  const isStopping =
    recordingState.status === "stopping";

  const isReady =
    recordingState.status === "ready";

  return (
    <main className="popup">
      <header className="popup__header">
        <div
          className="brand-mark"
          aria-hidden="true"
        >
          <span className="brand-mark__record-dot" />
        </div>

        <div>
          <h1>Recordock</h1>

          <p className="tagline">
            Record your screen. Keep it local.
          </p>
        </div>
      </header>

      <section
        className="recorder-card"
        aria-labelledby="recorder-heading"
      >
        <div
          className={`status-chip status-chip--${recordingState.status}`}
        >
          <span className="status-chip__dot" />

          {recordingState.status}
        </div>

        {isRecording && (
          <>
            <h2 id="recorder-heading">
              Recording in progress
            </h2>

            <div className="recording-timer">
              {formatDuration(elapsedSeconds)}
            </div>
              <p
                className={`audio-status ${
                  recordingState.hasAudio
                    ? "audio-status--included"
                    : "audio-status--video-only"
                }`}
              >
                <span aria-hidden="true">
                  {recordingState.hasAudio ? "●" : "○"}
                </span>

                {recordingState.hasAudio
                  ? "Audio captured"
                  : "Video only"}
              </p>
            <button
              className="primary-button primary-button--stop"
              type="button"
              onClick={handleStop}
            >
              Stop Recording
            </button>
          </>
        )}

        {isSelecting && (
          <>
            <h2 id="recorder-heading">
              Choose what to record
            </h2>

            <p className="state-message">
              Select what to record. To include sound,
              enable Share tab audio or Share system audio
              in Chrome’s picker when available.
            </p>
          </>
        )}

        {isStopping && (
          <>
            <h2 id="recorder-heading">
              Preparing recording
            </h2>

            <p className="state-message">
              Recordock is creating your local WebM file.
            </p>

            <div
              className="processing-indicator"
              aria-label="Processing recording"
            />
          </>
        )}

        {isReady && (
          <>
            <h2 id="recorder-heading">
              Recording ready
            </h2>

            <div className="ready-details">
              <p>
                <strong>File:</strong>{" "}
                {recordingState.filename}
              </p>

              {recordingState.fileSizeBytes !== null && (
                <p>
                  <strong>Size:</strong>{" "}
                  {formatFileSize(
                    recordingState.fileSizeBytes,
                  )}
                </p>
              )}
            </div>
              <p>
                <strong>Audio:</strong>{" "}
                {recordingState.hasAudio
                  ? "Included"
                  : "Video only"}
              </p>            

            {previewLoading && (
              <p className="state-message">
                Loading recording preview…
              </p>
            )}

            {previewError && (
              <p className="error-message" role="alert">
                {previewError}
              </p>
            )}

            {previewUrl && (
              <div className="preview-panel">
                  <video
                    className="recording-preview"
                    src={previewUrl}
                    controls
                    controlsList="nofullscreen noremoteplayback"
                    playsInline
                    preload="metadata"
                  >
                  Your browser does not support video
                  playback.
                </video>

                <div className="preview-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handleDownload}
                  >
                    Download
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={handleExpand}
                  >
                    Expand
                  </button>
                </div>
              </div>
            )}

            <button
              className="text-button"
              type="button"
              onClick={handleRecordAgain}
            >
              Record Again
            </button>
          </>
        )}

        {!isRecording &&
          !isSelecting &&
          !isStopping &&
          !isReady && (
            <>
              <h2 id="recorder-heading">
                Start a screen recording
              </h2>

              {recordingState.status === "error" && (
                <p
                  className="error-message"
                  role="alert"
                >
                  {recordingState.errorMessage}
                </p>
              )}

              <p className="recorder-card__description">
                Record one selected browser tab,
                application window, or complete monitor.
              </p>

              <ul className="source-list">
                {supportedSources.map((source) => (
                  <li key={source}>
                    <span aria-hidden="true">✓</span>
                    {source}
                  </li>
                ))}
              </ul>
                <fieldset className="audio-options">
                  <legend>Recording audio</legend>

                  <label className="audio-option">
                    <input
                      type="radio"
                      name="recording-audio"
                      checked={captureAudio}
                      onChange={() => {
                        setCaptureAudio(true);
                      }}
                    />

                    <span>
                      <strong>Capture available audio</strong>

                      <small>
                        Request tab or system audio. You must also
                        enable audio in Chrome’s screen picker.
                      </small>
                    </span>
                  </label>

                  <label className="audio-option">
                    <input
                      type="radio"
                      name="recording-audio"
                      checked={!captureAudio}
                      onChange={() => {
                        setCaptureAudio(false);
                      }}
                    />

                    <span>
                      <strong>No audio</strong>

                      <small>
                        Record the selected screen as video only.
                      </small>
                    </span>
                  </label>
                </fieldset>
              <button
                className="primary-button"
                type="button"
                onClick={handleStart}
              >
                Start Recording
              </button>
            </>
          )}
      </section>

      <footer className="privacy-notice">
        <span
          className="privacy-notice__icon"
          aria-hidden="true"
        >
          ◉
        </span>

        <div>
          <strong>Local by design</strong>

          <p>
            Recordings are processed locally and remain
            on your device.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;