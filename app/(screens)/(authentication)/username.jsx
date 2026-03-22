import { Text, StyleSheet, View, Button, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { FB_auth } from "../../../database/firebase";
import { useState } from "react";

const Username = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const user = FB_auth.currentUser;

  const saveUsername = () => {
    console.log("username page: ", username);
    router.push({
      pathname: "/pfp",
      params: { username: username },
    });
  };

  return (
    <View>
      <Text>Type your Display Name</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter display name."
      ></TextInput>
      <Button title="to pfp" onPress={saveUsername}>
        <Text>Ok</Text>
      </Button>
    </View>
  );
};

export default Username;

const styles = StyleSheet.create({});
