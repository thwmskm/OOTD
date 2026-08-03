// app/(tabs)/closet/ClosetFilterBar.jsx
// horizontal pill row (colour/type/season/inOut/brand/material) + sort icon
// tapping a pill opens a popover with that category's chips (or search+chips for brand/material)
// only one popover open at a time; tapping outside closes it
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

//design tokens -- dark brutalist editorial
const COLORS = {
  bg: "#0e0e0e",
  text: "#f0ece4",
  accent: "#C8F135",
  border: "#f0ece4",
  dim: "#6b6b66",
};

const CATEGORIES = [
  { key: "colour", label: "Colour" },
  { key: "type", label: "Type" },
  { key: "season", label: "Season" },
  { key: "inOut", label: "In/Out" },
  { key: "brand", label: "Brand" },
  { key: "material", label: "Material" },
];

const ClosetFilterBar = ({ filter, sort }) => {
  //which popover is currently open: null | "colour" | "type" | ... | "sort"
  const [activePopover, setActivePopover] = useState(null);

  //map each category key to its data + handlers from useClosetFilter's return
  const categoryConfig = {
    colour: {
      available: filter.availableColours,
      selected: filter.filters.selectedColours,
      toggle: filter.toggleColour,
      count: filter.activeCounts.colour,
    },
    type: {
      available: filter.availableTypes,
      selected: filter.filters.selectedTypes,
      toggle: filter.toggleType,
      count: filter.activeCounts.type,
    },
    season: {
      available: filter.availableSeasons,
      selected: filter.filters.selectedSeasons,
      toggle: filter.toggleSeason,
      count: filter.activeCounts.season,
    },
    inOut: {
      available: filter.availableInOut,
      selected: filter.filters.selectedInOut,
      toggle: filter.toggleInOut,
      count: filter.activeCounts.inOut,
    },
    brand: {
      available: filter.availableBrands,
      selected: filter.filters.selectedBrands,
      toggle: filter.toggleBrand,
      count: filter.activeCounts.brand,
      query: filter.filters.brandQuery,
      setQuery: filter.setBrandQuery,
    },
    material: {
      available: filter.availableMaterials,
      selected: filter.filters.selectedMaterials,
      toggle: filter.toggleMaterial,
      count: filter.activeCounts.material,
      query: filter.filters.materialQuery,
      setQuery: filter.setMaterialQuery,
    },
  };

  const togglePopover = (key) => {
    setActivePopover((prev) => (prev === key ? null : key));
  };

  const activeCategory = activePopover && activePopover !== "sort"
    ? categoryConfig[activePopover]
    : null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.barRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {CATEGORIES.map((cat) => {
            const config = categoryConfig[cat.key];
            const isActive = activePopover === cat.key;
            const hasSelections = config.count > 0;
            return (
              <Pressable
                key={cat.key}
                onPress={() => togglePopover(cat.key)}
                style={[
                  styles.pill,
                  (isActive || hasSelections) && styles.pillActive,
                ]}
              >
                {hasSelections && <View style={styles.cornerTick} />}
                <Text
                  style={[
                    styles.pillText,
                    (isActive || hasSelections) && styles.pillTextActive,
                  ]}
                >
                  {cat.label}
                  {hasSelections ? ` (${config.count})` : ""}
                </Text>
              </Pressable>
            );
          })}

          {filter.hasActiveFilters && (
            <Pressable
              onPress={() => {
                filter.resetFilters();
                setActivePopover(null);
              }}
              style={styles.clearPill}
            >
              <Text style={styles.clearPillText}>Clear</Text>
            </Pressable>
          )}
        </ScrollView>

        <Pressable
          onPress={() => togglePopover("sort")}
          style={[
            styles.sortBtn,
            activePopover === "sort" && styles.pillActive,
          ]}
        >
          <FontAwesome5
            name="sliders-h"
            size={16}
            color={activePopover === "sort" ? COLORS.bg : COLORS.text}
          />
        </Pressable>
      </View>

      {activePopover && (
        <>
          {/* tap-outside mask to dismiss */}
          <Pressable
            style={styles.mask}
            onPress={() => setActivePopover(null)}
          />

          <View style={styles.popover}>
            {activePopover === "sort" ? (
              <>
                <Text style={styles.popoverTitle}>Sort By</Text>
                {sort.sortOptions.map((option) => {
                  const isSelected = sort.sortBy === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        sort.setSort(option.value);
                        setActivePopover(null);
                      }}
                      style={styles.sortOption}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          isSelected && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <FontAwesome5
                          name="check"
                          size={12}
                          color={COLORS.accent}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <>
                <Text style={styles.popoverTitle}>
                  {CATEGORIES.find((c) => c.key === activePopover)?.label}
                </Text>

                {activeCategory.query !== undefined && (
                  <TextInput
                    value={activeCategory.query}
                    onChangeText={activeCategory.setQuery}
                    placeholder={`Search ${activePopover}...`}
                    placeholderTextColor={COLORS.dim}
                    style={styles.searchInput}
                  />
                )}

                <View style={styles.chipWrap}>
                  {activeCategory.available.length === 0 ? (
                    <Text style={styles.emptyText}>No matches</Text>
                  ) : (
                    activeCategory.available.map((value) => {
                      const isSelected = activeCategory.selected.includes(value);
                      return (
                        <Pressable
                          key={value}
                          onPress={() => activeCategory.toggle(value)}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {value}
                          </Text>
                        </Pressable>
                      );
                    })
                  )}
                </View>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ClosetFilterBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 20,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  pillRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 12,
    gap: 8,
    alignItems: "center",
  },
  pill: {
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pillText: {
    fontFamily: "SpaceGrotesk",
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.text,
  },
  pillTextActive: {
    color: COLORS.bg,
  },
  cornerTick: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 6,
    height: 6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.accent,
  },
  clearPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearPillText: {
    fontFamily: "SpaceGrotesk",
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.dim,
    textDecorationLine: "underline",
  },
  sortBtn: {
    borderLeftWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  mask: {
    position: "absolute",
    top: 41,
    left: 0,
    right: 0,
    height: 1000,
    zIndex: 21,
  },
  popover: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
    padding: 14,
    zIndex: 22,
    maxHeight: 260,
  },
  popoverTitle: {
    fontFamily: "SpaceGrotesk",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.dim,
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontFamily: "SpaceGrotesk",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    fontFamily: "SpaceGrotesk",
    fontSize: 12,
    textTransform: "uppercase",
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.bg,
  },
  emptyText: {
    fontFamily: "SpaceGrotesk",
    fontSize: 12,
    color: COLORS.dim,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#1c1c1c",
  },
  sortOptionText: {
    fontFamily: "SpaceGrotesk",
    fontSize: 13,
    textTransform: "uppercase",
    color: COLORS.text,
  },
  sortOptionTextActive: {
    color: COLORS.accent,
  },
});