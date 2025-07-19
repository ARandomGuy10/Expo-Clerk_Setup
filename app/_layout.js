import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

/**
 * Root layout component that wraps the entire app with ClerkProvider.
 * This sets up authentication context and navigation structure.
 */

// Get the publishable key from environment variables
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Throw an error if the publishable key is missing
if (!publishableKey) {
  throw new Error(
    'Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.'
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider 
      tokenCache={tokenCache}
      publishableKey={publishableKey}
    >
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ClerkProvider>
  );
}