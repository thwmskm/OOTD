import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  TextInput,
  View,
  Image,
  Text,
  Button,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import EditClothing from "./EditClothing";
import EditOutfit from "./EditOutfit";

const EditItem = () => {
  const router = useRouter();
  //when editing existing clothing, must identify clothing with cid
  const { imageUrl, cid, oid, type } = useLocalSearchParams();

  if (type === "clothing") {
    return <EditClothing cid={cid} imageUrl={imageUrl}></EditClothing>;
  } else {
    return <EditOutfit oid={oid} imageUrl={imageUrl}></EditOutfit>;
  }
};

export default EditItem;

const styles = StyleSheet.create({});
