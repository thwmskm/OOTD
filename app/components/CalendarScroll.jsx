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
const CELL_SIZE = SCREEN_WIDTH / 7;

const CustomDay = memo(({ date, state, marking, onPress }) => {
  const isSelectedMonth = state !== "disabled";
  const isMarked = marking?.marked ?? false;

  return (
    <TouchableOpacity
      style={[styles.dayCell, !isSelectedMonth && styles.disabledCell]}
      onPress={() => isSelectedMonth && onPress(date)}
      disabled={!isSelectedMonth}
    >
      {isMarked && isSelectedMonth && <Text style={styles.mark}>*</Text>}
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

const CalendarScroll = ({ markedDates = {}, onDayPress, onMonthChange }) => {
  return (
    <CalendarList
      horizontal={true}
      pagingEnabled={true}
      calendarWidth={SCREEN_WIDTH}
      style={{ width: SCREEN_WIDTH }}
      pastScrollRange={3}
      futureScrollRange={6}
      removeClippedSubviews={true}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={50}
      markedDates={markedDates}
      onVisibleMonthsChange={(months) => {
        if (onMonthChange && months[0]) onMonthChange(months[0]);
      }}
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
      dayComponent={({ date, state, marking }) => (
        <CustomDay
          date={date}
          state={state}
          marking={marking}
          onPress={onDayPress ?? (() => {})}
        />
      )}
    />
  );
};

export default CalendarScroll;

const styles = StyleSheet.create({
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: "#e1e1e1",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  disabledCell: {
    backgroundColor: "#f9f9f9",
  },
  mark: {
    width: 10,
    height: 10,
    borderRadius: 3,
    position: "absolute",
    top: 6,
    alignSelf: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 6,
    paddingBottom: 6,
  },
  dayText: {
    fontSize: 11,
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
