# Recordock Privacy Policy

Last updated: July 29, 2026

## Overview

Recordock is a privacy-focused Chrome screen-recording extension.

Recordock allows users to record one selected browser tab, application window, or monitor and save the completed recording locally as a WebM file.

## Local Processing

Screen recordings are processed locally inside the user's browser.

Recordock does not upload screen recordings to a server.

Recordock does not provide cloud storage.

Recordock does not require a user account.

## Recording Data

Recordock may temporarily store the latest completed recording inside the browser using IndexedDB so the user can preview and download it.

This temporary recording remains on the user's device.

Starting another recording may replace or remove the previously stored recording.

## Recording State

Recordock stores temporary recording-state information using Chrome's session storage.

This information may include:

- Whether a recording is active
- The recording start time
- The generated filename
- The approximate file size
- Whether an audio track was captured
- Recording error information

This information is used only to operate the extension and restore its user interface.

## Audio

When the user selects audio capture, Chrome may provide tab audio, system audio, or no audio depending on the selected source, browser, operating system, and picker settings.

Recordock only records audio when Chrome includes an audio track in the selected media stream.

## Data Collection

Recordock does not collect:

- Personal information
- Account information
- Browsing history
- Website content
- Screen-recording content
- Recorded application names
- Recorded tab URLs
- Analytics data
- Advertising identifiers
- Location data
- Payment information

## Data Sharing

Recordock does not sell, rent, share, or transfer recording data to third parties.

## Network Communication

The initial free version of Recordock does not require a backend server for recording.

Recording content is not transmitted over a network by Recordock.

## Permissions

### `offscreen`

Used to maintain a hidden recording context after the extension popup closes.

### `storage`

Used to persist temporary recording state so the popup can restore the current workflow.

## User Control

The user controls:

- When recording starts
- Which source Chrome shares
- Whether available source audio is requested
- When recording stops
- Whether the completed recording is downloaded
- Whether another recording is started

Chrome also provides its own native Stop Sharing control.

## Data Retention

Recordock stores only the latest completed recording in browser storage for preview and download.

The recording may be replaced or removed when the user starts another recording, reloads or removes the extension, clears browser data, or otherwise removes local extension storage.

## Security

Recordock uses Chrome extension isolation and browser storage APIs to process and store recording data locally.

Users should download important recordings before clearing browser data or removing the extension.

## Changes to This Policy

This privacy policy may be updated when Recordock adds, removes, or changes features.

The updated policy will display a revised last-updated date.

## Contact

For support or privacy questions, use the Recordock GitHub repository:

```text
https://github.com/jayasuryapazhani/recordock
```