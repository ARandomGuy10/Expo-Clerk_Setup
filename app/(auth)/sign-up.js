import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator } from 'react-native';
import { useOAuth, useSignUp, useAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export default function SignUpScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

  const onSelectAuth = async (strategy) => {
    const selectedAuth = {
      google: googleAuth,
      apple: appleAuth,
    }[strategy];

    try {
      const { createdSessionId } = await selectedAuth();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigate to the home tab after successful OAuth sign up
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('OAuth error:', err);
      Alert.alert('Error', 'Failed to sign in with ' + strategy);
    }
  };

  const onSignUpPress = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      // Navigate to verification screen
      router.push({
        pathname: '/verify-email',
        params: { email },
      });
    } catch (err) {
      console.error('Sign up error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign up');
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
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Sign up to get started with Pocketrackr</Text>
        
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
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>Use 8 or more characters</Text>
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.emailButton, loading && styles.buttonDisabled]}
            onPress={onSignUpPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating account...' : 'Create account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => onSelectAuth('google')}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.icon} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => onSelectAuth('apple')}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={20} color="#000" style={styles.icon} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.replace('/(auth)/sign-in')}
            disabled={loading}
          >
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
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
  helperText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
    fontFamily: 'Inter-Regular',
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
  emailButton: {
    backgroundColor: '#4f46e5',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
    backgroundColor: 'white',
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#111827',
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
  icon: {
    marginRight: 8,
  },
});
