import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Social = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <Text>COMING SOON!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Social;

const styles = StyleSheet.create({
  div: {
    margin: "auto",
  },
  safeArea: {
    flex: 1,
  },
});
