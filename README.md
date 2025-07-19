# Expo + Clerk Starter

A clean starter template for building mobile applications with Expo and Clerk authentication.

## Features

- 🔐 Built-in authentication with Clerk
- 📱 Expo Router for navigation
- 📱 Tab-based navigation structure
- 🔄 OAuth support (Google, Apple)
- 🎨 Clean and minimal UI components
- 🛠 TypeScript support

## Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for testing on physical devices)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/singhsurya1012/Expo-Clerk_Setup.git
   cd Expo-Clerk_Setup
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your Clerk publishable key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device or emulator**
   - Scan the QR code with your iOS/Android device using the Expo Go app
   - Or press `i` for iOS simulator or `a` for Android emulator

## Project Structure

```
app/
  (auth)/           # Authentication screens
  (tabs)/           # Main app tabs (protected routes)
  _layout.js        # Root layout with Clerk provider
  index.js          # Entry point (redirects to auth or home)
```

## Authentication

This starter includes the following authentication screens:

- Sign In (email/password, Google, Apple)
- Sign Up (email/password, Google, Apple)
- Forgot Password
- Reset Password
- Email Verification

## Customization

### Adding a new screen
1. Create a new file in the appropriate directory (e.g., `app/new-screen.js`)
2. Export a React component as the default export
3. Use the `useRouter` hook from `expo-router` for navigation

### Styling
This project uses React Native's StyleSheet for styling. For a more scalable approach, consider using a styling solution like:
- `styled-components`
- `nativewind`
- `tamagui`

## Deployment

### Web
```bash
npx expo export:web
```

### iOS/Android
Follow the [Expo documentation](https://docs.expo.dev/distribution/introduction/) for building and publishing your app.

## License

MIT

## Support

For support, please open an issue in the GitHub repository.
