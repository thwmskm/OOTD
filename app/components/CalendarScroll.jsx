import React, { memo } from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { CalendarList } from "react-native-calendars";
import AppText from "./AppText";
import { colors, spacing, typography } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CELL_SIZE = SCREEN_WIDTH / 7;

const CustomDay = memo(({ date, state, marking, onPress }) => {
  const isSelectedMonth = state !== "disabled";
  const isMarked = marking?.marked ?? false;
  const isToday = state === "today";

  return (
    <TouchableOpacity
      style={[styles.dayCell, !isSelectedMonth && styles.disabledCell]}
      onPress={() => isSelectedMonth && onPress(date)}
      disabled={!isSelectedMonth}
    >
      {isMarked && isSelectedMonth && (
        <AppText weight="bold" style={styles.mark}>
          *
        </AppText>
      )}
      <View style={styles.textContainer}>
        <AppText
          weight={isToday ? "bold" : "regular"}
          style={[
            styles.dayText,
            isToday && styles.todayText,
            !isSelectedMonth && styles.disabledText,
          ]}
        >
          {date.day}
        </AppText>
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
        backgroundColor: colors.paper,
        calendarBackground: colors.paper,
        textSectionTitleColor: colors.textMuted,
        monthTextColor: colors.ink,
        arrowColor: colors.ink,
        textMonthFontFamily: typography.bold,
        textDayHeaderFontFamily: typography.medium,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 12,
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
    borderColor: colors.line,
    backgroundColor: colors.paper,
    overflow: "hidden",
  },
  disabledCell: {
    backgroundColor: colors.surface,
  },
  mark: {
    fontSize: 14,
    color: colors.sage,
    position: "absolute",
    top: 4,
    alignSelf: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: spacing.xs,
    paddingBottom: spacing.xs,
  },
  dayText: {
    fontSize: 11,
    color: colors.ink,
  },
  todayText: {
    color: colors.blush,
  },
  disabledText: {
    color: colors.line,
  },
});
