// app/(tabs)/closet/FloatButton.jsx
import { StyleSheet, View, Pressable } from "react-native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";

const FloatButton = ({ onCreate }) => {
  const [isActive, setIsActive] = useState(false);

  const handleCreate = (type) => {
    setIsActive(false);
    onCreate(type);
  };

  return (
    <>
      {isActive && (
        <Pressable style={styles.mask} onPress={() => setIsActive(false)} />
      )}
      <View style={styles.main}>
        {isActive ? (
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleCreate("outfit")}
            >
              <AppText weight="medium" style={styles.menuItemText}>
                Create outfit
              </AppText>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleCreate("clothing")}
            >
              <AppText weight="medium" style={styles.menuItemText}>
                Add clothing
              </AppText>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={() => setIsActive((prev) => !prev)}
          style={({ pressed }) => [
            styles.circle,
            pressed && styles.circlePressed,
          ]}
        >
          <FontAwesome5
            name={isActive ? "times" : "plus"}
            size={20}
            color={colors.paper}
          />
        </Pressable>
      </View>
    </>
  );
};

export default FloatButton;

const CIRCLE_SIZE = 56;

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 180,
    zIndex: 20,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    zIndex: 999,
    // soft shadow so it reads as floating above the grid
    shadowColor: colors.ink,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  circlePressed: {
    opacity: 0.85,
  },
  menu: {
    marginBottom: spacing.md,
    gap: spacing.sm,
    alignItems: "flex-end",
  },
  menuItem: {
    minWidth: 160,
    alignItems: "center",
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.ink,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});
