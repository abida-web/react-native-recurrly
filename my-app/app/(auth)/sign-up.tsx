import { useAuth, useSignUp } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, TextInput, View, ScrollView, ActivityIndicator, Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView)

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/(tabs)')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url as Href)
          }
        },
      })
    } else {
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView className="auth-safe-area">
        <ScrollView className="auth-scroll" contentContainerClassName="auth-content">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">S</Text>
              </View>
              <View>
                <Text className="auth-wordmark">SubTrack</Text>
                <Text className="auth-wordmark-sub">Manage your subscriptions</Text>
              </View>
            </View>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <Text className="auth-title">Verify your account</Text>
              <Text className="auth-subtitle">
                Enter the verification code sent to your email
              </Text>

              <View className="auth-field">
                <Text className="auth-label">Verification code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  placeholder="Enter code"
                  placeholderTextColor="#666666"
                  onChangeText={(code) => setCode(code)}
                  keyboardType="numeric"
                  className="auth-input"
                />
                {errors.fields.code && (
                  <Text className="auth-error">{errors.fields.code.message}</Text>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  fetchStatus === 'fetching' && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleVerify}
                disabled={fetchStatus === 'fetching'}
                className="auth-button"
              >
                {fetchStatus === 'fetching' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="auth-button-text">Verify</Text>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
                onPress={() => signUp.verifications.sendEmailCode()}
                className="auth-secondary-button"
              >
                <Text className="auth-secondary-button-text">Resend code</Text>
              </Pressable>
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text className="auth-link">Sign in</Text>
              </Pressable>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView className="auth-scroll" contentContainerClassName="auth-content">
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">S</Text>
            </View>
            <View>
              <Text className="auth-wordmark">SubTrack</Text>
              <Text className="auth-wordmark-sub">Manage your subscriptions</Text>
            </View>
          </View>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            <Text className="auth-title">Create account</Text>
            <Text className="auth-subtitle">
              Start tracking your subscriptions today
            </Text>

            <View className="auth-field">
              <Text className="auth-label">Email address</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                placeholderTextColor="#666666"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                keyboardType="email-address"
                className="auth-input"
              />
              {errors.fields.emailAddress && (
                <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
              )}
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Create password"
                placeholderTextColor="#666666"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                className="auth-input"
              />
              {errors.fields.password && (
                <Text className="auth-error">{errors.fields.password.message}</Text>
              )}
              <Text className="auth-helper">
                Must be at least 8 characters
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
              disabled={!emailAddress || !password || fetchStatus === 'fetching'}
              className="auth-button"
            >
              {fetchStatus === 'fetching' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="auth-button-text">Create account</Text>
              )}
            </Pressable>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">or continue with</Text>
              <View className="auth-divider-line" />
            </View>

            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              className="auth-secondary-button"
            >
              <Text className="auth-secondary-button-text">Google</Text>
            </Pressable>
          </View>
        </View>

        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text className="auth-link">Sign in</Text>
            </Pressable>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    alignItems: 'center',
  },
})