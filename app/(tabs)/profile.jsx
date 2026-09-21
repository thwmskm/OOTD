import { StyleSheet, View, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import useUserStore from "../../services/stores/userStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { useImagePicker } from "../hooks/useImagePicker";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../../constants/theme";
import { getUserStats } from "../../services/userStatsService";

//returns the [key, count] pair with the highest count in a count map, or null if empty
const getTopEntry = (counts) => {
  if (!counts) return null;
  const entries = Object.entries(counts);
  if (!entries.length) return null;
  return entries.reduce((top, entry) => (entry[1] > top[1] ? entry : top));
};

const Profile = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const resetUserStore = useUserStore((state) => state.resetUserStore);

  //userStats holds the fetched stats doc for the current user
  const [userStats, setUserStats] = useState(null);

  //FUNCTION TO FETCH USERSTATS FOR DISPLAY
  const fetchUserStats = async () => {
    try {
      if (!user?.uid) return;
      const stats = await getUserStats(user.uid);
      setUserStats(stats);
    } catch (error) {
      console.log("Error loading userStats:", error);
    }
  };

  //refetch stats whenever profile screen regains focus (e.g. after posting/editing)
  useFocusEffect(
    useCallback(() => {
      fetchUserStats();
    }, [user?.uid]),
  );

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

  const needsOOTD =
    user.dayState === "not_posted_today" || user.dayState === "streak_broken";

  //stat cards derived from userStats, in display order
  const topStyle = getTopEntry(userStats?.styleCounts);
  const topColour = getTopEntry(userStats?.colourCounts);
  const topBrand = getTopEntry(userStats?.brandCounts);

  const statRows = [
    [
      { label: "OOTDs Posted", value: userStats?.totalOOTDs ?? 0 },
      { label: "Clothing Items", value: userStats?.totalItems ?? 0 },
    ],
    [
      { label: "Top Style", value: topStyle ? topStyle[0] : "-" },
      { label: "Top Colour", value: topColour ? topColour[0] : "-" },
    ],
    [{ label: "Top Brand", value: topBrand ? topBrand[0] : "-" }],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userSect}>
          <View style={styles.pfpSect}>
            {user.pfp ? (
              <Image style={styles.pfp} source={{ uri: user.pfp }}></Image>
            ) : (
              <View style={styles.emptyPfp}>
                <FontAwesome5 name="user" size={18} color={colors.textMuted} />
              </View>
            )}
          </View>
          <View style={styles.idSect}>
            <AppText weight="bold" style={styles.username}>
              {user.username}
            </AppText>
            <Pressable onPress={handleEdit} hitSlop={8}>
              <FontAwesome5
                name="pencil-alt"
                size={14}
                color={colors.textMuted}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
            onPress={() => {
              router.push("/(screens)/(calendar)/CalendarView");
            }}
          >
            <FontAwesome5 name="calendar" size={16} color={colors.ink} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
            onPress={() => {
              router.push("/(settings)/settings");
            }}
          >
            <FontAwesome5 name="cog" size={16} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.streakSect}>
          <AppText weight="bold" style={styles.streakTitle}>
            Streak
          </AppText>
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <AppText weight="bold" style={styles.streakNumber}>
                {user.streak}
              </AppText>
              <AppText weight="medium" style={styles.streakLabel}>
                Current
              </AppText>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <AppText weight="bold" style={styles.streakNumber}>
                {user.MaxStreak}
              </AppText>
              <AppText weight="medium" style={styles.streakLabel}>
                Max
              </AppText>
            </View>
          </View>
        </View>

        {needsOOTD && (
          <View style={styles.noOOTD}>
            <AppText weight="regular" style={styles.noOOTDText}>
              You haven't posted a OOTD today.
            </AppText>
            <AppButton
              title="Post Now"
              onPress={handlePickImage}
              variant="primary"
              style={styles.postButton}
            />
          </View>
        )}

        <AppText weight="bold" style={styles.statHeader}>
          Style Stats
        </AppText>
        <View style={styles.statSect}>
          {statRows.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.statRow, rowIndex > 0 && styles.statRowDivider]}
            >
              {row.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <View style={styles.statDivider} />}
                  <View style={styles.statItem}>
                    <AppText
                      weight="bold"
                      style={styles.statValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.5}
                    >
                      {stat.value}
                    </AppText>
                    <AppText weight="medium" style={styles.statLabel}>
                      {stat.label}
                    </AppText>
                  </View>
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  userSect: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  pfpSect: {
    marginRight: spacing.sm,
  },
  pfp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  emptyPfp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  idSect: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  username: {
    fontSize: 18,
    color: colors.ink,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  streakSect: {
    borderRadius: radius.lg,
    backgroundColor: colors.sage,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  streakTitle: {
    fontSize: 12,
    color: colors.paper,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  statHeader: {
    fontSize: 12,
    color: colors.ink,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  statSect: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface,
    overflow: "hidden",
  },
  streakItem: {
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 32,
    color: colors.paper,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.paper,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.paper,
    opacity: 0.4,
  },
  noOOTD: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  noOOTDText: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
  },
  postButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  statRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.surface,
  },
  statValue: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    color: colors.ink,
  },
  statLabel: {
    fontSize: 11,
    color: colors.ink,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
