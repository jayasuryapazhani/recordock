# Recordock

**Record your screen. Keep it local.**

Recordock is a privacy-focused Chrome screen recorder that records one selected browser tab, application window, or monitor and saves the completed recording locally as a WebM file.

Recordings are processed entirely inside the browser. Recordock does not upload recordings, require an account, or use cloud storage.

## Project Status

Recordock `0.1.0` is currently under development.

The core recording workflow is functional:

- Select a browser tab, application window, or monitor
- Capture available tab or system audio
- Record without audio
- Continue recording after the extension popup closes
- Restore the active recording timer
- Stop from the popup
- Stop through Chrome's native Stop Sharing control
- Preview the completed recording
- Open an expanded preview window
- Download the recording locally
- Start another recording

## Features

### Screen Recording

Record one selected source at a time:

- Browser tab
- Application window
- Complete monitor

### Recording Controls

- Start recording
- Stop recording
- Recording timer
- Active `REC` toolbar badge
- Processing state
- Recording-state restoration
- Duplicate Start prevention
- Duplicate Stop prevention
- Picker cancellation handling
- Interrupted-session recovery

### Audio

Recordock supports:

- Available browser-tab audio
- Available system audio
- Video-only recording
- Automatic audio-track detection

Audio availability depends on:

- The selected recording source
- Chrome's source picker
- The selected audio-sharing option
- The operating system
- Browser support

Recordock displays:

```text
Audio captured
```

when Chrome provides an audio track, or:

```text
Video only
```

when no audio track is available.

### Recording Output

- WebM video
- Original captured resolution
- Automatically generated filename
- Local browser processing
- IndexedDB temporary storage
- Inline video preview
- Expanded preview window
- File-size display
- User-controlled download

Example filename:

```text
recordock-20260729-153045.webm
```

## Privacy

Recordock is local by design.

Recordock does not:

- Upload recordings
- Store recordings on an external server
- Require a user account
- Analyze recording content
- Track which screen or application was recorded
- Collect browsing history
- Use analytics
- Sell or share recording information
- Use cloud storage

The latest completed recording is temporarily stored in browser IndexedDB so it can be previewed and downloaded.

Read the complete privacy policy:

[Recordock Privacy Policy](docs/privacy-policy.md)

## Architecture

Recordock uses multiple Manifest V3 extension contexts:

```text
Chrome extension popup
        |
        | runtime messages
        v
Background service worker
        |
        | creates and coordinates
        v
Offscreen document
        |
        | getDisplayMedia
        v
Chrome source picker
        |
        | MediaStream
        v
MediaRecorder
        |
        | WebM Blob
        v
IndexedDB
        |
        | preview and download
        v
Popup or expanded preview window
```

### Popup

The React popup provides:

- Recording controls
- Timer
- Status display
- Audio preference
- Inline preview
- Download
- Record Again
- Error messages

### Background Service Worker

The service worker coordinates:

- Recording state
- Offscreen-document creation
- Start and stop commands
- Toolbar badge updates
- Runtime message handling
- Interrupted-session recovery

### Offscreen Document

The offscreen document owns:

- `getDisplayMedia()`
- `MediaStream`
- `MediaRecorder`
- Recording chunks
- Native Stop Sharing detection
- WebM Blob generation
- IndexedDB persistence

### IndexedDB

The initial release stores only the latest completed recording.

The recording Blob is not stored in `chrome.storage` because screen recordings can exceed Chrome Storage limits.

Read the complete architecture documentation:

[Recordock Architecture](docs/architecture.md)

## Technology Stack

### Extension

- React
- TypeScript
- Vite
- Manifest V3
- Chrome Extensions API
- Chrome Offscreen API
- Chrome Storage API
- MediaDevices API
- MediaRecorder API
- MediaStream API
- Blob API
- IndexedDB

### Testing

- Vitest
- React Testing Library
- Testing Library User Event
- fake-indexeddb
- jsdom
- TypeScript
- Oxlint

### Version Control

- Git
- GitHub

### Backend

No backend is required.

### Database

No external database is required.

IndexedDB is used locally inside the browser for the latest completed recording.

## Repository Structure

```text
recordock/
├── extension/
│   ├── public/
│   │   ├── icons/
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── background/
│   │   │   └── serviceWorker.ts
│   │   │
│   │   ├── offscreen/
│   │   │   └── offscreen.ts
│   │   │
│   │   ├── popup/
│   │   │   └── popupMessaging.ts
│   │   │
│   │   ├── preview/
│   │   │   ├── main.tsx
│   │   │   ├── PreviewPage.tsx
│   │   │   └── preview.css
│   │   │
│   │   ├── storage/
│   │   │   └── recordingBlobStore.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── App.test.tsx
│   │   │   ├── recordingBlobStore.test.ts
│   │   │   ├── setup.ts
│   │   │   └── utils.test.ts
│   │   │
│   │   ├── types/
│   │   │   ├── messages.ts
│   │   │   └── recording.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDuration.ts
│   │   │   ├── formatFileSize.ts
│   │   │   └── generateRecordingFilename.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── index.html
│   ├── offscreen.html
│   ├── preview.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── docs/
│   ├── architecture.md
│   ├── privacy-policy.md
│   ├── release-checklist.md
│   └── testing.md
│
├── screenshots/
├── README.md
├── LICENSE
└── .gitignore
```

## Local Development

### Requirements

Install:

- Google Chrome
- Node.js
- npm
- Git

Check installed versions:

```powershell
node --version
npm --version
git --version
```

