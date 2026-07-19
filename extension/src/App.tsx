import "./App.css";

const supportedSources = [
  "Browser tab",
  "Application window",
  "Complete monitor",
];

function App() {
  return (
    <main className="popup">
      <header className="popup__header">
        <div className="brand-mark" aria-hidden="true">
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
        <div className="status-chip">
          <span className="status-chip__dot" />
          Ready
        </div>

        <h2 id="recorder-heading">
          Start a screen recording
        </h2>

        <p className="recorder-card__description">
          Record one selected browser tab, application window,
          or complete monitor.
        </p>

        <ul className="source-list">
          {supportedSources.map((source) => (
            <li key={source}>
              <span aria-hidden="true">✓</span>
              {source}
            </li>
          ))}
        </ul>

        <button
          className="primary-button"
          type="button"
          disabled
          title="Recording will be enabled in the recording-engine milestone."
        >
          Start Recording
        </button>

        <p className="development-note">
          Recording engine not connected yet.
        </p>
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
            Recordings are processed locally and remain on your
            device.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;