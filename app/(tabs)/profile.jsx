import { Text, StyleSheet, View, SafeAreaView, Button } from "react-native";
import { useRouter } from "expo-router";
import { FB_auth } from "../../database/firebase";
import useOOTDStore from "../../services/stores/ootdStore";

const Profile = () => {
  const router = useRouter();
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  //temp log out for testing
  const handleLogout = async () => {
    resetOotdStore();
    await FB_auth.signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <Button
          title="Go to Login"
          onPress={() => router.push("(authentication)/login")}
        />
        <Button title="Log Out" onPress={handleLogout} color="red" />
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
