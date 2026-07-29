
import "./App.css";
const GITHUB_URL =
  "https://github.com/jayasuryapazhani/recordock";

const features = [
  {
    number: "01",
    title: "Record any screen",
    description:
      "Capture a browser tab, application window, or complete monitor through Chrome's secure source picker.",
  },
  {
    number: "02",
    title: "Optional source audio",
    description:
      "Capture available tab or system audio, or create a completely silent video recording.",
  },
  {
    number: "03",
    title: "Record in the background",
    description:
      "Closing the extension popup does not interrupt the active recording.",
  },
  {
    number: "04",
    title: "Preview before saving",
    description:
      "Review the completed recording inside Recordock before downloading the WebM file.",
  },
  {
    number: "05",
    title: "Local by design",
    description:
      "Recordings are processed and stored temporarily inside your browser, not on an external server.",
  },
  {
    number: "06",
    title: "No account required",
    description:
      "Open Recordock, select a source, record, preview, and download. No registration or sign-in.",
  },
];

const steps = [
  {
    number: "1",
    title: "Open Recordock",
    description:
      "Choose whether Recordock should request available source audio.",
  },
  {
    number: "2",
    title: "Select your source",
    description:
      "Choose a Chrome tab, application window, or monitor from Chrome's picker.",
  },
  {
    number: "3",
    title: "Record",
    description:
      "Keep working while Recordock continues recording after the popup closes.",
  },
  {
    number: "4",
    title: "Preview and download",
    description:
      "Stop the recording, review the result, and download the WebM file locally.",
  },
];

const faqs = [
  {
    question: "Does Recordock upload my recordings?",
    answer:
      "No. Recordings are processed locally inside the browser and are not uploaded by Recordock.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Recordock does not require registration, authentication, or a cloud account.",
  },
  {
    question: "What can I record?",
    answer:
      "Chrome allows you to select a browser tab, application window, or complete monitor.",
  },
  {
    question: "Can Recordock capture audio?",
    answer:
      "Recordock can request available tab or system audio. Actual availability depends on the selected source, Chrome's picker, the operating system, and whether the audio-sharing option is enabled.",
  },
  {
    question: "What file format does Recordock create?",
    answer:
      "The initial version creates WebM recordings that can be previewed and downloaded locally.",
  },
  {
    question: "Does recording stop when the popup closes?",
    answer:
      "No. Recordock uses a hidden extension recording context so the active recording can continue after the popup closes.",
  },
];

function App() {
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

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy</a>
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
        <section className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Privacy-focused Chrome screen recorder
            </div>

            <h1>
              Record your screen.
              <span>Keep it local.</span>
            </h1>

            <p className="hero-description">
              Capture a browser tab, application window, or monitor
              directly from Chrome. Preview the recording and download it
              locally without accounts, cloud storage, or automatic uploads.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                type="button"
                disabled
                aria-describedby="store-status"
              >
                Chrome Web Store
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

            <p id="store-status" className="store-status">
              Chrome Web Store release coming soon.
            </p>

            <div className="hero-trust-list" aria-label="Recordock benefits">
              <span>No account</span>
              <span>No cloud upload</span>
              <span>No analytics</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Recordock preview">
            <div className="browser-frame">
              <div className="browser-toolbar">
                <div className="browser-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="browser-address">
                  chrome-extension://recordock
                </div>
              </div>

              <div className="recorder-card">
                <div className="recorder-header">
                  <div className="recorder-brand">
                    <span className="mini-record-mark">
                      <span />
                    </span>
                    Recordock
                  </div>

                  <span className="local-pill">Local only</span>
                </div>

                <div className="recording-display">
                  <div className="recording-status">
                    <span className="recording-pulse" />
                    Recording
                  </div>

                  <div className="recording-time">00:02:18</div>

                  <div className="audio-status">
                    <span aria-hidden="true">◉</span>
                    Audio captured
                  </div>
                </div>

                <button className="stop-preview-button" type="button">
                  <span className="stop-icon" />
                  Stop recording
                </button>

                <div className="privacy-note">
                  <span className="shield-icon" aria-hidden="true">
                    ✓
                  </span>

                  <div>
                    <strong>Your recording stays on this device</strong>
                    <p>No automatic upload or cloud processing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-badge floating-badge-top">
              <span className="floating-icon">✓</span>
              No sign-in
            </div>

            <div className="floating-badge floating-badge-bottom">
              <span className="floating-icon">↓</span>
              Local download
            </div>
          </div>
        </section>

        <section className="trust-bar" aria-label="Privacy principles">
          <div className="trust-item">
            <span className="trust-icon">⌁</span>
            <div>
              <strong>Local processing</strong>
              <span>Inside your browser</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">□</span>
            <div>
              <strong>No cloud storage</strong>
              <span>Your files stay with you</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">○</span>
            <div>
              <strong>No account</strong>
              <span>Start recording immediately</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">◇</span>
            <div>
              <strong>Open source</strong>
              <span>Inspect the implementation</span>
            </div>
          </div>
        </section>

        <section id="features" className="content-section section-shell">
          <div className="section-heading">
            <span className="section-label">Features</span>

            <h2>Everything required for a clean screen recording.</h2>

            <p>
              Recordock focuses on the essential workflow: select, record,
              preview, and save.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
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
              <span className="section-label">How it works</span>
              <h2>From browser to local file in four steps.</h2>
              <p>
                Chrome controls source selection. Recordock handles the
                recording, preview, and local download.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step, index) => (
                <article className="step-card" key={step.number}>
                  <div className="step-top">
                    <span className="step-number">{step.number}</span>

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

        <section id="privacy" className="privacy-section section-shell">
          <div className="privacy-panel">
            <div className="privacy-copy">
              <span className="section-label light-label">
                Privacy by design
              </span>

              <h2>Your screen recording should remain your screen recording.</h2>

              <p>
                Recordock performs the recording workflow locally inside
                Chrome. There is no Recordock server receiving your video,
                no account connected to it, and no automatic cloud upload.
              </p>

              <a
                className="privacy-link"
                href={`${GITHUB_URL}/blob/main/docs/privacy-policy.md`}
                target="_blank"
                rel="noreferrer"
              >
                Read the privacy policy
                <span aria-hidden="true">↗</span>
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

        <section id="faq" className="content-section section-shell">
          <div className="section-heading centered-heading faq-heading">
            <span className="section-label">FAQ</span>
            <h2>Common questions about Recordock.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="faq-toggle" aria-hidden="true">
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
              Recordock 0.1.0
            </span>

            <h2>A focused screen recorder without the cloud dependency.</h2>

            <p>
              Record locally, review the result, and save the file directly
              to your computer.
            </p>

            <div className="cta-actions">
              <button className="cta-primary" type="button" disabled>
                Chrome Web Store — Coming soon
              </button>

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

            <p>Record your screen. Keep it local.</p>
          </div>

          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
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