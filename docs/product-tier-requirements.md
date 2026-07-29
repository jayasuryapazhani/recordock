# Recordock Product Tier Requirements

## Document Purpose

This document defines the planned feature boundaries between Recordock Free, Recordock Premium, and a possible future Recordock Teams tier.

These requirements describe the intended product direction. They do not mean that every listed capability is currently implemented.

The current Recordock `0.1.0` release provides the initial local screen-recording foundation.

---

## Product Vision

Recordock should provide a complete and useful private screen recorder at no cost.

The free version should solve the basic recording problem without forcing users to create an account or upload recordings.

Recordock Premium should provide advanced tools for creating, editing, organizing, exporting, and sharing professional recordings.

### Product Positioning

> Recordock Free gives users a complete private screen recorder. Recordock Premium turns recordings into polished, organized, and shareable content.

---

## Product Model

Recordock will use a free and premium product model.

### Public Repository

The public Recordock repository contains the free version, public documentation, and the core local-recording implementation.

### Private Premium Repository

Premium implementation should be developed in a separate private repository.

The private repository may contain:

- Subscription integration
- Premium feature implementation
- Account integration
- Entitlement validation
- Payment-service integration
- Cloud-storage integration
- AI-service integration
- Premium analytics
- Team and administrative functionality

The public repository must not contain private API keys, payment secrets, signing secrets, or privileged backend credentials.

---

# Recordock Free

## Free-Tier Objective

The free tier must provide a complete basic recording workflow.

Users should be able to:

1. Select a recording source.
2. Record video and audio.
3. Stop the recording.
4. Preview the result.
5. Download the recording locally.

The free tier should be useful enough for personal recordings, demonstrations, tutorials, bug reports, and occasional professional use.

---

## Free Recording Sources

Recordock Free must support:

- Browser-tab recording
- Application-window recording
- Complete-monitor recording

Source selection must continue to use Chrome's secure screen-sharing picker.

---

## Free Audio Requirements

Recordock Free should support:

- Browser-tab audio
- Available system or source audio
- Microphone recording
- Screen-audio and microphone mixing
- Microphone mute and unmute
- Microphone-device selection
- Basic microphone volume indication
- Video-only recording

Microphone recording must not require a Premium subscription because narration is a fundamental recording capability.

---

## Free Camera Requirements

Recordock Free should include a basic camera overlay.

The basic camera overlay should support:

- Camera on and off
- Camera-device selection
- Circular camera shape
- Small, medium, and large sizes
- Top-left position
- Top-right position
- Bottom-left position
- Bottom-right position
- Mirrored camera preview
- Camera preview before recording

Advanced movement and visual customization may require Recordock Premium.

---

## Free Recording Controls

Recordock Free should support:

- Start recording
- Stop recording
- Pause recording
- Resume recording
- Recording timer
- Recording-status indicator
- Screen-audio status
- Microphone status
- Camera status
- Chrome native Stop Sharing handling
- Restoring recording state after the popup closes
- Basic keyboard shortcuts

---

## Free Preview and Download

Recordock Free must support:

- Inline popup preview
- Expanded preview
- Local WebM download
- Record Again
- Recording filename
- File-size display
- Recording-duration display
- Audio-status display

Recordock must not insert a watermark into free recordings.

Branding may appear inside the extension interface but should not be embedded into the exported video.

---

## Free Recording Quality

Recordock Free should support:

- 720p recording
- 1080p recording
- Standard recording-quality preset
- Standard frame rate
- WebM export

The exact quality available depends on the selected source, device, operating system, and browser capabilities.

---

## Free Local History

Recordock Free should retain up to five completed recordings locally.

Free history should support:

- Recording preview
- Recording download
- Recording deletion
- Created date
- Duration
- File size
- Audio status

When the free history limit is reached, Recordock should clearly explain what will happen before removing or replacing an older recording.

---

## Free Privacy Requirements

Recordock Free must preserve the local-first product model.

Requirements:

- No automatic recording upload
- No account required for local recording
- No cloud-storage requirement
- No recording-content analytics
- User-controlled downloads
- Clear microphone and camera permission explanations
- Clear notice when a feature requires network access
- Clear separation between local and cloud functionality

---

# Recordock Premium

## Premium-Tier Objective

Recordock Premium should improve recording quality, production control, organization, editing, export, and optional sharing.

Premium should enhance the complete free workflow rather than make the free recorder unusable.

---

## Premium Recording Quality

Recordock Premium may support:

