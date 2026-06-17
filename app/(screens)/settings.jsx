import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { FB_auth } from "../../database/firebase";
import useOOTDStore from "../../services/stores/ootdStore";
import useUserStore from "../../services/stores/userStore";

const Settings = () => {
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);
  const resetUserStore = useUserStore((state) => state.resetUserStore);

  //logout
  const handleLogout = async () => {
    Alert.alert("Logging out?", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          resetOotdStore();
          resetUserStore();
          await FB_auth.signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.body}>
      <View style={styles.sections}>
        <Text style={styles.label}>Account</Text>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Info</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Privacy</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>My Saves</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={[styles.settingName, styles.danger]}>
            Delete Account
          </Text>
        </Pressable>
        <Pressable style={styles.setting} onPress={handleLogout}>
          <Text style={[styles.settingName, styles.danger]}>Logout</Text>
        </Pressable>
      </View>
      <View style={styles.sections}>
        <Text style={styles.label}>Preferences</Text>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Turn off Likes/Saves</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Notifications</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Language</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Temperature Unit</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Currency</Text>
        </Pressable>
      </View>
      <View style={styles.sections}>
        <Text style={styles.label}>YU*YL Customer Services</Text>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>FAQ</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Feedback</Text>
        </Pressable>
      </View>
      <View style={styles.sections}>
        <Text style={styles.label}>Terms of Service</Text>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Service Terms</Text>
        </Pressable>
        <Pressable style={styles.setting}>
          <Text style={styles.settingName}>Privacy Service</Text>
        </Pressable>
      </View>
      <View style={styles.footer}></View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  body: {
    backgroundColor: "lightgray",
    height: "100%",
    paddingBottom: 50,
  },
  sections: {
    margin: 15,
    borderRadius: "3%",
    backgroundColor: "white",
    padding: 10,
  },
  label: {
    color: "gray",
    fontSize: 10,
    borderBottomWidth: 0.5,
  },
  setting: {
    borderBottomWidth: 0.5,
    height: 40,
    justifyContent: "center",
  },
  settingName: {
    fontSize: 15,
  },
  danger: {
    color: "red",
  },
  footer: {
    height: 100,
  },
});
