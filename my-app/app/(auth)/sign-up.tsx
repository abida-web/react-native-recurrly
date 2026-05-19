import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SignUp = () => {
  return (
    <View>
      <Text>Sign Up</Text>
      <Link href={"/(auth)/sign-up"}>Sign Up</Link>
    </View>
  );
};

export default SignUp;
