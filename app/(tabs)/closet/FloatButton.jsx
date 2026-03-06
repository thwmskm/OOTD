import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  Button,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";

const FloatButton = ({ onCreate }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {isActive && (
        <Pressable
          style={[styles.mask, { width: "100%", height: "100%" }]}
          onPress={() => setIsActive(false)}
        />
      )}
      <View style={styles.main}>
        {isActive ? (
          <View style={styles.menu}>
            <Pressable
              style={styles.addBtn}
              onPress={() => {
                onCreate("clothing");
              }}
            >
              <Text>Create Clothing</Text>
            </Pressable>
            <Pressable
              style={styles.addBtn}
              onPress={() => {
                onCreate("outfit");
              }}
            >
              <Text>Create Outfit</Text>
            </Pressable>
          </View>
        ) : null}
        <Pressable
          onPress={() => {
            setIsActive(!isActive);
          }}
          style={styles.circle}
        >
          <FontAwesome5 name="plus" size={24} style={styles.icon} />
        </Pressable>
      </View>
    </>
  );
};

export default FloatButton;

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 100,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "blue",
    zIndex: 999,
    alignSelf: "flex-end",
  },
  menu: {
    position: "absolute",
    bottom: 60,
    width: 150,
    paddingRight: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 20,
    zIndex: 20,
  },
  mask: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  icon: {
    margin: "auto",
    color: "white",
  },
});
