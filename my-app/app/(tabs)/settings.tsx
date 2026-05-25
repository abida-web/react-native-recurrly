import { View, Text, Pressable, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useUser, useClerk } from '@clerk/expo';
import { useRouter } from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-5">
        <View className="mb-6">
          <Text className="text-3xl font-sans-extrabold text-primary mb-2">Settings</Text>
          <Text className="text-base font-sans-medium text-muted-foreground">
            Manage your account preferences
          </Text>
        </View>

        <View className="mb-6">
          <View className="auth-card">
            <View className="flex-row items-center gap-4">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="size-16 rounded-full"
                />
              ) : (
                <View className="size-16 rounded-full bg-accent items-center justify-center">
                  <Text className="text-2xl font-sans-extrabold text-background">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U'}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-lg font-sans-bold text-primary">
                  {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                </Text>
                <Text className="text-sm font-sans-medium text-muted-foreground">
                  {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            <Text className="text-lg font-sans-bold text-primary mb-4">Account</Text>

            <Pressable
              className="flex-row items-center justify-between py-4 border-b border-border"
            >
              <View>
                <Text className="text-base font-sans-semibold text-primary">Email</Text>
                <Text className="text-sm font-sans-medium text-muted-foreground mt-1">
                  {user?.emailAddresses?.[0]?.emailAddress || 'Not set'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              className="flex-row items-center justify-between py-4 border-b border-border"
            >
              <View>
                <Text className="text-base font-sans-semibold text-primary">Name</Text>
                <Text className="text-sm font-sans-medium text-muted-foreground mt-1">
                  {user?.fullName || 'Not set'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              className="flex-row items-center justify-between py-4"
            >
              <View>
                <Text className="text-base font-sans-semibold text-primary">Member since</Text>
                <Text className="text-sm font-sans-medium text-muted-foreground mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View className="mt-6">
          <Pressable
            onPress={handleSignOut}
            className="auth-button"
          >
            <Text className="auth-button-text">Sign out</Text>
          </Pressable>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-sm font-sans-medium text-muted-foreground">
            SubTrack v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
