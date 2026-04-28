# Screen Gallery

This gallery uses screenshots from `docs/doc_image` for GitHub-visible documentation.

## Home

How it works: Loads active reports and lets users scan, open, and act on items quickly.

Architecture: `HomeScreen` + `ItemsContext` + `itemService.list` + backend item list API.

UI/UX: Card-first visual hierarchy and motion support fast browsing.

![Home Screen](./doc_image/home_page.jpg)
Display Note: This main feed display demonstrates quick-scan card design where users can rapidly evaluate item details and move directly into action flows.
![Home Screen Variant](./doc_image/home_page1.jpg)
Display Note: This feed variant display emphasizes visual continuity, helping users maintain browsing rhythm while reviewing multiple reports.

## Login

How it works: Authenticates user and unlocks protected flows (report, chat, save, verify).

Architecture: `LoginScreen` + `AuthContext` + `authService` + auth API.

UI/UX: Minimal form and clear action button to reduce login friction.

![Login Screen](./doc_image/login.jpg)
Display Note: This login display acts as the authentication gateway that establishes secure session access for all protected app capabilities.

## Report Flow

How it works: Collects item details, safety metadata, image, and location, then creates a report.

Architecture: `ReportItemScreen` + `ItemsContext.createReport` + item create API + `Item` model.

UI/UX: Guided sections, validation feedback, and confidence checks improve report quality.

![Report Item Screen](./doc_image/report_item.jpg)
Display Note: This report display highlights a high-quality submission workflow with guided sections, validation cues, and completion clarity.
![Lost Form](./doc_image/lost_form.jpg)
Display Note: This lost-form display focuses on identity confidence and recovery safety by capturing proof hints and controlled meetup context.
![Lost and Found Form](./doc_image/lost-found-form.jpg)
Display Note: This combined template display shows a reusable flow that cleanly adapts to both lost and found report scenarios.

## Search / Found Items

How it works: Filters and searches reports to find the best possible match.

Architecture: `SearchScreen` + query filters + `itemService.list(query)` + list query builder in backend.

UI/UX: Search narrowing and scan-friendly rows reduce effort and time.

![Found Items Or Search](./doc_image/found-items-search.jpg)
Display Note: This search-result display demonstrates filter-based narrowing for faster potential-match discovery in high-volume item lists.

## Account

How it works: Provides personal profile/settings access and app preference controls.

Architecture: `AccountScreen` + `AuthContext` + `ThemeContext` + local storage services.

UI/UX: Consistent settings layout in light/dark themes supports clarity and comfort.

![Account Screen](./doc_image/account.jpg)
Display Note: This account display serves as the personal profile and settings center for identity, preferences, and user-level controls.
![Dark Mode Account](./doc_image/darkmode_account.jpg)
Display Note: This dark-mode account display improves mobile comfort with contrast-aware typography and balanced visual emphasis.

## Alerts

How it works: Displays important system events like matches and moderation updates.

Architecture: `NotificationsScreen` + notification service/API + `Notification` model.

UI/UX: Event-priority list keeps users focused on actions that matter most.

![Alerts Screen](./doc_image/alerts.jpg)
Display Note: This alerts display shows a chronological event stream with clear, actionable status updates tied to recovery workflow progress.
