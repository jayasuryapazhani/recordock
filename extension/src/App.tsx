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
        <div className="popup__identity">
          <img
            className="app-logo"
            src="/icons/icon128.png"
            alt=""
            aria-hidden="true"
          />

          <div className="popup__header-copy">
            <h1>Recordock</h1>

            <p className="tagline">
              Record your screen. Keep it local.
            </p>
          </div>
        </div>

        <span className="local-pill">
          Local only
        </span>
      </header>

      <section
        className="recorder-card"
        aria-labelledby="recorder-heading"
      >
        <div
          className={`status-chip status-chip--${recordingState.status}`}
          aria-live="polite"
        >
          <span className="status-chip__dot" />

          {recordingState.status}
        </div>

        {isRecording && (
          <>
            <div className="recording-heading">
              <span className="section-kicker">
                Active recording
              </span>

              <h2 id="recorder-heading">
                Recording in progress
              </h2>
            </div>

            <div className="recording-display">
              <div className="recording-status-label">
                <span className="recording-pulse" />

                Recording
              </div>

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
                  {recordingState.hasAudio
                    ? "●"
                    : "○"}
                </span>

                {recordingState.hasAudio
                  ? "Screen audio included"
                  : "Video only"}
              </p>
            </div>

            <button
              className="primary-button primary-button--stop"
              type="button"
              onClick={handleStop}
            >
              <span
                className="button-stop-icon"
                aria-hidden="true"
              />

              Stop Recording
            </button>
          </>
        )}

        {isSelecting && (
          <div className="state-panel">
            <div
              className="selection-indicator"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <span className="section-kicker">
              Waiting for selection
            </span>

            <h2 id="recorder-heading">
              Choose what to record
            </h2>

            <p className="state-message">
              Select a browser tab, application window, or
              monitor. Enable audio in Chrome’s picker when
              you want to include source sound.
            </p>
          </div>
        )}

        {isStopping && (
          <div className="state-panel">
            <div
              className="processing-indicator"
              aria-label="Processing recording"
            />

            <span className="section-kicker">
              Processing locally
            </span>

            <h2 id="recorder-heading">
              Preparing recording
            </h2>

            <p className="state-message">
              Recordock is creating your local WebM file.
            </p>
          </div>
        )}

        {isReady && (
          <>
            <div className="ready-heading">
              <div
                className="ready-icon"
                aria-hidden="true"
              >
                ✓
              </div>

              <div>
                <span className="section-kicker">
                  Recording ready
                </span>

                <h2 id="recorder-heading">
                  Preview and download
                </h2>

                <p>
                  Review your recording before saving it.
                </p>
              </div>
            </div>

            <div className="ready-details">
              <div className="ready-detail">
                <span>File</span>

                <strong
                  title={
                    recordingState.filename ?? ""
                  }
                >
                  {recordingState.filename}
                </strong>
              </div>

              {recordingState.fileSizeBytes !== null && (
                <div className="ready-detail">
                  <span>Size</span>

                  <strong>
                    {formatFileSize(
                      recordingState.fileSizeBytes,
                    )}
                  </strong>
                </div>
              )}

              <div className="ready-detail">
                <span>Audio</span>

                <strong>
                  {recordingState.hasAudio
                    ? "Screen audio included"
                    : "Video only"}
                </strong>
              </div>
            </div>

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
                    <span aria-hidden="true">
                      ↓
                    </span>

                    Download
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={handleExpand}
                  >
                    <span aria-hidden="true">
                      ↗
                    </span>

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
              <span aria-hidden="true">
                ↻
              </span>

              Record Again
            </button>
          </>
        )}

        {!isRecording &&
          !isSelecting &&
          !isStopping &&
          !isReady && (
            <>
              <div className="recorder-heading">
                <span className="section-kicker">
                  Recording options
                </span>

                <h2 id="recorder-heading">
                  Choose what to include
                </h2>

                <p className="recorder-card__description">
                  Chrome will ask you to choose a browser
                  tab, application window, or monitor after
                  you start.
                </p>
              </div>

              {recordingState.status === "error" && (
                <p
                  className="error-message"
                  role="alert"
                >
                  {recordingState.errorMessage}
                </p>
              )}

              <ul
                className="source-list"
                aria-label="Supported recording sources"
              >
                {supportedSources.map((source) => (
                  <li key={source}>
                    <span
                      className="source-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    {source}
                  </li>
                ))}
              </ul>

              <fieldset className="recording-options">
                <legend>Recording options</legend>

                <label
                  className={`recording-option ${
                    captureAudio
                      ? "recording-option--selected"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={captureAudio}
                    onChange={(event) => {
                      setCaptureAudio(
                        event.target.checked,
                      );
                    }}
                  />

                  <span className="option-copy">
                    <strong>Screen audio</strong>

                    <small>
                      Request available tab or system sound
                      from the selected source.
                    </small>
                  </span>
                </label>

                <label className="recording-option recording-option--disabled">
                  <input
                    type="checkbox"
                    disabled
                  />

                  <span className="option-copy">
                    <strong>
                      Microphone

                      <span className="coming-soon">
                        Later
                      </span>
                    </strong>

                    <small>
                      Microphone capture will be added in a
                      later Recordock release.
                    </small>
                  </span>
                </label>

                <label className="recording-option recording-option--disabled">
                  <input
                    type="checkbox"
                    disabled
                  />

                  <span className="option-copy">
                    <strong>
                      Camera overlay

                      <span className="coming-soon">
                        Later
                      </span>
                    </strong>

                    <small>
                      Add a movable camera bubble in a
                      future release.
                    </small>
                  </span>
                </label>
              </fieldset>

              <button
                className="primary-button"
                type="button"
                onClick={handleStart}
              >
                <span
                  className="button-record-icon"
                  aria-hidden="true"
                />

                Start Recording
              </button>

              <p className="local-recording-note">
                Your recording stays on this device until
                you download it.
              </p>
            </>
          )}
      </section>

      <footer className="privacy-notice">
        <span
          className="privacy-notice__icon"
          aria-hidden="true"
        >
          ✓
        </span>

        <div>
          <strong>Privacy by design</strong>

          <p>
            Recordings are processed locally and remain on
            your device.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;