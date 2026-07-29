import {
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";

const GITHUB_URL =
  "https://github.com/jayasuryapazhani/recordock";

type WebRecorderStatus =
  | "idle"
  | "selecting"
  | "recording"
  | "processing"
  | "ready"
  | "error";

interface RecordockDisplayMediaOptions
  extends DisplayMediaStreamOptions {
  systemAudio?: "include" | "exclude";
  windowAudio?: "system" | "window" | "exclude";
}

const features = [
  {
    number: "01",
    title: "Record any screen",
    description:
      "Capture a browser tab, application window, or complete monitor through your browser's secure source picker.",
  },
  {
    number: "02",
    title: "Optional screen audio",
    description:
      "Request available browser-tab or system audio, or create a completely silent video recording.",
  },
  {
    number: "03",
    title: "Record locally",
    description:
      "Your recording is created inside the browser without being uploaded to a Recordock server.",
  },
  {
    number: "04",
    title: "Preview before saving",
    description:
      "Review the completed recording directly in Recordock before downloading the WebM file.",
  },
  {
    number: "05",
    title: "No account required",
    description:
      "Use the free local recorder without creating an account or connecting cloud storage.",
  },
  {
    number: "06",
    title: "Free version on GitHub",
    description:
      "Review Recordock's public free-version implementation and technical architecture on GitHub.",
  },
];

const steps = [
  {
    number: "1",
    title: "Choose your audio",
    description:
      "Choose whether Recordock should request available screen audio.",
  },
  {
    number: "2",
    title: "Select your source",
    description:
      "Choose a browser tab, application window, or monitor from the browser picker.",
  },
  {
    number: "3",
    title: "Record",
    description:
      "Continue your work while Recordock captures the selected source locally.",
  },
  {
    number: "4",
    title: "Preview and download",
    description:
      "Review the completed recording and save the WebM file to your computer.",
  },
];

const faqs = [
  {
    question: "Does Recordock upload my recordings?",
    answer:
      "No. The web recorder creates and processes recordings locally inside your browser. Recordock does not automatically upload the recording.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Recordock does not require registration, authentication, or a cloud account.",
  },
  {
    question: "What can I record?",
    answer:
      "Your browser allows you to select a browser tab, application window, or complete monitor.",
  },
  {
    question: "Can Recordock capture screen audio?",
    answer:
      "Yes, when the selected source and browser provide an audio track. You must also enable the audio-sharing option in the browser's source picker.",
  },
  {
    question: "What file format does Recordock create?",
    answer:
      "The current recorder creates WebM files that can be previewed and downloaded locally.",
  },
];

function chooseSupportedMimeType(): string {
  const mimeTypes = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  return (
    mimeTypes.find((mimeType) =>
      MediaRecorder.isTypeSupported(mimeType),
    ) ?? ""
  );
}

function createRecordingFilename(): string {
  const now = new Date();

  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const timePart = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `recordock-${datePart}-${timePart}.webm`;
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds),
  );

  const hours = Math.floor(safeSeconds / 3600);

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );

  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) =>
      value.toString().padStart(2, "0"),
    )
    .join(":");
}

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function stopStreamTracks(
  stream: MediaStream | null,
): void {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
}

