import {
  StyleSheet,
  View,
  Pressable,
  Text,
  FlatList,
  Image,
} from "react-native";

const GridView = ({ items, onItemPress, selectedIds = [] }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.cid}
      contentContainerStyle={styles.list}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onItemPress(item)}
          style={selectedIds.includes(item.cid) ? styles.selected : null}
        >
          <Image
            source={{
              uri: item.imageUrl,
            }}
            style={styles.image}
          />
        </Pressable>
      )}
    />
  );
};

export default GridView;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  list: {
    justifyContent: "left",
    paddingBottom: 40,
  },
  selected: {
    opacity: 0.3,
    borderWidth: 2,
    borderColor: "blue",
  },
});
