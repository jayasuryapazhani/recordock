import {
  useEffect,
  useState,
} from "react";
import {
  getLatestRecording,
  type StoredRecording,
} from "../storage/recordingBlobStore";
import { formatFileSize } from "../utils/formatFileSize";

function PreviewPage() {
  const [recording, setRecording] =
    useState<StoredRecording | null>(null);

  const [previewUrl, setPreviewUrl] = useState<
    string | null
  >(null);

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void getLatestRecording()
      .then((storedRecording) => {
        if (cancelled) {
          return;
        }

        if (!storedRecording) {
          throw new Error(
            "The completed recording could not be found.",
          );
        }

        objectUrl = URL.createObjectURL(
          storedRecording.blob,
        );

        setRecording(storedRecording);
        setPreviewUrl(objectUrl);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Recordock could not load the recording.";

        setErrorMessage(message);
      });

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const handleDownload = (): void => {
    if (!previewUrl || !recording) {
      setErrorMessage(
        "The recording is not available for download.",
      );

      return;
    }

    const downloadLink =
      document.createElement("a");

    downloadLink.href = previewUrl;
    downloadLink.download = recording.filename;
    downloadLink.style.display = "none";

    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const handleClose = (): void => {
    window.close();
  };

  return (
    <main className="full-preview">
      <header className="full-preview__header">
        <div className="full-preview__brand">
          <img
            className="full-preview__logo"
            src="/icons/icon128.png"
            alt=""
            aria-hidden="true"
          />

          <div className="full-preview__brand-copy">
            <div className="full-preview__brand-line">
              <strong>Recordock</strong>

              <span className="full-preview__local-pill">
                Local only
              </span>
            </div>

            <p>
              Record your screen. Keep it local.
            </p>
          </div>
        </div>

        <div className="full-preview__actions">
          <button
            className="preview-button preview-button--secondary"
            type="button"
            onClick={handleClose}
          >
            Close
          </button>

          <button
            className="preview-button preview-button--primary"
            type="button"
            onClick={handleDownload}
            disabled={!previewUrl}
          >
            <span aria-hidden="true">↓</span>
            Download WebM
          </button>
        </div>
      </header>

      <section className="full-preview__content">
        <div className="full-preview__heading">
          <div>
            <span className="full-preview__eyebrow">
              Recording preview
            </span>

            <h1>Review your recording.</h1>

            <p>
              Play the recording, confirm the result, and
              download the WebM file when ready.
            </p>
          </div>

          {recording && (
            <div className="full-preview__status">
              <span aria-hidden="true">✓</span>

              <div>
                <strong>Recording ready</strong>
                <small>Processed locally</small>
              </div>
            </div>
          )}
        </div>

        <div className="full-preview__workspace">
          <section
            className="full-preview__player-card"
            aria-label="Recording player"
          >
            <div className="full-preview__player">
              {errorMessage && (
                <div
                  className="full-preview__error"
                  role="alert"
                >
                  <span
                    className="full-preview__error-icon"
                    aria-hidden="true"
                  >
                    !
                  </span>

                  <div>
                    <strong>
                      Preview unavailable
                    </strong>

                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {!errorMessage && !previewUrl && (
                <div
                  className="full-preview__loading"
                  aria-live="polite"
                >
                  <div
                    className="full-preview__spinner"
                    aria-hidden="true"
                  />

                  <strong>
                    Loading recording
                  </strong>

                  <p>
                    Recordock is preparing the local
                    preview.
                  </p>
                </div>
              )}

              {previewUrl && (
                            <video
                            className="full-preview__video"
                            src={previewUrl}
                            controls
                            controlsList="nodownload noremoteplayback"
                            autoPlay
                            playsInline
                            preload="metadata"
                            >
                  Your browser does not support video
                  playback.
                </video>
              )}
            </div>
          </section>

          <aside className="full-preview__sidebar">
            <section className="preview-information-card">
              <span className="preview-card-label">
                Recording details
              </span>

              <h2>Local file information</h2>

              <div className="preview-metadata-list">
                <div className="preview-metadata-row">
                  <span>File</span>

                  <strong
                    title={recording?.filename ?? ""}
                  >
                    {recording?.filename ??
                      "Preparing file…"}
                  </strong>
                </div>

                <div className="preview-metadata-row">
                  <span>Size</span>

                  <strong>
                    {recording
                      ? formatFileSize(
                          recording.fileSizeBytes,
                        )
                      : "—"}
                  </strong>
                </div>

                <div className="preview-metadata-row">
                  <span>Format</span>

                  <strong>WebM</strong>
                </div>

                <div className="preview-metadata-row">
                  <span>Storage</span>

                  <strong>Local device</strong>
                </div>
              </div>
            </section>

            <section className="preview-privacy-card">
              <div
                className="preview-privacy-card__icon"
                aria-hidden="true"
              >
                ✓
              </div>

              <div>
                <span className="preview-card-label">
                  Privacy by design
                </span>

                <h2>Your recording stays local.</h2>

                <p>
                  Recordock does not automatically upload
                  this recording to a server. The file
                  remains on your device until you
                  download or replace it.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <footer className="full-preview__footer">
        <span>
          Recordock expanded preview
        </span>

        <span>
          Press <kbd>F11</kbd> or <kbd>Esc</kbd> to exit
          fullscreen.
        </span>
      </footer>
    </main>
  );
}

export default PreviewPage;