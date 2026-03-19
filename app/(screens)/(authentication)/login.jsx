import {
  Text,
  StyleSheet,
  View,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FB_auth } from "../../database/firebase";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!FB_auth) {
    console.log("Firebase Auth not initialized.");
  }

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(FB_auth, email, password);
      router.push("/(tabs)");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
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
      <Pressable title="Login" onPress={signIn}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
