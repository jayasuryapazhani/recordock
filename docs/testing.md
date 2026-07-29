# Recordock Testing Guide

## Validation Commands

Run all commands from:

```text
recordock/extension
```

### Lint

```powershell
npm run lint
```

Expected:

```text
Found 0 warnings and 0 errors.
```

### Automated Tests

```powershell
npm run test
```

Expected:

```text
Test Files  3 passed
Tests       20 passed
```

### Production Build

```powershell
npm run build
```

The build must create:

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

## Automated Test Coverage

### Popup States

Tests cover:

- Idle state
- Selecting state
- Recording state
- Restored recording timer
- Stopping state
- Ready state
- Error state
- Audio preference selection
- Preview controls
- Enabled and disabled controls

### Utility Functions

Tests cover:

- Zero duration
- Minute and second formatting
- Hour formatting
- Negative duration handling
- Decimal duration handling
- File-size formatting
- Negative file-size handling
- Generated recording filename

### IndexedDB Storage

Tests cover:

- Empty storage
- Saving recording metadata and Blob data
- Reading the latest recording
- Replacing the previous recording
- Deleting the latest recording

## Loading the Extension

1. Run:

```powershell
npm run build
```

2. Open:

```text
chrome://extensions
```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select:

```text
recordock/extension/dist
```

6. Pin Recordock to the toolbar.

After rebuilding, click **Reload** on the extension card.

## Manual Test Matrix

### Browser Tab Recording

1. Open Recordock.
2. Select **Capture available audio**.
3. Click **Start Recording**.
4. Choose a Chrome tab.
5. Enable **Share tab audio**.
6. Start recording.
7. Reopen the popup.
8. Confirm the timer advances.
9. Confirm **Audio captured** is shown.
10. Stop recording.
11. Confirm the preview loads.
12. Confirm video and audio playback.
13. Download the recording.

### Application-Window Recording

1. Start recording.
2. Select an application window.
3. Confirm the selected window is captured.
4. Accept **Video only** if Chrome provides no audio track.
5. Stop and preview.
6. Download the recording.

### Full-Monitor Recording

1. Start recording.
2. Select a monitor.
3. Enable available system audio when provided.
4. Confirm the complete monitor is captured.
5. Stop and preview.
6. Download the recording.

### No-Audio Recording

1. Select **No audio**.
2. Record a tab that is playing audio.
3. Stop and preview.
4. Confirm the recording contains no audio.

### Picker Cancellation

1. Click **Start Recording**.
2. Cancel Chrome's source picker.
3. Confirm Recordock returns to idle.
4. Confirm another recording can be started.

### Popup Restoration

1. Start recording.
2. Close the popup.
3. Wait several seconds.
4. Reopen the popup.
5. Confirm the timer reflects the complete elapsed time.
6. Confirm the `REC` badge is visible.

### Popup Stop Button

1. Start recording.
2. Reopen the popup.
3. Click **Stop Recording**.
4. Confirm the processing state appears.
5. Confirm only one recording is created.

### Native Stop Sharing

1. Start recording.
2. Use Chrome's native **Stop Sharing** control.
3. Reopen Recordock.
4. Confirm the recording is ready.
5. Confirm preview and download work.

### Inline Preview

Verify:

- Video loads
- Play works
- Pause works
- Seeking works
- Audio works when captured
- File size is displayed
- Filename is displayed

### Expanded Preview

1. Click **Expand**.
2. Confirm a dedicated preview window opens.
3. Confirm playback works.
4. Confirm **Download** works.
5. Confirm **Close** works.

### Record Again

1. Complete a recording.
2. Click **Record Again**.
3. Confirm Chrome's picker opens.
4. Complete another recording.
5. Confirm the newest recording replaces the previous preview.

### Extension Reload Recovery

1. Start recording.
2. Reload Recordock from `chrome://extensions`.
3. Reopen the popup.
4. Confirm Recordock does not remain stuck with an invalid timer.
5. Confirm an error or recoverable idle state is shown.

## Failure Checks

The following must not occur:

- Duplicate recordings from one stop action
- Multiple source pickers from one start action
- Automatic download immediately after stopping
- Recording upload
- Popup permanently stuck in selecting
- Popup permanently stuck in recording
- Popup permanently stuck in stopping
- Missing toolbar badge during active recording
- Stale toolbar badge after recording ends
- Empty downloaded WebM
- Crashes when audio is unavailable