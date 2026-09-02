// app/components/GridView.jsx
import { StyleSheet, View, Pressable, FlatList, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing, radius } from "../../constants/theme";

const GRID_GAP = spacing.xs + 2;

const GridView = ({ items, onItemPress, selectedIds = [] }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.cid ?? item.oid ?? item.id}
      numColumns={3}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => {
        const itemId = item.cid ?? item.oid ?? item.id;
        const isSelected = selectedIds.includes(itemId);

        return (
          <Pressable onPress={() => onItemPress(item)} style={styles.cell}>
            <View
              style={[styles.imageWrap, isSelected && styles.imageWrapSelected]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              {isSelected && (
                <View style={styles.checkBadge}>
                  <FontAwesome5 name="check" size={10} color={colors.paper} />
                </View>
              )}
            </View>
          </Pressable>
        );
      }}
    />
  );
};

export default GridView;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100, // clears the FloatButton
    gap: GRID_GAP,
  },
  row: {
    gap: GRID_GAP,
  },
  cell: {
    flex: 1 / 3,
  },
  imageWrap: {
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
    position: "relative",
  },
  imageWrapSelected: {
    borderWidth: 2,
    borderColor: colors.sage,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
});
