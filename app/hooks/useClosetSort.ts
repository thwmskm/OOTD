// hooks/useClosetSort.ts
// hook to sort a (typically already-filtered) list of clothing items
// composes after useClosetFilter: pass filteredItems in, get sortedItems out
import { useState, useMemo, useCallback } from "react";
import { Clothing } from "../../models/Clothing";

export type ClosetSortOption = "recent" | "oldest" | "mostWorn";

const SORT_OPTIONS: { value: ClosetSortOption; label: string }[] = [
  { value: "recent", label: "Recently Added" },
  { value: "oldest", label: "Oldest" },
  { value: "mostWorn", label: "Most Worn" },
];

const useClosetSort = (items: Clothing[]) => {
  const [sortBy, setSortBy] = useState<ClosetSortOption>("recent");

  //sort the given items by the active sortBy option
  //does not mutate the input array
  const sortedItems = useMemo(() => {
    const list = [...items];

    switch (sortBy) {
      case "recent":
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      case "oldest":
        return list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

      case "mostWorn":
        // NOTE: wearCount isn't tracked on Clothing yet.
        // Falls back to 0 for any item missing the field so this doesn't crash
        // once wearCount exists on the model, this will sort correctly with no changes here.
        return list.sort(
          (a, b) => ((b as any).wearCount ?? 0) - ((a as any).wearCount ?? 0),
        );

      default:
        return list;
    }
  }, [items, sortBy]);

  const setSort = useCallback((option: ClosetSortOption) => {
    setSortBy(option);
  }, []);

  return {
    sortBy,
    setSort,
    sortedItems,
    sortOptions: SORT_OPTIONS,
  };
};

export default useClosetSort;