import { Text, StyleSheet, View, SafeAreaView, Button } from "react-native";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <Button
          title="Go to Login"
          onPress={() => router.push("(authentication)/login")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  div: {
    margin: "auto",
  },
  safeArea: {
    flex: 1,
  },
});