## Clone the Repository

```powershell
git clone https://github.com/jayasuryapazhani/recordock.git

cd recordock
cd extension
```

## Install Dependencies

```powershell
npm install
```

## Run the Popup in Vite

```powershell
npm run dev
```

The Vite development page can be used to inspect the popup UI.

Chrome extension APIs are available only when the built extension is loaded into Chrome.

## Build the Extension

From `recordock/extension`:

```powershell
npm run build
```

The production extension is generated in:

```text
extension/dist
```

Expected output:

```text
dist/
├── assets/
├── icons/
├── background.js
├── index.html
├── manifest.json
├── offscreen.html
└── preview.html
```

## Load Recordock in Chrome

1. Build the extension:

```powershell
npm run build
```

2. Open Chrome.

3. Navigate to:

```text
chrome://extensions
```

4. Enable **Developer mode**.

5. Click **Load unpacked**.

6. Select:

```text
recordock/extension/dist
```

7. Pin Recordock to the Chrome toolbar.

After changing the source code:

```powershell
npm run build
```

Then click **Reload** on the Recordock extension card.

## How to Record

1. Open Recordock from the Chrome toolbar.
2. Select **Capture available audio** or **No audio**.
3. Click **Start Recording**.
4. Select a browser tab, application window, or monitor.
5. Enable **Share tab audio** or **Share system audio** when Chrome provides the option.
6. Reopen Recordock to view the timer.
7. Click **Stop Recording**, or use Chrome's native **Stop Sharing** control.
8. Wait for Recordock to prepare the WebM file.
9. Preview the completed recording.
10. Click **Expand** for the large preview.
11. Click **Download** to save the WebM file locally.

## Validation

### Lint

```powershell
npm run lint
```

### Automated Tests

```powershell
npm run test
```

Current automated coverage includes:

- Popup recording states
- Audio preference selection
- Timer restoration
- Preview controls
- Duration formatting
- File-size formatting
- Filename generation
- IndexedDB recording storage
- Recording replacement
- Recording deletion

### Production Build

```powershell
npm run build
```

### Complete Validation

```powershell
npm run validate
```

This runs:

```text
lint
tests
production build
```

Read the complete testing guide:

[Recordock Testing Guide](docs/testing.md)

## Current Automated Test Coverage

```text
Test Files  3 passed
Tests       20 passed
```

The current suite includes:

- 7 popup-state and interaction tests
- 9 utility tests
- 4 IndexedDB tests

## Recording States

```typescript
type RecordingStatus =
  | "idle"
  | "selecting"
  | "recording"
  | "stopping"
  | "ready"
  | "error";
```

### `idle`

Ready to start a recording.

### `selecting`

Chrome's source picker is active.

### `recording`

The selected source is currently being recorded.

### `stopping`

The recorder is stopping and generating the WebM file.

### `ready`

The completed recording is available for preview and download.

### `error`

A recording, storage, selection, or communication error occurred.

## Manifest Permissions

Recordock currently requests:

```json
{
  "permissions": [
    "offscreen",
    "storage"
  ]
}
```

### `offscreen`

Used to maintain the hidden recorder after the popup closes.

### `storage`

Used to store temporary recording-state metadata.

Recordock requests only the permissions required for its current functionality.

## Documentation

- [Architecture](docs/architecture.md)
- [Privacy Policy](docs/privacy-policy.md)
- [Testing Guide](docs/testing.md)
- [Release Checklist](docs/release-checklist.md)

## Initial Release Scope

Recordock `0.1.0` includes:

- Browser-tab recording
- Application-window recording
- Full-monitor recording
- Optional available source audio
- Video-only recording
- Recording timer
- Toolbar `REC` badge
- Popup Stop control
- Native Stop Sharing handling
- Local WebM generation
- Inline preview
- Expanded preview
- Local download
- Record Again
- Error handling
- Automated tests

## Excluded from Version 0.1.0

The initial release does not include:

- Pause and resume
- Microphone recording
- Multiple-monitor recording
- Rectangular region selection
- MP4 conversion
- GIF conversion
- Webcam overlay
- Video trimming
- Annotation tools
- Drawing tools
- Recording history
- Cloud uploads
- Shareable links
- User accounts
- Authentication
- Payments
- Subscriptions
- AI transcription
- AI summaries

## Roadmap

### Version 0.2.0

- Pause and resume
- Recording countdown
- Microphone toggle
- Microphone-device selection
- Improved audio feedback
- Improved error messages

### Version 0.3.0

- Custom filenames
- Remembered preferences
- Recording metadata
- Improved large-file handling
- Improved preview experience

### Later Versions

- MP4 conversion
- GIF export
- Webcam overlay
- Video trimming
- Recording presets
- Multiple-screen layouts
- Selected resolution export

## Release Validation

Before publishing, complete:

[Recordock Release Checklist](docs/release-checklist.md)

## Git Branch Strategy

Completed branches are preserved locally and on GitHub.

Current development branches include:

```text
main
project-foundation
recording-engine
recording-controls
audio-capture
testing-documentation
landing-page
chrome-store-assets
release-v0.1.0
```

Branch names do not use a `feature/` prefix.

## Planned Links

GitHub repository:

```text
https://github.com/jayasuryapazhani/recordock
```

Planned landing page:

```text
https://recordock.vercel.app
```

The Chrome Web Store link will be added after publication.

## Author

Built by [Jayasurya Pazhani](https://github.com/jayasuryapazhani).

## License

License information will be added before the public release.