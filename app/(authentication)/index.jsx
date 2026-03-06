import { Text, StyleSheet, View, Pressable, Button } from "react-native";
import { useRouter } from "expo-router";

const StartScreen = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Welcome to OOTD!</Text>
      <Button
        title="to register"
        onPress={() => router.push("/register")}
      ></Button>
      <Text>Already have an account?</Text>
      <Pressable onPress={() => router.push("/login")}>
        <Text>Log in</Text>
      </Pressable>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({});