function App() {
  const [captureScreenAudio, setCaptureScreenAudio] =
    useState(true);

  const [recorderStatus, setRecorderStatus] =
    useState<WebRecorderStatus>("idle");

  const [startedAt, setStartedAt] = useState<
    number | null
  >(null);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [hasCapturedAudio, setHasCapturedAudio] =
    useState(false);

  const [previewUrl, setPreviewUrl] = useState<
    string | null
  >(null);

  const [recordingFilename, setRecordingFilename] =
    useState<string | null>(null);

  const [recordingFileSize, setRecordingFileSize] =
    useState<number | null>(null);

  const [recorderError, setRecorderError] = useState<
    string | null
  >(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const displayStreamRef =
    useRef<MediaStream | null>(null);

  const recordingStreamRef =
    useRef<MediaStream | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (
      recorderStatus !== "recording" ||
      startedAt === null
    ) {
      return;
    }

    const updateTimer = (): void => {
      setElapsedSeconds(
        Math.max(
          0,
          Math.floor(
            (Date.now() - startedAt) / 1000,
          ),
        ),
      );
    };

    updateTimer();

    const timerId = window.setInterval(
      updateTimer,
      1000,
    );

    return () => {
      window.clearInterval(timerId);
    };
  }, [recorderStatus, startedAt]);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      stopStreamTracks(displayStreamRef.current);
      stopStreamTracks(recordingStreamRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const clearActiveMedia = (): void => {
    stopStreamTracks(displayStreamRef.current);
    stopStreamTracks(recordingStreamRef.current);

    displayStreamRef.current = null;
    recordingStreamRef.current = null;
    mediaRecorderRef.current = null;
  };

  const resetPreview = (): void => {
    setPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return null;
    });

    setRecordingFilename(null);
    setRecordingFileSize(null);
  };

  const startWebRecording =
    async (): Promise<void> => {
      if (
        !navigator.mediaDevices?.getDisplayMedia
      ) {
        setRecorderStatus("error");

        setRecorderError(
          "This browser does not support screen recording.",
        );

        return;
      }

      if (typeof MediaRecorder === "undefined") {
        setRecorderStatus("error");

        setRecorderError(
          "This browser does not support MediaRecorder.",
        );

        return;
      }

      resetPreview();
      clearActiveMedia();

      setRecorderError(null);
      setRecorderStatus("selecting");
      setElapsedSeconds(0);
      setHasCapturedAudio(false);

      try {
        const displayMediaOptions: RecordockDisplayMediaOptions =
          {
            video: true,
            audio: captureScreenAudio,
            systemAudio: captureScreenAudio
              ? "include"
              : "exclude",
            windowAudio: captureScreenAudio
              ? "system"
              : "exclude",
          };

        const displayStream =
          await navigator.mediaDevices.getDisplayMedia(
            displayMediaOptions,
          );

        displayStreamRef.current = displayStream;

        const videoTracks =
          displayStream.getVideoTracks();

        const audioTracks = captureScreenAudio
          ? displayStream.getAudioTracks()
          : [];

        const recordingStream = new MediaStream([
          ...videoTracks,
          ...audioTracks,
        ]);

        recordingStreamRef.current =
          recordingStream;

        const actualHasAudio =
          recordingStream.getAudioTracks().length > 0;

        setHasCapturedAudio(actualHasAudio);

        const mimeType =
          chooseSupportedMimeType();

        const mediaRecorder = mimeType
          ? new MediaRecorder(recordingStream, {
              mimeType,
            })
          : new MediaRecorder(recordingStream);

        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (
          event: BlobEvent,
        ): void => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(
              event.data,
            );
          }
        };

        mediaRecorder.onerror = (): void => {
          setRecorderStatus("error");

          setRecorderError(
            "The browser encountered a recording error.",
          );

          clearActiveMedia();
        };

        mediaRecorder.onstop = (): void => {
          setRecorderStatus("processing");

          const recordingBlob = new Blob(
            recordedChunksRef.current,
            {
              type:
                mediaRecorder.mimeType ||
                "video/webm",
            },
          );

          recordedChunksRef.current = [];

          if (recordingBlob.size === 0) {
            setRecorderStatus("error");

            setRecorderError(
              "The recording was empty and could not be prepared.",
            );

            clearActiveMedia();

            return;
          }

          const nextPreviewUrl =
            URL.createObjectURL(recordingBlob);

          setPreviewUrl((currentPreviewUrl) => {
            if (currentPreviewUrl) {
              URL.revokeObjectURL(
                currentPreviewUrl,
              );
            }

            return nextPreviewUrl;
          });

          setRecordingFilename(
            createRecordingFilename(),
          );

          setRecordingFileSize(recordingBlob.size);
          setStartedAt(null);
          setRecorderStatus("ready");

          clearActiveMedia();
        };

        const videoTrack =
          displayStream.getVideoTracks()[0];

        videoTrack?.addEventListener(
          "ended",
          () => {
            if (
              mediaRecorder.state !== "inactive"
            ) {
              mediaRecorder.stop();
            }
          },
          {
            once: true,
          },
        );

        const recordingStartTime = Date.now();

        setStartedAt(recordingStartTime);
        setRecorderStatus("recording");

        mediaRecorder.start(1000);
      } catch (error) {
        clearActiveMedia();

        const errorName =
          error instanceof DOMException
            ? error.name
            : "";

        if (
          errorName === "NotAllowedError" ||
          errorName === "AbortError"
        ) {
          setRecorderStatus("idle");
          setRecorderError(null);

          return;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Recordock could not start the recording.";

        setRecorderStatus("error");
        setRecorderError(errorMessage);
      }
    };

  const stopWebRecording = (): void => {
    const mediaRecorder =
      mediaRecorderRef.current;

    if (
      !mediaRecorder ||
      mediaRecorder.state === "inactive"
    ) {
      return;
    }

    setRecorderStatus("processing");
    mediaRecorder.stop();
  };

  const downloadRecording = (): void => {
    if (!previewUrl || !recordingFilename) {
      return;
    }

    const downloadLink =
      document.createElement("a");

    downloadLink.href = previewUrl;
    downloadLink.download = recordingFilename;
    downloadLink.style.display = "none";

    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const recordAgain = (): void => {
    resetPreview();
    setRecorderError(null);
    setRecorderStatus("idle");
    setElapsedSeconds(0);
    setHasCapturedAudio(false);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label="Recordock home"
        >
          <img
            className="brand-logo"
            src="/brand/recordock-mark.svg"
            alt=""
            aria-hidden="true"
          />

          <span>Recordock</span>
        </a>

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          <a href="#recorder">Record</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">
            How it works
          </a>
            <a href="#privacy">Privacy</a>
            <a href="/privacy.html">Privacy policy</a>
            <a href="#faq">FAQ</a>
        </nav>

        <a
          className="header-github-link"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="top">
        <section
          id="recorder"
          className="hero section-shell"
        >
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Local browser screen recorder
            </div>

            <h1>
              Record your screen.
              <span>Keep it local.</span>
            </h1>

            <p className="hero-description">
              Capture a browser tab, application window,
              or monitor directly from your browser.
              Include available screen audio when needed,
              preview the result, and download it locally.
            </p>

              <div className="hero-actions">
                <button
                  className="primary-button hero-primary-button"
                  type="button"
                  disabled
                  aria-describedby="browser-release-status"
                >
                  Add to browser
                  <span aria-hidden="true">↗</span>
                </button>

                <a
                  className="secondary-button"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <p
                id="browser-release-status"
                className="hero-release-status"
              >
                Chrome Web Store release coming soon.
              </p>

            <div
              className="hero-trust-list"
              aria-label="Recordock benefits"
            >
              <span>No account</span>
              <span>No cloud upload</span>
              <span>No analytics</span>
            </div>
          </div>

          <div
            id="web-recorder"
            className="hero-recorder"
          >
            <div className="web-recorder-card">
              <div className="web-recorder-header">
                <div className="web-recorder-brand">
                  <img
                    src="/brand/recordock-mark.svg"
                    alt=""
                    aria-hidden="true"
                  />

                  <div>
                    <strong>Recordock</strong>
                    <span>Local web recorder</span>
                  </div>
                </div>

                <span className="local-pill">
                  Local only
                </span>
              </div>

              <div className="web-recorder-content">
                {recorderStatus === "idle" ||
                recorderStatus === "error" ? (
                  <>
                    <div className="recorder-heading">
                      <span className="recorder-kicker">
                        Recording options
                      </span>

                      <h2>Choose what to include.</h2>

                      <p>
                        Your browser will ask you to choose
                        the screen source after you start.
                      </p>
                    </div>

                    {recorderError && (
                      <p
                        className="recorder-error"
                        role="alert"
                      >
                        {recorderError}
                      </p>
                    )}

                      <div className="recording-options">
                        <label
                          className={`recording-option ${
                            captureScreenAudio
                              ? "recording-option--selected"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={captureScreenAudio}
                            onChange={(event) => {
                              setCaptureScreenAudio(
                                event.target.checked,
                              );
                            }}
                          />

                          <span className="option-copy">
                            <strong>Screen audio</strong>

                            <small>
                              Request available tab or system sound from the
                              selected source.
                            </small>
                          </span>
                        </label>
                      </div>

                    <button
                      className="recorder-primary-button"
                      type="button"
                      onClick={() => {
                        void startWebRecording();
                      }}
                    >
                      <span
                        className="record-button-dot"
                        aria-hidden="true"
                      />

                      Start Recording
                    </button>

                    <p className="recorder-privacy-message">
                      Your recording stays inside this
                      browser until you download it.
                    </p>
                  </>
                ) : null}

                {recorderStatus === "selecting" && (
                  <div
                    className="recorder-state"
                    aria-live="polite"
                  >
                    <div className="state-loader">
                      <span />
                      <span />
                      <span />
                    </div>

                    <span className="recorder-kicker">
                      Waiting for selection
                    </span>

                    <h2>Choose what to record.</h2>

                    <p>
                      Select a tab, window, or monitor in
                      your browser's sharing dialog.
                    </p>
                  </div>
                )}

                {recorderStatus === "recording" && (
                  <div
                    className="recorder-state"
                    aria-live="polite"
                  >
                    <div className="recording-status-label">
                      <span className="live-dot" />
                      Recording
                    </div>

                    <div className="web-recording-timer">
                      {formatDuration(elapsedSeconds)}
                    </div>

                    <p className="captured-audio-status">
                      {hasCapturedAudio
                        ? "Screen audio included"
                        : "Video only"}
                    </p>

                    <button
                      className="recorder-stop-button"
                      type="button"
                      onClick={stopWebRecording}
                    >
                      <span aria-hidden="true" />
                      Stop Recording
                    </button>
                  </div>
                )}

                {recorderStatus === "processing" && (
                  <div
                    className="recorder-state"
                    aria-live="polite"
                  >
                    <div
                      className="processing-spinner"
                      aria-hidden="true"
                    />

                    <span className="recorder-kicker">
                      Processing locally
                    </span>

                    <h2>Preparing your recording.</h2>

                    <p>
                      Recordock is creating the local WebM
                      preview.
                    </p>
                  </div>
                )}

                {recorderStatus === "ready" &&
                  previewUrl && (
                    <div className="web-preview">
                      <div className="preview-heading">
                        <div className="preview-success">
                          ✓
                        </div>

                        <div>
                          <span className="recorder-kicker">
                            Recording ready
                          </span>

                          <h2>Preview and download.</h2>
                        </div>
                      </div>

                      <video
                        className="web-preview-video"
                        src={previewUrl}
                        controls
                        playsInline
                        preload="metadata"
                      >
                        Your browser does not support video
                        playback.
                      </video>

                      <div className="preview-metadata">
                        <div>
                          <span>File</span>

                          <strong>
                            {recordingFilename}
                          </strong>
                        </div>

                        <div>
                          <span>Size</span>

                          <strong>
                            {recordingFileSize !== null
                              ? formatFileSize(
                                  recordingFileSize,
                                )
                              : "—"}
                          </strong>
                        </div>
                      </div>

                      <div className="preview-buttons">
                        <button
                          className="recorder-primary-button"
                          type="button"
                          onClick={downloadRecording}
                        >
                          <span aria-hidden="true">
                            ↓
                          </span>

                          Download WebM
                        </button>

                        <button
                          className="recorder-secondary-button"
                          type="button"
                          onClick={recordAgain}
                        >
                          Record Again
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>

        <section
          className="trust-section"
          aria-labelledby="trust-heading"
        >
          <div className="section-shell">
            <div className="trust-heading">
              <span className="section-label">
                Built around privacy
              </span>

              <h2 id="trust-heading">
                Simple recording without unnecessary
                infrastructure.
              </h2>
            </div>

              <div className="trust-grid">
                <article className="trust-card">
                  <span
                    className="trust-card__icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="13"
                        rx="2"
                      />

                      <path d="M8 21H16" />
                      <path d="M12 17V21" />

                      <circle
                        cx="12"
                        cy="10.5"
                        r="2.5"
                      />
                    </svg>
                  </span>

                  <span className="trust-card__number">
                    01
                  </span>

                  <h3>Processed locally</h3>

                  <p>
                    Recording and preview generation happen inside your
                    browser.
                  </p>
                </article>

                <article className="trust-card">
                  <span
                    className="trust-card__icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 18H17C19.2 18 21 16.2 21 14C21 11.9 19.4 10.2 17.4 10C16.8 7.1 14.7 5 12 5C9.6 5 7.5 6.6 6.7 8.9C4.6 9.1 3 10.8 3 13C3 15.8 4.8 18 7 18Z"
                      />

                      <path d="M9 12L15 18" />
                      <path d="M15 12L9 18" />
                    </svg>
                  </span>

                  <span className="trust-card__number">
                    02
                  </span>

                  <h3>No cloud storage</h3>

                  <p>
                    Recordock does not automatically upload your
                    recording to a server.
                  </p>
                </article>

                <article className="trust-card">
                  <span
                    className="trust-card__icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="4"
                      />

                      <path
                        d="M4.5 21C5.2 16.9 8 15 12 15C16 15 18.8 16.9 19.5 21"
                      />

                      <path d="M16.5 4.5L19.5 7.5" />
                      <path d="M19.5 4.5L16.5 7.5" />
                    </svg>
                  </span>

                  <span className="trust-card__number">
                    03
                  </span>

                  <h3>No account required</h3>

                  <p>
                    Use the free local recorder without creating an
                    account.
                  </p>
                </article>

                <article className="trust-card">
                  <span
                    className="trust-card__icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 8L4 12L8 16" />
                      <path d="M16 8L20 12L16 16" />
                      <path d="M14 4L10 20" />
                    </svg>
                  </span>

                  <span className="trust-card__number">
                    04
                  </span>

                    <h3>Free version code</h3>

                    <p>
                      Review the public free-version implementation and
                      technical architecture on GitHub.
                    </p>
                </article>
              </div>
          </div>
        </section>

        <section
          id="features"
          className="content-section section-shell"
        >
          <div className="section-heading">
            <span className="section-label">
              Features
            </span>

            <h2>
              Everything required for a focused screen
              recording.
            </h2>

            <p>
              Recordock concentrates on the essential
              workflow: select, record, preview, and save.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article
                className="feature-card"
                key={feature.number}
              >
                <span className="feature-number">
                  {feature.number}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="content-section process-section"
        >
          <div className="section-shell">
            <div className="section-heading centered-heading">
              <span className="section-label">
                How it works
              </span>

              <h2>
                From browser to local file in four steps.
              </h2>

              <p>
                Your browser controls source selection.
                Recordock handles the recording, preview,
                and download.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step, index) => (
                <article
                  className="step-card"
                  key={step.number}
                >
                  <div className="step-top">
                    <span className="step-number">
                      {step.number}
                    </span>

                    {index < steps.length - 1 && (
                      <span
                        className="step-connector"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="privacy"
          className="privacy-section section-shell"
        >
          <div className="privacy-panel">
            <div className="privacy-copy">
              <span className="section-label light-label">
                Privacy by design
              </span>

              <h2>
                Your screen recording should remain your
                screen recording.
              </h2>

              <p>
                Recordock performs the recording workflow
                locally inside the browser. There is no
                Recordock server receiving your video, no
                account connected to it, and no automatic
                cloud upload.
              </p>

                <a
                  className="privacy-link"
                  href="/privacy.html"
                >
                  Read the privacy policy
                  <span aria-hidden="true">→</span>
                </a>
            </div>

            <div className="privacy-checklist">
              <div className="privacy-check">
                <span>✓</span>
                Recording processed locally
              </div>

              <div className="privacy-check">
                <span>✓</span>
                No user account required
              </div>

              <div className="privacy-check">
                <span>✓</span>
                No recording analytics
              </div>

              <div className="privacy-check">
                <span>✓</span>
                No automatic upload
              </div>

              <div className="privacy-check">
                <span>✓</span>
                User-controlled download
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="content-section section-shell"
        >
          <div className="section-heading centered-heading faq-heading">
            <span className="section-label">
              FAQ
            </span>

            <h2>
              Common questions about Recordock.
            </h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details
                className="faq-item"
                key={faq.question}
              >
                <summary>
                  <span>{faq.question}</span>

                  <span
                    className="faq-toggle"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>

                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta-section section-shell">
          <div className="cta-card">
            <span className="section-label light-label">
              Recordock
            </span>

            <h2>
              A focused screen recorder without the cloud
              dependency.
            </h2>

            <p>
              Record locally, review the result, and save
              the file directly to your computer.
            </p>

            <div className="cta-actions">
              <a
                className="cta-primary"
                href="#web-recorder"
              >
                Start a local recording
              </a>

              <a
                className="cta-secondary"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                Follow development on GitHub
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <a
              className="brand footer-brand"
              href="#top"
              aria-label="Recordock home"
            >
              <img
                className="brand-logo"
                src="/brand/recordock-mark.svg"
                alt=""
                aria-hidden="true"
              />

              <span>Recordock</span>
            </a>

            <p>
              Record your screen. Keep it local.
            </p>
          </div>

          <div className="footer-links">
            <a href="#recorder">Record</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">
              How it works
            </a>
            <a href="#privacy">Privacy</a>
            <a href="#faq">FAQ</a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Recordock</span>

          <span>
            Built by{" "}
            <a
              href="https://github.com/jayasuryapazhani"
              target="_blank"
              rel="noreferrer"
            >
              Jayasurya Pazhani
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;