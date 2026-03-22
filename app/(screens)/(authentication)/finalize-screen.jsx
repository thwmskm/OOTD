import { Text, StyleSheet, View, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FB_auth } from "../../../database/firebase";
import { useState } from "react";
import { createUser } from "../../../services/userService";

const FinalizeScreen = () => {
  const router = useRouter();
  const { username, pfp } = useLocalSearchParams();

  //Create new User and save to db. Then, continue to homepage.
  const CreateAndContinue = async () => {
    const userId = FB_auth.currentUser.uid;

    //Obtain and store pfp in firebase storage
    const downloadUrl = storePfp(pfp, userId);

    //Create new user instance
    const newUser = {
      uid: userId,
      email: FB_auth.currentUser.email,
      username: username,
      provider: "email",
      pfp: downloadUrl,
      createdAt: new Date(),
    };

    console.log(newUser);

    try {
      await createUser(newUser);
    } catch (error) {
      console.error("Firestore write failed:", error.code, error.message);
    }
    router.replace("/(tabs)");
  };

  return (
    <View>
      <Text>You are all set up {username}!</Text>
      <Button title="to calender" onPress={CreateAndContinue}>
        <Text>Continue</Text>
      </Button>
    </View>
  );
};

export default FinalizeScreen;

const styles = StyleSheet.create({});
