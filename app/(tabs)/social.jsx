import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/AppText";
import { colors } from "../../constants/theme";

const Social = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <AppText weight="bold" style={styles.comingSoon}>
          COMING SOON!
        </AppText>
      </View>
    </SafeAreaView>
  );
};

export default Social;

const styles = StyleSheet.create({
  div: {
    margin: "auto",
  },
  comingSoon: {
    fontSize: 20,
    color: colors.sage,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
