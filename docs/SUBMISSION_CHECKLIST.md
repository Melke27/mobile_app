# Submission Checklist (Campus Project)

## Core Deliverables

- React Native mobile app scaffold created
- MongoDB backend API scaffold created
- JWT auth and role-based admin routes implemented
- Lost/Found reporting with camera + GPS hooks implemented
- Search/filter workflow implemented
- Chat workflow implemented
- Moderation workflow implemented
- In-app alerts workflow implemented

## Mobile Computing Evidence

- Camera API used: `src/services/imageService.js`
- GPS API used: `src/services/locationService.js`
- Local storage used: `src/services/storageService.js`
- Real-time internet API sync used: `src/services/apiClient.js`
- Push-notification pipeline hook used: `src/services/notificationService.js`

## Documentation Package

- README overview and setup guide
- API specification
- MongoDB schema documentation
- Feature matrix
- Testing plan
- Deployment guide
- UML text version

## Final Demonstration Flow

1. Register account
2. Login
3. Report lost item with photo + location
4. Search reports
5. Open item detail and show potential matches
6. Chat between users
7. Flag report
8. Check Alerts tab for match/chat/moderation notifications
9. Admin reviews flagged post (keep/clear) or deletes it
10. Generate verification token in Verify screen
