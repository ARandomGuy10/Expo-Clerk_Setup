import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { isLoaded, setActive, signUp } = useSignUp();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Handle resend countdown
  useEffect(() => {
    if (!resendDisabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendDisabled]);

  const onVerifyPress = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (!isLoaded) return;

    try {
      setLoading(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(app)');
    } catch (err) {
      console.error('Verification error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!isLoaded) return;
    
    try {
      setResendDisabled(true);
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      Alert.alert('Success', 'Verification code resent!');
    } catch (err) {
      console.error('Resend error:', err);
      Alert.alert('Error', 'Failed to resend verification code');
      setResendDisabled(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to {email || 'your email'}. Please enter it below.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Enter verification code"
            keyboardType="number-pad"
            autoFocus
            maxLength={6}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onVerifyPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a code? </Text>
          <TouchableOpacity 
            onPress={onResendCode}
            disabled={resendDisabled}
          >
            <Text style={[styles.resendLink, resendDisabled && styles.resendLinkDisabled]}>
              {resendDisabled ? `Resend in ${countdown}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  resendLinkDisabled: {
    color: '#999',
  },
});
