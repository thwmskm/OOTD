import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const MAX_COLOURS = 3;

export const COLOURS = [
  // Neutrals
  { label: "black", hex: "#000000" },
  { label: "charcoal", hex: "#36454F" },
  { label: "grey", hex: "#808080" },
  { label: "silver", hex: "#C0C0C0" },
  { label: "white", hex: "#FFFFFF" },
  { label: "cream", hex: "#FFFDD0" },
  { label: "beige", hex: "#F5F0E8" },
  { label: "tan", hex: "#D2B48C" },
  { label: "camel", hex: "#C19A6B" },
  { label: "brown", hex: "#8B4513" },
  { label: "chocolate", hex: "#3D1C02" },
  // Warm
  { label: "red", hex: "#CC0000" },
  { label: "crimson", hex: "#8B0000" },
  { label: "burgundy", hex: "#6D0F2B" },
  { label: "coral", hex: "#FF6B6B" },
  { label: "orange", hex: "#FF6600" },
  { label: "rust", hex: "#B7410E" },
  { label: "yellow", hex: "#FFD700" },
  { label: "mustard", hex: "#E1A900" },
  { label: "gold", hex: "#CFB53B" },
  // Cool
  { label: "green", hex: "#2D6A2D" },
  { label: "olive", hex: "#6B7C2D" },
  { label: "sage", hex: "#8FAF78" },
  { label: "mint", hex: "#98E8C1" },
  { label: "teal", hex: "#008080" },
  { label: "navy", hex: "#001F5B" },
  { label: "blue", hex: "#1A5EAD" },
  { label: "sky blue", hex: "#87CEEB" },
  { label: "lavender", hex: "#B57EDC" },
  { label: "purple", hex: "#6A0DAD" },
  { label: "lilac", hex: "#C8A2C8" },
  // Pink & nude
  { label: "pink", hex: "#FFB6C1" },
  { label: "hot pink", hex: "#FF69B4" },
  { label: "mauve", hex: "#B08090" },
  { label: "nude", hex: "#E8C9A0" },
  { label: "rose", hex: "#E8A0A0" },
];

const LIGHT_LABELS = [
  "white",
  "cream",
  "silver",
  "beige",
  "mint",
  "sky blue",
  "lilac",
  "lavender",
  "pink",
  "nude",
  "rose",
];

const ColourPicker = ({ selected = [], onChange, max = 3 }) => {
  const toggleColour = (label) => {
    if (selected.includes(label)) {
      onChange(selected.filter((c) => c !== label));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, label]);
    }
  };

  return (
    <View>
      {/* Tags */}
      <View style={styles.tagRow}>
        {selected.map((label) => {
          const hex = COLOURS.find((c) => c.label === label)?.hex ?? "#ccc";
          return (
            <Pressable
              key={label}
              onPress={() => toggleColour(label)}
              style={styles.tag}
            >
              <View
                style={[
                  styles.tagSwatch,
                  { backgroundColor: hex },
                  LIGHT_LABELS.includes(label) && styles.swatchBordered,
                ]}
              />
              <Text style={styles.tagLabel}>{label}</Text>
              <FontAwesome5 name="times" size={10} color="#666" />
            </Pressable>
          );
        })}
      </View>

      {/* Picker list */}
      <View>
        {COLOURS.map(({ label, hex }) => {
          const isSelected = selected.includes(label);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <Pressable
              key={label}
              onPress={() => toggleColour(label)}
              disabled={isDisabled}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                isDisabled && styles.optionDisabled,
              ]}
            >
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: hex },
                  LIGHT_LABELS.includes(label) && styles.swatchBordered,
                ]}
              />
              <Text
                style={[
                  styles.optionLabel,
                  isDisabled && styles.optionLabelDisabled,
                ]}
              >
                {label}
              </Text>
              {isSelected && (
                <FontAwesome5 name="check" size={10} color="#000" />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default ColourPicker;

const styles = StyleSheet.create({
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    minHeight: 32,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagSwatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  tagLabel: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: "#f0f0f0",
  },
  optionDisabled: {
    opacity: 0.35,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  swatchBordered: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    textTransform: "capitalize",
  },
  optionLabelDisabled: {
    color: "#aaa",
  },
});
