import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
const SafeAreaView = styled(RNSafeAreaView);    
const subscriptions = () => {
  return (
    <SafeAreaView>
      <Text>subscriptions</Text>
    </SafeAreaView>
  );
};

export default subscriptions;