- 1440p recording
- 4K recording when supported
- 30 FPS selection
- 60 FPS selection
- Custom frame-rate controls
- Custom bitrate controls
- Low, standard, high, and maximum quality presets
- File-size optimization presets
- Performance warnings for unsupported configurations

---

## Premium Audio Features

Recordock Premium may support:

- Advanced noise suppression
- Echo reduction
- Automatic microphone gain
- Manual microphone gain
- Separate microphone and source-audio tracks
- Audio-only export
- Background-noise cleanup
- Voice-enhancement presets
- Per-track volume controls

---

## Premium Camera Features

Recordock Premium should support an advanced camera overlay.

Requirements may include:

- Drag camera anywhere
- Freely resize camera
- Circular shape
- Rounded-square shape
- Rectangular shape
- Custom border
- Custom border thickness
- Custom border color
- Camera shadow
- Camera background
- Camera opacity
- Camera zoom
- Mirror camera
- Hide and restore camera while recording
- Camera entrance and exit effects
- Save camera presets

---

## Premium Presentation and On-Screen Drawing

Recordock Premium should provide live on-screen drawing tools for users who record tutorials, presentations, demonstrations, lessons, and training material.

The presenter should be able to explain or emphasize information while the recording is active, without needing a separate annotation application.

### Initial Supported Scope

The first implementation should prioritize browser-tab recordings.

Annotations should be rendered into the final recording so that viewers can see the presenter's drawings during playback.

Support for drawing over external application windows or the complete desktop may require a different implementation and should not be promised until it is technically validated.

### Drawing Toolbar

The Premium drawing toolbar should support:

- Show and hide toolbar
- Move toolbar
- Minimize toolbar
- Exit drawing mode
- Clear all annotations
- Undo
- Redo

The toolbar should remain unobtrusive and should not cover important presentation content.

### Drawing Tools

Premium drawing tools should include:

- Freehand pen
- Highlighter
- Straight line
- Arrow
- Rectangle
- Circle
- Text
- Numbered marker
- Pointer
- Spotlight
- Eraser

### Drawing Customization

Users should be able to configure:

- Drawing color
- Line thickness
- Highlighter opacity
- Text size
- Text color
- Shape border thickness
- Spotlight size
- Eraser size

Recordock should remember the user's most recently selected drawing settings.

### Presentation Controls

Premium presentation mode should support:

- Temporarily hide drawings
- Restore hidden drawings
- Clear the current screen
- Freeze the current drawing
- Start a new annotation layer
- Highlight the cursor
- Emphasize mouse clicks
- Enable or disable drawing without stopping the recording

### Recording Integration

On-screen drawings must:

- Appear in the completed recording
- Remain synchronized with the recording timeline
- Work without stopping the active recording
- Avoid changing the underlying webpage
- Avoid permanently modifying page content
- Be removed when drawing mode ends
- Be cleared safely if the recording is cancelled
- Not remain visible after Recordock closes

### User Interaction

When drawing mode is enabled, Recordock must clearly indicate whether:

- Pointer interaction controls the webpage
- Pointer interaction creates drawings
- The drawing toolbar is active
- The annotation layer is visible
- The annotation layer is hidden

Users must be able to quickly switch between interacting with the webpage and drawing over it.

### Performance Requirements

Drawing must not significantly reduce recording quality.

Recordock should:

- Keep pen movement responsive
- Avoid visible drawing lag
- Avoid excessive CPU usage
- Avoid excessive memory usage
- Handle rapid pointer movement
- Preserve recording audio synchronization
- Warn the user when the selected device cannot maintain stable performance

### Drawing Acceptance Criteria

The initial Premium drawing feature is complete when:

- A Premium user can enable drawing during a browser-tab recording.
- A free user sees a clear Premium upgrade message.
- The user can draw with a pen.
- The user can highlight content.
- The user can add arrows and shapes.
- The user can erase individual annotations.
- The user can clear all annotations.
- Undo and redo work correctly.
- The drawing toolbar can be moved.
- The toolbar can be hidden.
- The final recording contains the annotations.
- The underlying webpage is not permanently changed.
- Ending or cancelling the recording removes the annotation interface.
- Drawing does not interrupt screen audio or microphone audio.
- Drawing failures do not corrupt the recording.

### Deferred Drawing Capabilities

The following are not required for the initial Premium drawing release:

- Collaborative drawing
- Multi-user whiteboards
- Drawing over every external desktop application
- Drawing synchronization between devices
- Cloud-hosted annotation projects
- Re-editing live annotations after recording
- Shape recognition
- Handwriting recognition
- AI-generated diagrams

---

## Premium Cursor Effects

Premium cursor features may include:

