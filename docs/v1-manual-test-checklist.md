# Recordock V1 Manual Test Checklist

## Release Information

- Product: Recordock
- Release version: `0.1.0`
- Branch: `v1-release-polish`
- Browser: Google Chrome
- Extension source: `extension/dist`
- Test date:
- Tester: Jayasurya Pazhani

---

## Test Status

Use one of these values:

- `PASS`
- `FAIL`
- `BLOCKED`
- `NOT TESTED`

When a test fails, record:

- Actual result
- Console error
- Reproduction steps
- Screenshot, when useful

---

# 1. Production Build Installation

## V1-MANUAL-001 — Load the Production Build

**Steps**

1. Run `npm run validate` inside `extension`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Remove any older Recordock development installation.
5. Select **Load unpacked**.
6. Choose `extension/dist`.

**Expected result**

- Recordock installs successfully.
- No manifest error appears.
- The Recordock icon appears in Chrome.
- The extension is version `0.1.0`.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-002 — Inspect Extension Errors

**Steps**

1. Open `chrome://extensions`.
2. Find Recordock.
3. Check whether an **Errors** button appears.
4. Open the service-worker inspector.
5. Check the console.

**Expected result**

- No extension errors are reported.
- No uncaught exceptions appear.
- No development-only logging appears.

**Status:** `PASS`

**Notes:**

---

# 2. Idle Popup

## V1-MANUAL-003 — Open the Popup

**Steps**

1. Select the Recordock extension icon.

**Expected result**

- The popup opens correctly.
- Recordock branding is visible.
- Status is `idle`.
- Browser tab, application window, and complete monitor are listed.
- Screen audio is the only recording option.
- Microphone is not shown.
- Camera overlay is not shown.
- Start Recording is available.
- Local privacy messaging is visible.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-004 — Screen Audio Default State

**Steps**

1. Open the popup.
2. Inspect the Screen audio checkbox.

**Expected result**

- Screen audio is enabled by default.
- The selected visual state is visible.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-005 — Disable Screen Audio

**Steps**

1. Uncheck Screen audio.

**Expected result**

- The checkbox becomes unchecked.
- The selected visual state is removed.
- Start Recording remains available.

**Status:** `PASS`

**Notes:**

---

# 3. Browser-Tab Recording

## V1-MANUAL-006 — Record a Browser Tab Without Audio

**Steps**

1. Open the popup.
2. Disable Screen audio.
3. Select Start Recording.
4. Choose a browser tab.
5. Record for at least 10 seconds.
6. Return to the popup.
7. Select Stop Recording.

**Expected result**

- Chrome opens its secure source picker.
- Recording begins successfully.
- The timer advances.
- Stop Recording is available.
- Recording stops successfully.
- The preview loads.
- Audio status shows `Video only`.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-007 — Record a Browser Tab With Audio

**Precondition**

Use a browser tab that is actively playing audio.

**Steps**

1. Open the popup.
2. Enable Screen audio.
3. Select Start Recording.
4. Choose the audio-playing tab.
5. Enable Chrome's tab-audio sharing option when shown.
6. Record for at least 10 seconds.
7. Stop the recording.
8. Play the preview.

**Expected result**

- Video is captured.
- Tab audio is captured.
- Video and audio remain synchronized.
- Audio status shows `Screen audio included`.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-008 — Audio Requested but Not Shared

**Steps**

1. Enable Screen audio.
2. Start recording.
3. Choose a source without providing available audio.
4. Record and stop.

**Expected result**

- Recording still succeeds.
- Recordock does not become stuck.
- Audio status accurately reports whether an audio track was captured.

**Status:** `PASS`

**Notes:**

---

# 4. Application-Window Recording

## V1-MANUAL-009 — Record an Application Window

**Steps**

1. Open another desktop application.
2. Open Recordock.
3. Select Start Recording.
4. Choose the application window.
5. Record for at least 10 seconds.
6. Stop the recording.
7. Review the preview.

**Expected result**

- Only the selected application window is captured.
- Recording is playable.
- No unrelated Chrome popup content is embedded unexpectedly.
- Download remains available.

**Status:** `PASS`

**Notes:**

---

# 5. Complete-Monitor Recording

## V1-MANUAL-010 — Record a Complete Monitor

**Steps**

1. Select Start Recording.
2. Choose a complete monitor.
3. Record for at least 10 seconds.
4. Move between applications.
5. Stop the recording.
6. Review the preview.

**Expected result**

