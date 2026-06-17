import { Text, StyleSheet, View, SafeAreaView, Button } from "react-native";
import { useRouter } from "expo-router";
import useUserStore from "../../services/stores/userStore";
import { FontAwesome5 } from "@expo/vector-icons";

const Profile = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const resetUserStore = useUserStore((state) => state.resetUserStore);

  const handleEdit = () => {};

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
            router.push("/settings");
          }}
        />
      </View>

      <View style={styles.profileMeta}>
        <View style={styles.ootdTotal}>
          <Text>30</Text>
          <Text>OOTDs</Text>
        </View>
        <View style={styles.Followers}>
          <Text>24</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.Following}>
          <Text>14</Text>
          <Text>Following</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.streakSect}>
          <Text>Current: {user.streak}</Text>
          <Text>Max: {user.MaxStreak}</Text>
        </View>
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
    width: "20px",
    height: "20px",
    borderRadius: "15%",
    borderColor: "gray",
    borderWidth: 0.5,
    backgroundColor: "blue",
  },
  emptyPfp: {
    width: 50,
    height: 50,
    borderRadius: "50%",
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
  profileMeta: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  streakSect: {
    borderRadius: 20,
    width: "95%",
    height: "30%",
    alignItems: "center",
    backgroundColor: "lime",
    margin: 10,
  },
});
