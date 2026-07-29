# Recordock Architecture

## Overview

Recordock is a privacy-focused Chrome screen recorder built with Manifest V3, React, TypeScript, Vite, Chrome extension APIs, and browser media APIs.

Recordock records one user-selected browser tab, application window, or monitor. The resulting WebM file is processed locally and stored temporarily in the browser for preview and download.

No backend, cloud storage, account, or external upload is used.

## Runtime Architecture

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
        | recorded Blob
        v
IndexedDB
        |
        | preview and download
        v
Popup or expanded preview window
```

## Extension Contexts

### Popup

The popup is the main user interface.

Responsibilities:

- Display the current recording state
- Start a recording
- Stop an active recording
- Display the recording timer
- Display audio status
- Load the completed recording from IndexedDB
- Show an inline preview
- Download the WebM file
- Open the expanded preview window
- Start another recording
- Display user-facing errors

The popup does not own the active `MediaRecorder` because Chrome closes extension popups when they lose focus.

### Background Service Worker

The Manifest V3 service worker coordinates the recording workflow.

Responsibilities:

- Read and update recording state
- Create the offscreen document
- Send start and stop commands
- Receive recording lifecycle events
- Update the toolbar `REC` badge
- Reconcile stored state with the actual recorder
- Recover from interrupted or stale sessions
- Coordinate communication between extension contexts

The service worker does not process video data.

Manifest V3 service workers may be suspended when idle. Therefore, active recording metadata is stored in `chrome.storage.session` instead of relying only on global variables.

### Offscreen Document

The hidden offscreen document owns the recording engine.

Responsibilities:

- Request Chrome's display-media picker
- Receive the selected `MediaStream`
- Inspect available video and audio tracks
- Create and control `MediaRecorder`
- Collect WebM chunks
- Detect Chrome's native Stop Sharing action
- Generate the completed WebM `Blob`
- Store the completed recording in IndexedDB
- Notify the service worker when recording starts, finishes, or fails

The offscreen document allows recording to continue after the popup closes.

### Expanded Preview Window

The expanded preview is a dedicated extension page.

Responsibilities:

- Retrieve the latest recording from IndexedDB
- Display the recording in a larger window
- Download the recording
- Close the preview window

It does not perform recording or modify recording state.

## Recording State

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

No recording is active. The user can choose audio preferences and start recording.

### `selecting`

Chrome's display-media picker is active.

### `recording`

A `MediaRecorder` is actively recording the selected source.

### `stopping`

The recorder is stopping and Recordock is creating and saving the WebM `Blob`.

### `ready`

The completed recording is available for preview and download.

### `error`

A selection, recording, storage, or communication operation failed.

## State Storage

Temporary recording metadata is stored in:

```text
chrome.storage.session
```

Stored metadata includes:

- Recording status
- Recording start timestamp
- Generated filename
- File size
- Audio-track availability
- User-facing error message

The WebM `Blob` is not stored in Chrome Storage because recordings may exceed its storage limits.

## Recording Blob Storage

The completed WebM `Blob` is stored in IndexedDB.

Database:

```text
recordock
```

Object store:

```text
recordings
```

Current record key:

```text
latest
```

The initial release stores only the latest completed recording. Starting another recording replaces or removes the previous recording.

## Timer Design

The timer is calculated from:

```text
Date.now() - startedAt
```

Recordock does not persist an incrementing counter every second.

This approach allows the timer to be restored accurately when the popup is closed and reopened.

## Audio Capture

The user may select:

- Capture available audio
- No audio

When audio is requested, Recordock passes audio-related preferences to `getDisplayMedia()`.

Audio availability still depends on:

- The selected source
- Chrome's source picker
- The selected audio-sharing checkbox
- The operating system
- Browser support

Recordock checks the returned stream:

```typescript
stream.getAudioTracks().length > 0
```

The UI displays either:

```text
Audio captured
```

or:

```text
Video only
```

## Media Format

The initial release produces WebM recordings.

Recordock checks MIME support in this order:

```text
video/webm;codecs=vp9,opus
video/webm;codecs=vp8,opus
video/webm;codecs=vp9
video/webm;codecs=vp8
video/webm
```

Audio codecs are prioritized only when an audio track is available.

## Native Stop Sharing

Recordock listens for the captured video track's `ended` event.

When Chrome's native Stop Sharing control is used:

1. The video track ends.
2. Recordock stops `MediaRecorder`.
3. Recorded chunks are converted into a WebM `Blob`.
4. The `Blob` is saved in IndexedDB.
5. The recording state changes to `ready`.
6. The toolbar `REC` badge is cleared.

## Privacy Boundary

Recordings remain inside the browser and the user's device.

Recordock does not:

- Upload recordings
- Send recording content over a network
- Analyze recording content
- Use cloud storage
- Require an account
- Track which source was recorded
- Sell or share recording data

## Build Entries

Vite builds four extension entry points:

```text
index.html      -> popup
background.js   -> service worker
offscreen.html  -> hidden recorder
preview.html    -> expanded preview
```

The service worker output must remain:

```text
background.js
```

because the manifest references that exact path.

## Current Limitations

Version `0.1.0` does not include:

- Microphone recording
- Pause and resume
- MP4 conversion
- GIF conversion
- Webcam overlay
- Editing or trimming
- Multiple-display recording
- Recording history
- Cloud uploads
- Shareable links
- User accounts