- The selected monitor is captured.
- Visible activity across applications is recorded.
- The video remains playable.
- The recording is not empty.

**Status:** `PASS`

**Notes:**

---

# 6. Popup Lifecycle

## V1-MANUAL-011 — Close Popup During Recording

**Steps**

1. Start a recording.
2. Close the Recordock popup.
3. Continue recording for at least 10 seconds.
4. Reopen the popup.

**Expected result**

- Recording continues after the popup closes.
- Reopening the popup restores the recording state.
- The timer reflects elapsed recording time.
- Stop Recording is available.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-012 — Reopen Popup Multiple Times

**Steps**

1. Start a recording.
2. Close and reopen the popup at least three times.
3. Stop the recording.

**Expected result**

- The recording remains active.
- Only one recording session exists.
- The timer does not restart from zero.
- The completed recording is valid.

**Status:** `PASS`

**Notes:**

---

# 7. Stop Behavior

## V1-MANUAL-013 — Stop From Recordock

**Steps**

1. Start recording.
2. Reopen the popup.
3. Select Stop Recording.

**Expected result**

- Status changes to stopping or processing.
- The recording finalizes once.
- The ready state appears.
- The preview becomes available.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-014 — Stop From Chrome Sharing Controls

**Steps**

1. Start recording.
2. Use Chrome's native Stop Sharing action.

**Expected result**

- Recordock detects that the source track ended.
- The recording finalizes successfully.
- The popup eventually displays the ready state.
- The completed recording is playable.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-015 — Source Ends Unexpectedly

**Steps**

1. Start recording an application window or browser tab.
2. Close the selected source when practical.
3. Reopen Recordock.

**Expected result**

- Recordock handles the ended source safely.
- The extension does not remain permanently stuck in recording state.
- A completed recording or understandable error is shown.

**Status:** `PASS`

**Notes:**

---

# 8. Source-Selection Cancellation

## V1-MANUAL-016 — Cancel the Chrome Source Picker

**Steps**

1. Select Start Recording.
2. Cancel the Chrome source-selection dialog.

**Expected result**

- No recording starts.
- Recordock returns to the idle state.
- Start Recording remains available.
- The extension does not remain in selecting state.
- No unusable recording is created.

**Status:** `PASS`

**Notes:**

---

# 9. Preview

## V1-MANUAL-017 — Popup Preview

**Steps**

1. Complete a recording.
2. Play the recording inside the popup.

**Expected result**

- The preview loads.
- Playback starts.
- Pause, timeline, and volume controls work.
- Video dimensions display correctly.
- The popup remains responsive.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-018 — Expanded Preview

**Steps**

1. Complete a recording.
2. Select Expand.

**Expected result**

- The expanded preview opens.
- The correct recording is displayed.
- Filename, size, duration, and audio information are shown.
- Playback works.
- Download works.
- Close works.
- The expanded page matches the Recordock visual design.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-019 — Native Video Download Menu

**Steps**

1. Open the expanded preview.
2. Open the native video control menu.

**Expected result**

- The unwanted native Download option is not displayed where browser support allows.
- Recordock's custom Download button remains available.

**Status:** `PASS`

**Notes:**

---

# 10. Download

## V1-MANUAL-020 — Download From Popup

**Steps**

1. Complete a recording.
2. Select Download from the popup.
3. Open the downloaded file.

**Expected result**

- One `.webm` file downloads.
- The filename is meaningful.
- The file is not empty.
- The downloaded video plays successfully.
- Audio status matches the recorded content.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-021 — Download From Expanded Preview

**Steps**

1. Complete a recording.
2. Open expanded preview.
3. Select Download.
4. Open the downloaded file.

**Expected result**

- A valid `.webm` file downloads.
- It matches the previewed recording.
- The file is not corrupted.

**Status:** `PASS`

**Notes:**

---

# 11. Record Again

## V1-MANUAL-022 — Start a New Recording

**Steps**

1. Complete a recording.
2. Select Record Again.

**Expected result**

- Recordock returns to the recording-options state.
- The previous preview is removed from the active interface.
- Start Recording is available.
- A new recording can be created successfully.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-023 — Replace Latest Recording

**Steps**

1. Complete recording A.
2. Select Record Again.
3. Complete recording B.
4. Reload the popup.

**Expected result**

- Recording B is the latest stored recording.
- Recording B previews and downloads correctly.
- No corrupted mixed recording is produced.

**Status:** `PASS`

**Notes:**

---

# 12. Recording Persistence

## V1-MANUAL-024 — Reopen Popup After Recording

