import { Text, StyleSheet, View, Button, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FB_auth } from "../../database/firebase";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(FB_auth, email, password);
      router.replace("/username");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <Text>Email:</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      ></TextInput>
      <Text>Password:</Text>
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      ></TextInput>
      <Button title="Sign up" onPress={signUp}></Button>
    </View>
  );
}

const styles = StyleSheet.create({});
