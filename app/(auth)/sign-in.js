import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator } from 'react-native';
import { useOAuth, useSignIn, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export default function SignInScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

  // Redirect if already signed in
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.replace('/(tabs)/home');
    } else if (isAuthLoaded) {
      setAuthLoading(false);
    }
  }, [isAuthLoaded, isSignedIn]);

  if (authLoading || !isSignInLoaded || !isAuthLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const onSignInPress = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      // Navigate to the home tab after successful sign in
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('Sign in error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const { createdSessionId, cancelSignIn } = await googleAuth();
      
      if (cancelSignIn) {
        // User cancelled the sign in
        return;
      }
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigate to the home tab after successful OAuth sign in
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('OAuth error', err);
      // Don't show alert for user cancellation
      if (err?.code !== 'OAUTH_CALLBACK_ERROR') {
        Alert.alert('Error', 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const { createdSessionId, cancelSignIn } = await appleAuth();
      
      if (cancelSignIn) {
        // User cancelled the sign in
        return;
      }
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigate to the home tab after successful OAuth sign in
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('OAuth error', err);
      // Don't show alert for user cancellation
      if (err?.code !== 'OAUTH_CALLBACK_ERROR') {
        Alert.alert('Error', 'Failed to sign in with Apple');
      }
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue to Pocketrackr</Text>
          </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
              onSubmitEditing={onSignInPress}
            />
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password')}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onSignInPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]} 
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={[styles.socialButtonText, { color: '#DB4437' }]}>Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={20} color="black" />
              <Text style={[styles.socialButtonText, { color: 'black' }]}>Apple</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.replace('/(auth)/sign-up')}
            disabled={loading}
          >
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>By continuing, you agree to our</Text>
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => {}} disabled={loading}>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>•</Text>
            <TouchableOpacity onPress={() => {}} disabled={loading}>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    height: 44,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    height: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 44,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  googleButton: {
    backgroundColor: 'white',
  },
  appleButton: {
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#4f46e5',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  link: {
    color: '#4f46e5',
    textDecorationLine: 'underline',
  },
  emailButton: {
    marginTop: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '600',
  },
  dividerDot: {
    marginHorizontal: 8,
    color: '#666',
    fontSize: 12,
  },
});
