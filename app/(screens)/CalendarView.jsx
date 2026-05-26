import CalendarScroll from "../components/CalendarScroll";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  TextInput,
} from "react-native";

const CalendarView = () => {
  return (
    <View>
      <CalendarScroll></CalendarScroll>
    </View>
  );
};

export default CalendarView;
