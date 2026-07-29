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
        <div>
          <p className="full-preview__eyebrow">
            Recordock
          </p>

          <h1>Recording preview</h1>

          {recording && (
            <p className="full-preview__metadata">
              {recording.filename}
              <span aria-hidden="true"> · </span>
              {formatFileSize(
                recording.fileSizeBytes,
              )}
            </p>
          )}
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
            Download
          </button>
        </div>
      </header>

      <section className="full-preview__player">
        {errorMessage && (
          <p
            className="full-preview__error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {!errorMessage && !previewUrl && (
          <div className="full-preview__loading">
            <div
              className="full-preview__spinner"
              aria-hidden="true"
            />

            <p>Loading recording…</p>
          </div>
        )}

        {previewUrl && (
          <video
            className="full-preview__video"
            src={previewUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        )}
      </section>

      <footer className="full-preview__footer">
        Press <kbd>F11</kbd> or <kbd>Esc</kbd> to exit
        fullscreen.
      </footer>
    </main>
  );
}

export default PreviewPage;