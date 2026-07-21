import {
  Text,
  StyleSheet,
  View,
  Image,
  Button,
  Pressable,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import useUserStore from "../../services/stores/userStore";
import { useImagePicker } from "../hooks/useImagePicker";
import PfpCropper from "../components/PfpCropper";
import { storePfp } from "../../services/Storage";
import { updateUser } from "../../services/userService";

const EditProfile = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [rawUri, setRawUri] = useState(null); // freshly picked, awaiting crop
  const [saving, setSaving] = useState(false);

  //handle changing pfp
  const { pickImage } = useImagePicker();
  const handlePickImage = () => {
    pickImage((uri) => setRawUri(uri));
  };

  //After crop is confirmed: upload to storage, persist to Firestore, sync store
  const handleCropComplete = async (croppedUri) => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const downloadUrl = await storePfp(croppedUri, user.uid);
      await updateUser(user.uid, { pfp: downloadUrl });
      setUser("pfp", downloadUrl);
    } catch (error) {
      console.error("Error while saving new pfp", error);
    } finally {
      setSaving(false);
      setRawUri(null);
    }
  };

  return (
    <View>
      <View style={styles.topSect}>
        {user.pfp ? (
          <Image style={styles.pfp} source={{ uri: user.pfp }}></Image>
        ) : (
          <View style={styles.emptyPfp}></View>
        )}
        <Button
          title={saving ? "Saving..." : "Change Picture"}
          onPress={handlePickImage}
          disabled={saving}
        ></Button>
      </View>

      <View style={styles.bottomSect}>
        <Text style={styles.label}>Username</Text>
        <Pressable onPress={() => router.push("/ChangeUsername")}>
          <Text style={styles.username}>{user.username}</Text>
        </Pressable>
      </View>

      <Modal visible={!!rawUri} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {rawUri && (
            <PfpCropper
              imageUri={rawUri}
              onCancel={() => setRawUri(null)}
              onCropComplete={handleCropComplete}
              saving={saving}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  topSect: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  bottomSect: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  pfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    backgroundColor: "blue",
  },
  emptyPfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    backgroundColor: "gray",
  },
  label: {
    marginLeft: 5,
    marginBottom: 3,
    fontSize: 12,
    color: "gray",
  },
  username: {
    fontSize: 16,
    padding: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
});
