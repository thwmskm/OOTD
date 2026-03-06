import { Text, StyleSheet, View, SafeAreaView, Button } from "react-native";

//Index.jsx is used as an user authenticator at launch to route user to either login or home screen
const Index = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <Text>This is the home(index) screen!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  div: {
    margin: "auto",
  },
  safeArea: {
    flex: 1,
  },
});
