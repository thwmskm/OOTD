import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import useUserStore from "../../services/stores/userStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { useImagePicker } from "../hooks/useImagePicker";

const Profile = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const resetUserStore = useUserStore((state) => state.resetUserStore);

  //handle profile edit
  const handleEdit = () => {
    router.push("/EditProfile");
  };

  //handle posting ootd now
  const { pickImage } = useImagePicker();
  const handlePickImage = () => {
    pickImage((uri) => {
      router.push({
        pathname: "/EditOOTD",
        params: {
          imageUrl: uri,
        },
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userSect}>
          <View style={styles.pfpSect}>
            {user.pfp ? (
              <Image style={styles.pfp} source={{ uri: user.pfp }}></Image>
            ) : (
              <View style={styles.emptyPfp}></View>
            )}
          </View>
          <View style={styles.idSect}>
            <Text style={styles.username}>{user.username}</Text>
            <FontAwesome5
              name="pencil-alt"
              size={15}
              color="gray"
              onPress={handleEdit}
            />
          </View>
        </View>

        <FontAwesome5
          name="calendar"
          size={24}
          onPress={() => {
            router.push("/(calendar)/CalendarView");
          }}
        />
        <FontAwesome5
          name="cog"
          size={24}
          onPress={() => {
            router.push("/(settings)/settings");
          }}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.streakSect}>
          <Text>Current: {user.streak}</Text>
          <Text>Max: {user.MaxStreak}</Text>
        </View>
        {(user.dayState === "not_posted_today" && (
          <View style={styles.noOOTD}>
            <Text>you haven't posted a OOTD today.</Text>
            <Button title="Post Now" onPress={handlePickImage}></Button>
          </View>
        )) ||
          (user.dayState === "streak_broken" && (
            <View style={styles.noOOTD}>
              <Text>you haven't posted a OOTD today.</Text>
              <Button title="Post Now" onPress={handlePickImage}></Button>
            </View>
          ))}
        <View style={styles.statSect}></View>
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
  header: {
    height: "15%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  userSect: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  pfp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "gray",
    borderWidth: 0.5,
    backgroundColor: "blue",
  },
  emptyPfp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "gray",
    borderWidth: 0.5,
    backgroundColor: "gray",
  },
  idSect: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  streakSect: {
    borderRadius: 20,
    width: "95%",
    height: "30%",
    alignItems: "center",
    backgroundColor: "lime",
    margin: 10,
  },
  noOOTD: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  statSect: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
