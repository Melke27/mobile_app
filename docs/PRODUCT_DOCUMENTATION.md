# Campus Lost & Found - Product Documentation

This document provides a complete functional and UX-oriented overview of the Campus Lost & Found platform.

## 1. Product Goal

The app helps students and staff quickly report, discover, verify, and recover lost items with safer handoff workflows.

## 2. User Roles

- Guest user
  - View public feed and item details.
  - Must sign in for chat, report creation, save actions, and moderation actions.
- Authenticated user
  - Create lost/found reports with image + location.
  - Chat with reporter, save posts, verify ownership, mark recovered.
  - Flag suspicious content.
- Admin
  - Access moderation dashboard.
  - Review flagged reports and remove harmful content.

## 3. Main Functional Modules

### 3.1 Authentication

- Register and login using JWT.
- First registered account can be assigned admin role (bootstrap flow).

### 3.2 Report Creation (Enhanced)

Users can create high-quality reports with:

- Status: lost or found
- Item title and description
- Category and campus
- Location text and optional GPS
- Image from camera/gallery
- Last seen hint
- Urgency level: low, normal, high
- Ownership proof hint (required when status is `lost`)
- Safe meetup spot (required)
- Optional reward offer (for lost reports)
- Duplicate warning before submit
- Local draft auto-save and restore

### 3.3 Discovery and Matching

- Feed listing with filters
- Search by keyword/category/campus
- Match suggestions on item details
- Similar report prompts during report submission

### 3.4 Communication

- In-app chat between finder and owner/reporter
- Notification center for matching and moderation-related events

### 3.5 Safety and Trust

- Ownership verification token flow
- Flag suspicious reports for admin moderation
- Recovery status update (`recovered`)
- Safe meetup guidance in report + detail screens

### 3.6 Admin Operations

- Flagged item review
- Review status workflow
- Report deletion and moderation trace fields

## 4. Data Model Highlights (Item)

Enhanced item fields now include:

- `lastSeenHint`
- `urgency` (`low|normal|high`)
- `proofHint`
- `safeMeetupSpot`
- `rewardOffer`

These work together to improve safety, reduce fake claims, and speed up successful recovery.

## 5. UI/UX Decisions

### 5.1 UX Principles Used

- Clarity first: required fields and validation guidance reduce bad submissions.
- Safer recovery flows: proof hint + safe meetup fields are visible and actionable.
- Progressive detail: quick chips + advanced fields keep flow efficient.
- Confidence and trust: duplicate checks and recovery-status actions reduce confusion.
- Mobile readability: larger cards, clear icon labels, and meaningful action grouping.

### 5.2 UI Patterns Used

- Card-based sections for report clarity and visual scanning
- Status/urgency chips for fast recognition
- Summary panel before submit
- Contextual actions in item details:
  - message reporter
  - verify ownership
  - mark recovered
  - open safe meetup map

## 6. Screenshot Paths (`docs/doc_image`)

All screenshots are stored in:

- `docs/doc_image/`

Direct paths:

- `docs/doc_image/home_page.jpg`
- `docs/doc_image/home_page1.jpg`
- `docs/doc_image/login.jpg`
- `docs/doc_image/report_item.jpg`
- `docs/doc_image/lost_form.jpg`
- `docs/doc_image/lost and found form.jpg`
- `docs/doc_image/found iteamsorsearchba.jpg`
- `docs/doc_image/account.jpg`
- `docs/doc_image/darkmode_account.jpg`
- `docs/doc_image/alerts.jpg`

Preview gallery:

- See [SCREEN_GALLERY.md](./SCREEN_GALLERY.md)

## 7. API and Technical References

- [API_SPEC.md](./API_SPEC.md)
- [MONGODB_SCHEMA.md](./MONGODB_SCHEMA.md)
- [FEATURE_MATRIX.md](./FEATURE_MATRIX.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [TEST_PLAN.md](./TEST_PLAN.md)

## 8. Deployment and Visibility Notes

To keep documentation visible on GitHub:

- Keep documentation links in `README.md` under Documentation Index.
- Keep screenshots under `docs/doc_image/` and reference by relative path.
- Use Markdown image embeds (see `SCREEN_GALLERY.md`) for direct rendering in GitHub.
