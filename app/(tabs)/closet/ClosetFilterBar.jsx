// app/(tabs)/closet/ClosetFilterBar.jsx
// horizontal pill row + sort icon
// clothing tab: colour/type/season/inOut/brand/material, outfit tab: season/style/occasion
// tapping a pill opens a popover with that category's chips (or search+chips for brand/material/style/occasion)
// only one popover open at a time; tapping outside closes it
import React, { useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";

const CLOTHING_CATEGORIES = [
  { key: "colour", label: "Colour" },
  { key: "type", label: "Type" },
  { key: "season", label: "Season" },
  { key: "inOut", label: "In/Out" },
  { key: "brand", label: "Brand" },
  { key: "material", label: "Material" },
];

const OUTFIT_CATEGORIES = [
  { key: "season", label: "Season" },
  { key: "style", label: "Style" },
  { key: "occasion", label: "Occasion" },
];

const ClosetFilterBar = ({ tab, filter, sort }) => {
  const [activePopover, setActivePopover] = useState(null);

  const categories = tab === "outfit" ? OUTFIT_CATEGORIES : CLOTHING_CATEGORIES;

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
    style: {
      available: filter.availableStyles,
      selected: filter.filters.selectedStyles,
      toggle: filter.toggleStyle,
      count: filter.activeCounts.style,
      query: filter.filters.styleQuery,
      setQuery: filter.setStyleQuery,
    },
    occasion: {
      available: filter.availableOccasions,
      selected: filter.filters.selectedOccasions,
      toggle: filter.toggleOccasion,
      count: filter.activeCounts.occasion,
      query: filter.filters.occasionQuery,
      setQuery: filter.setOccasionQuery,
    },
  };

  const togglePopover = (key) => {
    setActivePopover((prev) => (prev === key ? null : key));
  };

  const activeCategory =
    activePopover && activePopover !== "sort"
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
          {categories.map((cat) => {
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
                <AppText
                  weight="medium"
                  style={[
                    styles.pillText,
                    (isActive || hasSelections) && styles.pillTextActive,
                  ]}
                >
                  {cat.label}
                  {hasSelections ? ` (${config.count})` : ""}
                </AppText>
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
              <AppText weight="medium" style={styles.clearPillText}>
                Clear
              </AppText>
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
            size={14}
            color={activePopover === "sort" ? colors.paper : colors.ink}
          />
        </Pressable>
      </View>

      {activePopover && (
        <>
          <Pressable
            style={styles.mask}
            onPress={() => setActivePopover(null)}
          />

          <View style={styles.popover}>
            {activePopover === "sort" ? (
              <>
                <AppText weight="medium" style={styles.popoverTitle}>
                  Sort by
                </AppText>
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
                      <AppText
                        weight="regular"
                        style={[
                          styles.sortOptionText,
                          isSelected && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </AppText>
                      {isSelected && (
                        <FontAwesome5
                          name="check"
                          size={12}
                          color={colors.sage}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <>
                <AppText weight="medium" style={styles.popoverTitle}>
                  {categories.find((c) => c.key === activePopover)?.label}
                </AppText>

                {activeCategory.query !== undefined && (
                  <TextInput
                    value={activeCategory.query}
                    onChangeText={activeCategory.setQuery}
                    placeholder={`Search ${activePopover}...`}
                    placeholderTextColor={colors.textMuted}
                    style={styles.searchInput}
                  />
                )}

                <View style={styles.chipWrap}>
                  {activeCategory.available.length === 0 ? (
                    <AppText weight="regular" style={styles.emptyText}>
                      No matches
                    </AppText>
                  ) : (
                    activeCategory.available.map((value) => {
                      const isSelected =
                        activeCategory.selected.includes(value);
                      return (
                        <Pressable
                          key={value}
                          onPress={() => activeCategory.toggle(value)}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                        >
                          <AppText
                            weight="medium"
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {value}
                          </AppText>
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
    backgroundColor: colors.paper,
  },
  pillRow: {
    flexDirection: "row",
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    gap: spacing.xs + 2,
    alignItems: "center",
  },
  pill: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
  },
  pillActive: {
    backgroundColor: colors.sage,
  },
  pillText: {
    fontSize: 12,
    color: colors.ink,
  },
  pillTextActive: {
    color: colors.paper,
  },
  clearPill: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  clearPillText: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: "underline",
  },
  sortBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginLeft: spacing.xs,
    borderRadius: radius.md,
  },
  mask: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    height: 1000,
    zIndex: 21,
  },
  popover: {
    position: "absolute",
    top: 46,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    zIndex: 22,
    maxHeight: 280,
    // soft shadow — reads as a lifted card rather than a hard-bordered panel
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  popoverTitle: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    color: colors.ink,
    fontFamily: "Pretendard_Regular",
    fontSize: 13,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs + 2,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
  },
  chipSelected: {
    backgroundColor: colors.sage,
  },
  chipText: {
    fontSize: 12,
    color: colors.ink,
  },
  chipTextSelected: {
    color: colors.paper,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderColor: colors.surface,
  },
  sortOptionText: {
    fontSize: 13,
    color: colors.ink,
  },
  sortOptionTextActive: {
    color: colors.sage,
  },
});