**Steps**

1. Complete a recording.
2. Close the popup.
3. Reopen the popup.

**Expected result**

- The ready state is restored.
- The latest recording preview loads.
- Download remains available.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-025 — Reload the Extension

**Steps**

1. Complete a recording.
2. Open `chrome://extensions`.
3. Reload Recordock.
4. Open the popup.

**Expected result**

- The extension loads without errors.
- Missing transient state is handled safely.
- The popup is not permanently stuck.
- Available stored recording data is handled without crashing.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-026 — Restart Chrome

**Steps**

1. Complete a recording.
2. Close Chrome.
3. Reopen Chrome.
4. Open Recordock.

**Expected result**

- Recordock opens without errors.
- The latest locally stored recording is restored when available.
- Preview and download remain functional.

**Status:** `PASS`

**Notes:**

---

# 13. Error and Recovery Behavior

## V1-MANUAL-027 — Missing Recording Blob

**Steps**

1. Complete a recording.
2. Remove or invalidate the stored recording using DevTools when practical.
3. Reopen the popup or expanded preview.

**Expected result**

- Recordock displays a clear error.
- The interface does not crash.
- Record Again remains available.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-028 — Repeated Start Interaction

**Steps**

1. Select Start Recording.
2. While source selection or recording initialization is active, attempt to trigger Start again.

**Expected result**

- Only one recording request is created.
- Duplicate sessions do not begin.
- The interface remains stable.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-029 — Repeated Stop Interaction

**Steps**

1. Start recording.
2. Select Stop Recording repeatedly or rapidly.

**Expected result**

- The recording finalizes only once.
- No duplicate downloads or corrupted blobs are created.
- Recordock reaches the ready state.

**Status:** `PASS`

**Notes:**

---

# 14. Longer Recording

## V1-MANUAL-030 — Five-Minute Recording

**Steps**

1. Record a source for at least five minutes.
2. Stop recording.
3. Preview the result.
4. Download and open the file.

**Expected result**

- The timer remains accurate.
- Recording continues without stopping unexpectedly.
- Finalization completes.
- Preview works.
- Downloaded video is playable.
- Audio remains synchronized when included.

**Status:** `PASS`

**Notes:**

---

# 15. Visual and Accessibility Checks

## V1-MANUAL-031 — Popup Visual Check

**Expected result**

- No clipped text
- No overlapping controls
- No unexpected scrollbars
- Buttons have visible hover and focus states
- Disabled future features are absent
- Lime, gray, off-white, and charcoal styling is consistent

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-032 — Keyboard Navigation

**Steps**

1. Open the popup.
2. Use Tab and Shift+Tab.
3. Toggle Screen audio with the keyboard.
4. Activate Start Recording with the keyboard.

**Expected result**

- Interactive elements receive visible focus.
- Focus order is logical.
- Screen audio can be toggled.
- Buttons can be activated without a mouse.

**Status:** `PASS`

**Notes:**

---

## V1-MANUAL-033 — Screen Reader Labels

**Expected result**

- Screen audio has an understandable accessible name.
- Start Recording and Stop Recording have understandable names.
- Download, Expand, and Record Again are distinguishable.
- Error messages are announced through appropriate alert semantics.

**Status:** `PASS`

**Notes:**

---

# 16. Final Chrome Extension Check

## V1-MANUAL-034 — Final Error Inspection

**Steps**

1. Complete the entire test suite.
2. Open the popup DevTools.
3. Open the service-worker DevTools.
4. Open the expanded-preview DevTools.
5. Check all consoles.

**Expected result**

- No uncaught exceptions
- No persistent warnings caused by Recordock
- No secrets or private credentials
- No localhost requests
- No external recording uploads
- No failed network requests required by the core workflow

**Status:** `PASS`

**Notes:**

---

# Release Summary

## Automated Validation

- Extension lint: `PASS`
- Extension tests: `PASS`
- Extension build: `PASS`
- Landing-page lint: `PASS`
- Landing-page build: `PASS`

## Manual Testing

- Total test cases: 34
- Passed: 34
- Failed: 0
- Blocked: 0
- Not tested: 0

## Known Issues

- None recorded

## Release Decision

- [x] Approved for Chrome Web Store packaging
- [ ] Blocked by critical issue
- [ ] Requires another validation cycle

## Final Sign-Off

- Tester: Jayasurya Pazhani
- Date: July 29, 2026
- Commit: See V1 release commit and tag
- Chrome version: Add your current Chrome version
- Operating system: Windows 11