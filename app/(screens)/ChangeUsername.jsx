import {
  Text,
  StyleSheet,
  View,
  Image,
  Button,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import useUserStore from "../../services/stores/userStore";
import { updateUser } from "../../services/userService";
import { FontAwesome5 } from "@expo/vector-icons";

const ChangeUsername = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const USERNAME_REGEX = /^[A-Za-z0-9]+$/;

  const [newUsername, setNewUsername] = useState("");

  //save newUsername and check for validation first
  const handleSave = async () => {
    const trimmed = newUsername.trim();

    // empty check
    if (!trimmed) {
      Alert.alert("Username cannot be empty");
      return;
    }

    // length check
    if (trimmed.length < 3 || trimmed.length > 16) {
      Alert.alert("Username must be between 3 and 16 characters");
      return;
    }

    // alphanumeric only, no spaces/punctuation
    if (!USERNAME_REGEX.test(trimmed)) {
      Alert.alert("Username can only contain letters and numbers");
      return;
    }

    // no-op if unchanged
    if (trimmed === user.username) {
      return;
    }

    try {
      await updateUser(user.uid, { username: trimmed });
      setUser("username", trimmed);
      router.back();
    } catch (error) {
      console.error("Error while saving username:", error);
      throw error;
    }
  };

  return (
    <>
      <View style={styles.header}>
        <FontAwesome5
          size={20}
          name="check"
          color="blue"
          style={styles.check}
          onPress={handleSave}
        />
      </View>
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={setNewUsername}
          placeholder={user.username}
          autoCapitalize="none"
        ></TextInput>
        <Text style={styles.textWarning}>
          You can only make a change in your username every 14 days.
        </Text>
      </View>
    </>
  );
};

export default ChangeUsername;

const styles = StyleSheet.create({
  body: {
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
    paddingRight: 10,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
  },
  textWarning: {
    marginTop: 10,
    fontSize: 12,
    color: "gray",
  },
});
