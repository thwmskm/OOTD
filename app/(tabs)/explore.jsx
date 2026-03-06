import { Text, StyleSheet, View, SafeAreaView } from "react-native";

const Explore = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <Text>This is the explore screen!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  div: {
    margin: "auto",
  },
  safeArea: {
    flex: 1,
  },
});
