// hooks/useClosetFilter.ts
// hook to filter clothingItems by tag (colour, type, season, inOut, brand, material)
// bounded fields (colour/type/season/inOut) use multi-select arrays
// unbounded fields (brand/material) use a text query to narrow chip choices + filter directly
import { useState, useMemo, useCallback } from "react";
import { Clothing } from "../../models/Clothing";

type ClosetFilterState = {
  selectedColours: string[];
  selectedTypes: string[];
  selectedSeasons: string[];
  selectedInOut: string[];
  selectedBrands: string[];
  selectedMaterials: string[];
  brandQuery: string;
  materialQuery: string;
};

const EMPTY_FILTER_STATE: ClosetFilterState = {
  selectedColours: [],
  selectedTypes: [],
  selectedSeasons: [],
  selectedInOut: [],
  selectedBrands: [],
  selectedMaterials: [],
  brandQuery: "",
  materialQuery: "",
};

const useClosetFilter = (items: Clothing[]) => {
  const [filters, setFilters] = useState<ClosetFilterState>(EMPTY_FILTER_STATE);

  //generic toggle for multi-select array fields (colour, type, season, inOut, brand, material)
  const toggleValue = useCallback(
    (field: keyof ClosetFilterState, value: string) => {
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

  const toggleColour = useCallback(
    (value: string) => toggleValue("selectedColours", value),
    [toggleValue],
  );
  const toggleType = useCallback(
    (value: string) => toggleValue("selectedTypes", value),
    [toggleValue],
  );
  const toggleSeason = useCallback(
    (value: string) => toggleValue("selectedSeasons", value),
    [toggleValue],
  );
  const toggleInOut = useCallback(
    (value: string) => toggleValue("selectedInOut", value),
    [toggleValue],
  );
  const toggleBrand = useCallback(
    (value: string) => toggleValue("selectedBrands", value),
    [toggleValue],
  );
  const toggleMaterial = useCallback(
    (value: string) => toggleValue("selectedMaterials", value),
    [toggleValue],
  );

  const setBrandQuery = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, brandQuery: text }));
  }, []);

  const setMaterialQuery = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, materialQuery: text }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTER_STATE);
  }, []);

  //derive available chip values from the current item list (only show tags that exist in closet)
  const availableColours = useMemo(
    () => [...new Set(items.map((i) => i.colour).filter(Boolean))] as string[],
    [items],
  );
  const availableTypes = useMemo(
    () => [...new Set(items.map((i) => i.type).filter(Boolean))] as string[],
    [items],
  );
  const availableSeasons = useMemo(
    () => [...new Set(items.map((i) => i.season).filter(Boolean))] as string[],
    [items],
  );
  const availableInOut = useMemo(
    () => [...new Set(items.map((i) => i.inOut).filter(Boolean))] as string[],
    [items],
  );

  //brand/material chip lists additionally narrowed by their query string
  const availableBrands = useMemo(() => {
    const all = [...new Set(items.map((i) => i.brand).filter(Boolean))] as string[];
    if (!filters.brandQuery) return all;
    const q = filters.brandQuery.toLowerCase();
    return all.filter((b) => b.toLowerCase().includes(q));
  }, [items, filters.brandQuery]);

  const availableMaterials = useMemo(() => {
    const all = [...new Set(items.map((i) => i.material).filter(Boolean))] as string[];
    if (!filters.materialQuery) return all;
    const q = filters.materialQuery.toLowerCase();
    return all.filter((m) => m.toLowerCase().includes(q));
  }, [items, filters.materialQuery]);

  //active filter count per category, for pill badges (e.g. "Colour (2)")
  const activeCounts = useMemo(
    () => ({
      colour: filters.selectedColours.length,
      type: filters.selectedTypes.length,
      season: filters.selectedSeasons.length,
      inOut: filters.selectedInOut.length,
      brand: filters.selectedBrands.length,
      material: filters.selectedMaterials.length,
    }),
    [filters],
  );

  const hasActiveFilters = useMemo(
    () => Object.values(activeCounts).some((count) => count > 0),
    [activeCounts],
  );

  //apply all active filters to the item list
  //within a category: OR (colour: black OR white)
  //across categories: AND (colour AND type)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (
        filters.selectedColours.length &&
        !(item.colour && filters.selectedColours.includes(item.colour))
      )
        return false;

      if (
        filters.selectedTypes.length &&
        !(item.type && filters.selectedTypes.includes(item.type))
      )
        return false;

      if (
        filters.selectedSeasons.length &&
        !(item.season && filters.selectedSeasons.includes(item.season))
      )
        return false;

      if (
        filters.selectedInOut.length &&
        !(item.inOut && filters.selectedInOut.includes(item.inOut))
      )
        return false;

      //brand: selected chips OR (if no chips selected) fall back to raw query match
      if (filters.selectedBrands.length) {
        if (!(item.brand && filters.selectedBrands.includes(item.brand)))
          return false;
      } else if (filters.brandQuery) {
        if (!item.brand?.toLowerCase().includes(filters.brandQuery.toLowerCase()))
          return false;
      }

      //material: same fallback pattern as brand
      if (filters.selectedMaterials.length) {
        if (!(item.material && filters.selectedMaterials.includes(item.material)))
          return false;
      } else if (filters.materialQuery) {
        if (
          !item.material?.toLowerCase().includes(filters.materialQuery.toLowerCase())
        )
          return false;
      }

      return true;
    });
  }, [items, filters]);

  return {
    filters,
    filteredItems,
    availableColours,
    availableTypes,
    availableSeasons,
    availableInOut,
    availableBrands,
    availableMaterials,
    activeCounts,
    hasActiveFilters,
    toggleColour,
    toggleType,
    toggleSeason,
    toggleInOut,
    toggleBrand,
    toggleMaterial,
    setBrandQuery,
    setMaterialQuery,
    resetFilters,
  };
};

export default useClosetFilter;