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
import { getUser } from "../../../services/userService";
import useUserStore from "../../../services/stores/userStore";
import { useEffect, useState } from "react";

//information on profile like date created, username, , provider, email, potentially password change
const info = () => {
  const user = useUserStore((state) => state.user);
  const [dateCreated, setDateCreated] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userData = await getUser(user.uid);
        setProvider(userData.provider);
        const formattedDate = userData.createdAt
          ?.toDate()
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        setDateCreated(formattedDate);
      } catch (error) {
        console.log("Error fetching user info!", error);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = async () => {};

  return (
    <>
      <Text>Username: {user.username}</Text>
      <Text>Provider: {provider}</Text>
      <Text>email: {user.email}</Text>
      <Button title="Change Password" onPress={handlePasswordChange}></Button>
      <Text>date joined: {dateCreated}</Text>
    </>
  );
};

export default info;
