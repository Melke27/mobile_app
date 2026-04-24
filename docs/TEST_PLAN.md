# Testing Plan

## 1. Unit Testing

- Validate helper functions (`validators`, `matchScore`, token parsing)
- Validate controller edge cases (missing fields, invalid ids)

## 2. API Testing

- Auth routes: register/login/me
- Item routes: create/list/get/flag/recovered/delete
- Chat routes: send/list
- Notification routes: register token/list/read/read-all
- Admin authorization checks

## 3. Mobile Integration Testing

- Login -> Home feed load
- Report item with image + GPS -> item appears in list
- Search filters return expected results
- Chat sends and reloads messages
- Alerts tab loads notifications and marks read
- Admin can view flagged list and delete item

## 4. Device/Field Testing

- Camera permission denied flow
- GPS permission denied flow
- Offline mode cache fallback
- Network restoration sync

## 5. UAT Checklist

- Students can report in < 1 minute
- Search result relevance acceptable
- Chat experience understandable
- Recovery completion flow clear
