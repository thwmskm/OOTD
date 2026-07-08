import { Text, StyleSheet, View, SafeAreaView } from "react-native";

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
