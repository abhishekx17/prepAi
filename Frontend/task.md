# Refined OTP Verification & Google Auth

- [x] Add `isVerified` flag to `user.model.js` schema
- [x] Implement two-step registration (create unverified -> send OTP -> verify & activate) in `auth.controller.js`
- [x] Implement two-step login (verify password -> send OTP -> verify OTP -> login) in `auth.controller.js`
- [x] Update endpoints and Google login handlers in `auth.controller.js`
- [x] Map updated routes in `auth.routes.js`
- [x] Update `useAuth.js` on the frontend with the two-step hooks
- [x] Rebuild `Login.jsx` & `Register.jsx` to render the GSI Google button and transition to OTP validation on form submission
- [x] Verify the auth flow manually
