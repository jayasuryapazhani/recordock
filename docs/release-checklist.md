# Recordock Release Checklist

## Source Validation

- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] `npm run validate` passes
- [ ] No TypeScript errors
- [ ] No Oxlint warnings
- [ ] No service-worker console errors
- [ ] No popup console errors
- [ ] No offscreen-document errors
- [ ] No preview-page errors

## Extension Loading

- [ ] Manifest V3 extension loads successfully
- [ ] Extension name is correct
- [ ] Extension version is correct
- [ ] Extension description is correct
- [ ] Toolbar popup opens
- [ ] Background service worker starts
- [ ] Offscreen document is created only when needed
- [ ] Expanded preview page builds correctly

## Recording

- [ ] Browser-tab recording works
- [ ] Application-window recording works
- [ ] Full-monitor recording works
- [ ] Recording continues after popup closes
- [ ] Recording timer restores accurately
- [ ] `REC` toolbar badge is displayed
- [ ] Popup **Stop Recording** works
- [ ] Chrome native **Stop Sharing** works
- [ ] Duplicate Start is prevented
- [ ] Duplicate Stop is prevented
- [ ] Picker cancellation is handled
- [ ] Interrupted recording state is recoverable

## Audio

- [ ] **Capture available audio** can be selected
- [ ] **No audio** can be selected
- [ ] Chrome tab audio works when shared
- [ ] Video-only fallback works
- [ ] **Audio captured** status is accurate
- [ ] **Video only** status is accurate
- [ ] Recording succeeds when no audio track is available

## Recording Output

- [ ] Output is WebM
- [ ] Recording Blob is not empty
- [ ] Filename follows Recordock format
- [ ] File size is displayed
- [ ] Inline preview loads
- [ ] Playback works
- [ ] Seeking works
- [ ] Expanded preview works
- [ ] Download works
- [ ] Download begins only after user action
- [ ] **Record Again** works
- [ ] Latest recording replaces the previous recording

## Privacy

- [ ] Recording is processed locally
- [ ] Recording is not uploaded
- [ ] No backend is required
- [ ] No account is required
- [ ] No analytics are included
- [ ] No advertising identifiers are included
- [ ] Privacy policy is publicly available
- [ ] Permission descriptions are accurate
- [ ] Chrome Web Store data disclosures are accurate

## Store Assets

- [ ] 16 × 16 icon
- [ ] 32 × 32 icon
- [ ] 48 × 48 icon
- [ ] 128 × 128 icon
- [ ] Store screenshots
- [ ] Promotional image if required
- [ ] Short description
- [ ] Detailed description
- [ ] Single-purpose statement
- [ ] Permission justifications
- [ ] Privacy-policy URL
- [ ] Support URL
- [ ] Landing-page URL
- [ ] GitHub URL

## Packaging

- [ ] Production build is current
- [ ] `dist` contains only required production files
- [ ] No `.env` files
- [ ] No secrets
- [ ] No private keys
- [ ] No source maps unless intentionally included
- [ ] ZIP is created from the contents of `dist`
- [ ] ZIP opens successfully
- [ ] ZIP loads as an unpacked extension for final verification

## Publication

- [ ] GitHub repository is public
- [ ] README is complete
- [ ] Architecture documentation is complete
- [ ] Testing documentation is complete
- [ ] Privacy policy is complete
- [ ] Landing page is deployed
- [ ] Chrome Web Store listing is complete
- [ ] Extension submitted for review
- [ ] Published Chrome Web Store link added to README
- [ ] Published Chrome Web Store link added to landing page