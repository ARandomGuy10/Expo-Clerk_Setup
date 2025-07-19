import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Text } from 'react-native';

/**
 * Tabs layout component that shows the main app navigation.
 * This is a protected route - only accessible to authenticated users.
 */
export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, isLoaded]);

  // Show loading state while checking auth
  if (!isLoaded || !isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // Render the tab navigator for authenticated users
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        backgroundColor: '#FFFFFF',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
      },
    }}>
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
