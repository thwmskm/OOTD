import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const EditOOTD = () => {
  const router = useRouter();
  const { imageUrl } = useLocalSearchParams();

  const handleBack = () => {
    router.back();
  };

  return (
    <View>
      <FontAwesome5
        name="arrow-left"
        size={24}
        color="black"
        onPress={handleBack}
      ></FontAwesome5>
      <Image style={styles.image} source={{ uri: imageUrl }}></Image>
      <TextInput style={styles.textBox}></TextInput>
    </View>
  );
};

export default EditOOTD;

const styles = StyleSheet.create({});