- Cursor highlighting
- Click animation
- Click sound
- Cursor enlargement
- Cursor smoothing
- Automatic click zoom
- Hide inactive cursor
- Custom cursor appearance

---

## Premium Editing

The first editing release should prioritize simple local editing.

Requirements may include:

- Trim recording start
- Trim recording end
- Remove selected sections
- Split recording
- Combine recording segments
- Crop video
- Mute selected sections
- Replace selected audio
- Adjust volume
- Add text
- Add title card
- Add ending card
- Add logo
- Blur sensitive information
- Add static zoom
- Add automatic zoom around clicks
- Undo and redo editing actions
- Preview before export

Editing should remain local when technically practical.

---

## Premium Export

Premium export options may include:

- WebM
- MP4
- GIF
- Audio-only export
- Compressed video
- Custom resolution
- Custom frame rate
- Custom bitrate
- Social-media presets
- Presentation preset
- Tutorial preset
- Email-friendly preset

Export progress and failures must be clearly communicated.

---

## Premium Recording History

Recordock Premium should provide unlimited local recording history, subject to device storage.

History requirements may include:

- Rename recording
- Delete recording
- Duplicate recording
- Search recordings
- Sort recordings
- Filter recordings
- Favourite recordings
- Add tags
- Create folders
- Move recordings between folders
- Display creation date
- Display duration
- Display file size
- Display recording source
- Display audio configuration
- Display camera configuration
- Storage-usage indicator
- Bulk delete
- Bulk export

Recordock must warn the user when browser storage is low.

---

## Premium Branding

Premium branding features may include:

- Custom logo
- Custom colors
- Custom video frame
- Custom title card
- Custom ending card
- Saved brand presets
- Multiple brand profiles
- Remove Recordock interface branding from exported presentation layouts

Recordock Free recordings should still remain watermark-free.

---

## Premium Captions and Transcription

Premium may include:

- Automatic transcription
- Automatic captions
- Caption editing
- Caption styling
- Caption export
- Transcript export
- Speaker identification
- Search transcript
- Remove filler words
- Create chapters from transcript

AI processing must clearly disclose when recording content leaves the local device.

---

## Premium AI Features

Future Premium AI capabilities may include:

- Automatic recording title
- Recording summary
- Chapter generation
- Action-item extraction
- Meeting-note generation
- Tutorial-step generation
- Silence removal
- Filler-word detection
- Transcript cleanup
- Social-post generation
- Email-summary generation

AI features should use usage limits because external AI processing creates operational costs.

---

## Premium Cloud and Sharing

Optional cloud features may include:

- User accounts
- Encrypted upload
- Cloud backup
- Shareable recording links
- Password-protected recordings
- Expiring links
- Disable downloads
- Viewer access controls
- Replace a shared recording without changing its link
- Video comments
- Timestamped comments
- Viewer analytics
- Unique-viewer count
- Completion rate
- Watch-time analytics

Cloud functionality must remain optional. Local recording should continue to work without cloud upload.

---

# Recordock Teams

Recordock Teams is a possible later product tier.

Potential requirements include:

- Everything in Recordock Premium
- Shared team workspace
- Shared folders
- Team recording library
- Member invitations
- Member roles
- Workspace administrators
- Centralized billing
- Organization branding
- Shared brand presets
- Team analytics
- Audit logs
- Recording-retention rules
- Domain-based access
- Single sign-on
- User provisioning
- Organization-level security controls
- Priority support
- Administrative usage reporting

Recordock Teams should not be implemented until the individual Premium product has demonstrated demand.

---

# Initial Premium Release

## Premium Version 1 Priorities

The first paid release should focus on features that can build upon Recordock's current local architecture.

Priority order:

1. Unlimited local recording history
2. Advanced camera overlay
3. Recording-quality controls
4. Live on-screen drawing for presentations and teaching
5. Basic local video trimming
6. Additional export options
7. Premium subscription and entitlement validation

The first Premium release should avoid unnecessary cloud infrastructure unless user research shows strong demand for hosted sharing.

---

## Initial Premium Acceptance Criteria

The first Premium release is ready when:

- A user can purchase or activate Premium.
- Premium status is validated securely.
- A free user cannot enable Premium functionality only by changing local storage.
- Premium features are clearly identified.
- Existing free features continue to work without an account.
- Premium users can use advanced features after reopening Chrome.
- Subscription expiration removes Premium access safely.
- Failed entitlement checks produce a clear message.
- The extension contains no private service credentials.
- Premium validation failure does not delete local recordings.

---

# Feature-Gating Requirements

## Free User Experience

When a free user selects a Premium capability:

