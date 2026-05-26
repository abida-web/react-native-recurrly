import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
import { useEffect } from "react";
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
SplashScreen._internal_preventAutoHideAsync()
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    PlusJakartaSans_700Bold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSans_800ExtraBold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    PlusJakartaSans_600SemiBold: require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    PlusJakartaSans_500Medium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSans_300Light: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });
 useEffect(()=>{
   if(fontsLoaded){
    SplashScreen.hideAsync()
   }
 },[fontsLoaded]  )
 if(!fontsLoaded){
  return null
 }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
