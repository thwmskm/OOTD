// hooks/useOutfitFilter.ts
// hook to filter outfits by tag (season, style, occasion)
// season uses a multi-select array
// style/occasion are free text, so they use chips + a text query (same pattern as brand/material in useClosetFilter)
import { useState, useMemo, useCallback } from "react";
import { Outfit } from "../../models/Outfit";

type OutfitFilterState = {
  selectedSeasons: string[];
  selectedStyles: string[];
  selectedOccasions: string[];
  styleQuery: string;
  occasionQuery: string;
};

const EMPTY_FILTER_STATE: OutfitFilterState = {
  selectedSeasons: [],
  selectedStyles: [],
  selectedOccasions: [],
  styleQuery: "",
  occasionQuery: "",
};

const useOutfitFilter = (items: Outfit[]) => {
  const [filters, setFilters] = useState<OutfitFilterState>(EMPTY_FILTER_STATE);

  //generic toggle for multi-select array fields (season, style, occasion)
  const toggleValue = useCallback(
    (field: keyof OutfitFilterState, value: string) => {
      setFilters((prev) => {
        const current = prev[field] as string[];
        const exists = current.includes(value);
        return {
          ...prev,
          [field]: exists
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
    },
    [],
  );

  const toggleSeason = useCallback(
    (value: string) => toggleValue("selectedSeasons", value),
    [toggleValue],
  );
  const toggleStyle = useCallback(
    (value: string) => toggleValue("selectedStyles", value),
    [toggleValue],
  );
  const toggleOccasion = useCallback(
    (value: string) => toggleValue("selectedOccasions", value),
    [toggleValue],
  );

  const setStyleQuery = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, styleQuery: text }));
  }, []);

  const setOccasionQuery = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, occasionQuery: text }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTER_STATE);
  }, []);

  //derive available chip values from the current item list (only show tags that exist in closet)
  const availableSeasons = useMemo(
    () => [...new Set(items.map((i) => i.season).filter(Boolean))] as string[],
    [items],
  );

  //style/occasion chip lists additionally narrowed by their query string
  const availableStyles = useMemo(() => {
    const all = [...new Set(items.map((i) => i.style).filter(Boolean))] as string[];
    if (!filters.styleQuery) return all;
    const q = filters.styleQuery.toLowerCase();
    return all.filter((s) => s.toLowerCase().includes(q));
  }, [items, filters.styleQuery]);

  const availableOccasions = useMemo(() => {
    const all = [...new Set(items.map((i) => i.occasion).filter(Boolean))] as string[];
    if (!filters.occasionQuery) return all;
    const q = filters.occasionQuery.toLowerCase();
    return all.filter((o) => o.toLowerCase().includes(q));
  }, [items, filters.occasionQuery]);

  //active filter count per category, for pill badges (e.g. "Season (2)")
  const activeCounts = useMemo(
    () => ({
      season: filters.selectedSeasons.length,
      style: filters.selectedStyles.length,
      occasion: filters.selectedOccasions.length,
    }),
    [filters],
  );

  const hasActiveFilters = useMemo(
    () => Object.values(activeCounts).some((count) => count > 0),
    [activeCounts],
  );

  //apply all active filters to the item list
  //within a category: OR (season: Spring OR Summer)
  //across categories: AND (season AND style)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (
        filters.selectedSeasons.length &&
        !(item.season && filters.selectedSeasons.includes(item.season))
      )
        return false;

      //style: selected chips OR (if no chips selected) fall back to raw query match
      if (filters.selectedStyles.length) {
        if (!(item.style && filters.selectedStyles.includes(item.style)))
          return false;
      } else if (filters.styleQuery) {
        if (!item.style?.toLowerCase().includes(filters.styleQuery.toLowerCase()))
          return false;
      }

      //occasion: same fallback pattern as style
      if (filters.selectedOccasions.length) {
        if (!(item.occasion && filters.selectedOccasions.includes(item.occasion)))
          return false;
      } else if (filters.occasionQuery) {
        if (
          !item.occasion?.toLowerCase().includes(filters.occasionQuery.toLowerCase())
        )
          return false;
      }

      return true;
    });
  }, [items, filters]);

  return {
    filters,
    filteredItems,
    availableSeasons,
    availableStyles,
    availableOccasions,
    activeCounts,
    hasActiveFilters,
    toggleSeason,
    toggleStyle,
    toggleOccasion,
    setStyleQuery,
    setOccasionQuery,
    resetFilters,
  };
};

export default useOutfitFilter;