- Explain what the feature does.
- Show that it requires Recordock Premium.
- Show the Premium benefit.
- Provide a clear upgrade action.
- Do not interrupt active recordings.
- Do not repeatedly display aggressive upgrade prompts.
- Do not hide the user's existing recordings.
- Do not prevent access to core free recording functionality.

---

## Premium Entitlement Validation

Premium access must not rely only on:

```text
localStorage
chrome.storage
IndexedDB
A client-side isPremium boolean
A hidden extension setting
```

The extension should obtain entitlement information from a trusted Recordock backend.

Entitlement information should include:

- User identifier
- Subscription plan
- Subscription status
- Premium feature set
- Expiration or renewal information
- Server-issued validation
- Last successful entitlement check

The backend remains the authority for paid access.

---

# Security Requirements

## Extension Security

The extension must never contain:

- Stripe secret keys
- Payment-provider private keys
- Database credentials
- AI-provider secret keys
- Cloud-storage secret keys
- Signing private keys
- Administrative tokens

Client-side code must be treated as inspectable.

A private premium repository protects development source and history, but code packaged inside a browser extension may still be inspected after installation.

Sensitive operations must be enforced by the backend.

---

## Payment Security

Recordock should use a payment provider such as Stripe for payment handling.

The Recordock backend should:

- Create checkout sessions
- Receive verified webhooks
- Store customer and subscription references
- Determine subscription status
- Issue entitlement responses
- Handle cancellation
- Handle renewal
- Handle failed payments
- Handle refunds
- Handle plan changes

The extension must not process or store complete payment-card details.

---

## Cloud Security

Future cloud recording features must include:

- Authentication
- Authorization
- User ownership validation
- Signed upload requests
- Signed download requests
- Storage isolation
- Secure deletion
- Rate limiting
- File-size validation
- Content-type validation
- Retention rules
- Audit logging
- Abuse controls

---

# Repository Requirements

## Public Repository

The public repository may contain:

- Recordock Free extension
- Recordock Free landing page
- Public documentation
- Free feature tests
- Privacy policy
- Product-tier requirements
- Public architecture documentation

## Private Repositories

Private repositories should contain:

- Premium implementation
- Recordock backend
- Payment integration
- Subscription service
- Entitlement service
- Cloud-storage service
- AI integration
- Internal operational documentation
- Deployment credentials and configuration

No secret should be committed to either a public or private Git repository.

---

# Proposed Pricing

Pricing is provisional and must be validated against user demand and implemented features.

| Plan | Proposed price |
|---|---:|
| Recordock Free | $0 |
| Premium Monthly | $4.99–$6.99 per month |
| Premium Annual | $39.99–$59.99 per year |
| Early-Adopter Lifetime | $59–$89 one time |
| Recordock Teams | To be determined |

A lifetime plan should only be offered when the ongoing cost of cloud storage, AI processing, and support can be controlled.

Server-dependent features may require fair-usage limits even for lifetime customers.

---

# Development Sequence

Recommended implementation order:

1. Publish the existing free local recorder.
2. Add microphone recording.
3. Add screen-audio and microphone mixing.
4. Add a basic free camera overlay.
5. Add pause and resume.
6. Add local recording history.
7. Collect user feedback.
8. Add advanced camera controls.
9. Add recording-quality controls.
10. Add basic local editing.
11. Build accounts and entitlement validation.
12. Launch the first Premium subscription.
13. Add optional cloud sharing based on demand.
14. Add transcription and AI features.
15. Evaluate Recordock Teams after Premium adoption.

---

# Non-Goals for the Initial Release

The initial Recordock release does not require:

- Cloud hosting
- User accounts
- Payment processing
- AI processing
- Team workspaces
- Collaboration
- Viewer analytics
- MP4 conversion
- Full video editing
- Unlimited recording history
- Enterprise authentication

These capabilities belong to later release phases.

---

# Open Product Decisions

The following decisions must be finalized before the paid launch:

- Exact free recording-history limit
- Whether free recordings have a duration limit
- Exact Premium monthly price
- Exact Premium annual price
- Whether a lifetime plan will be offered
- Which advanced camera controls launch first
- Whether MP4 conversion happens locally or through a backend
- Whether transcription is processed locally or remotely
- Cloud-storage limits
- AI usage limits
- Offline Premium entitlement grace period
- Subscription cancellation behavior
- Refund policy
- Teams pricing model

---

# Core Product Rule

The free version must always provide a complete basic recording workflow.

Premium should charge for advanced quality, editing, customization, organization, automation, sharing, AI, and team functionality—not for the basic ability to create and save a recording.