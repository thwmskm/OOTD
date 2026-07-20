// app/components/PfpCropper.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image as RNImage,
  Pressable,
  Text,
} from "react-native";
import { captureRef } from "react-native-view-shot";

//Reusable circular crop UI. Pass an image uri, get back a cropped uri via onCropComplete.
//Static center-crop for now — no drag/zoom.
//`saving` is controlled by the parent to reflect the full upload round trip (not just local capture),
//so Save/Cancel stay locked for the entire operation and can't be re-triggered mid-flight.
const PfpCropper = ({
  imageUri,
  onCancel,
  onCropComplete,
  size = 280,
  saving = false,
}) => {
  const frameRef = useRef(null);
  const [imgDims, setImgDims] = useState(null);
  const [capturing, setCapturing] = useState(false); // local: just the captureRef step

  const busy = capturing || saving;

  //Get natural dimensions so we know how to "cover" the circular frame
  useEffect(() => {
    if (!imageUri) return;
    RNImage.getSize(
      imageUri,
      (w, h) => setImgDims({ width: w, height: h }),
      (err) => console.error("Error reading image size", err),
    );
  }, [imageUri]);

  const handleSave = async () => {
    if (!frameRef.current || busy) return; // guard against re-entry / spam-tap
    setCapturing(true);
    try {
      const uri = await captureRef(frameRef, {
        format: "jpg",
        quality: 0.9,
        result: "tmpfile",
      });
      onCropComplete(uri);
      // don't reset capturing here on success — parent's `saving` takes over
      // and keeps the button disabled through the upload/write step
    } catch (error) {
      console.error("Error while capturing cropped pfp", error);
      setCapturing(false); // only reset on failure, so the user can retry
    }
  };

  const handleCancel = () => {
    if (busy) return; // prevent dismiss mid-upload
    onCancel();
  };

  if (!imgDims) return null;

  //cover-fit: scale so the shorter dimension fills the frame, centered
  const scale = size / Math.min(imgDims.width, imgDims.height);
  const displayW = imgDims.width * scale;
  const displayH = imgDims.height * scale;

  return (
    <View style={styles.container}>
      <View
        ref={frameRef}
        collapsable={false}
        style={[
          styles.frame,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <RNImage
          source={{ uri: imageUri }}
          style={{
            width: displayW,
            height: displayH,
            marginLeft: -(displayW - size) / 2,
            marginTop: -(displayH - size) / 2,
          }}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleCancel}
          style={styles.actionBtn}
          disabled={busy}
        >
          <Text style={styles.actionText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          style={styles.actionBtn}
          disabled={busy}
        >
          <Text style={styles.actionText}>{busy ? "Saving..." : "Save"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PfpCropper;

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  frame: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0ece4",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: 20, marginTop: 20 },
  actionBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#f0ece4",
  },
  actionText: {
    color: "#f0ece4",
  },
});
