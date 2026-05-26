import { useSignIn } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, TextInput, View, ScrollView, ActivityIndicator, Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView)

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
    } else if (signIn.status === 'needs_second_factor') {
      // Handle 2FA if needed
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      )

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  if (signIn.status === 'needs_client_trust') {
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
                onPress={() => signIn.mfa.sendEmailCode()}
                className="auth-secondary-button"
              >
                <Text className="auth-secondary-button-text">Resend code</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
                onPress={() => signIn.reset()}
                className="auth-secondary-button"
              >
                <Text className="auth-secondary-button-text">Start over</Text>
              </Pressable>
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text className="auth-link">Sign up</Text>
              </Pressable>
            </Link>
          </View>
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
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to continue tracking your subscriptions
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
              {errors.fields.identifier && (
                <Text className="auth-error">{errors.fields.identifier.message}</Text>
              )}
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Enter password"
                placeholderTextColor="#666666"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                className="auth-input"
              />
              {errors.fields.password && (
                <Text className="auth-error">{errors.fields.password.message}</Text>
              )}
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
                <Text className="auth-button-text">Sign in</Text>
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
          <Text className="auth-link-copy">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text className="auth-link">Sign up</Text>
            </Pressable>
          </Link>
        </View>
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