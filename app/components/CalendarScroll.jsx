import React, { memo } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CalendarList } from "react-native-calendars";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CELL_SIZE = SCREEN_WIDTH / 7; // Divides the row evenly into 7 large square cells

// 1. Create a highly optimized Day Component
const CustomDay = memo(({ date, state, onPress }) => {
  // state can be 'disabled', 'today', or '' (blank)
  const isSelectedMonth = state !== "disabled";

  return (
    <TouchableOpacity
      style={[styles.dayCell, !isSelectedMonth && styles.disabledCell]}
      onPress={() => isSelectedMonth && onPress(date)}
      disabled={!isSelectedMonth}
    >
      {/* Container to push text to the bottom right */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.dayText,
            state === "today" && styles.todayText,
            !isSelectedMonth && styles.disabledText,
          ]}
        >
          {date.day}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const CalendarScroll = () => {
  return (
    <CalendarList
      // 1. Enable Horizontal & Sticky Scrolling
      horizontal={true}
      pagingEnabled={true} // Snaps to each month like a carousel page
      calendarWidth={SCREEN_WIDTH}
      style={{ width: SCREEN_WIDTH }}
      // 2. Control Memory Loading Bounds
      pastScrollRange={3} // Limit how far back a user can load (e.g., 3 months)
      futureScrollRange={6} // Limit how far forward a user can load (e.g., 6 months)
      // 3. Performance / Virtualization Tweaks
      removeClippedSubviews={true} // Unmounts off-screen months from memory
      maxToRenderPerBatch={1} // Renders one month at a time
      updateCellsBatchingPeriod={50}
      // Override default theme dimensions to support larger cells
      theme={{
        "stylesheet.calendar.main": {
          week: {
            marginTop: 0,
            marginBottom: 0,
            flexDirection: "row",
            justifyContent: "space-around",
          },
        },
      }}
      // Inject your custom day renderer
      dayComponent={({ date, state, onPress }) => (
        <CustomDay date={date} state={state} onPress={onPress} />
      )}
    />
  );
};

export default CalendarScroll;

// 3. Precise Layout Styles
const styles = StyleSheet.create({
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE, // Square proportions for extra space
    borderWidth: 0.5,
    borderColor: "#e1e1e1", // Optional grid look
    backgroundColor: "#ffffff",
  },
  disabledCell: {
    backgroundColor: "#f9f9f9",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end", // Pushes content to the bottom
    alignItems: "flex-end", // Pushes content to the right
    paddingRight: 6, // Keeps it safe from the edge
    paddingBottom: 6,
  },
  dayText: {
    fontSize: 11, // Much smaller font size
    color: "#2d4150",
    fontWeight: "500",
  },
  todayText: {
    color: "#00adf5",
    fontWeight: "bold",
  },
  disabledText: {
    color: "#d9e1e8",
  },
});
