// hooks/useClosetSort.ts
// hook to sort a (typically already-filtered) list of clothing items or outfits
// composes after useClosetFilter/useOutfitFilter: pass filteredItems in, get sortedItems out
import { useState, useMemo, useCallback } from "react";

export type ClosetSortOption = "recent" | "oldest" | "mostWorn";

const SORT_OPTIONS: { value: ClosetSortOption; label: string }[] = [
  { value: "recent", label: "Recently Added" },
  { value: "oldest", label: "Oldest" },
  { value: "mostWorn", label: "Most Worn" },
];

//outfits have no wear tracking, so mostWorn is dropped for them
export const OUTFIT_SORT_OPTIONS = SORT_OPTIONS.filter(
  (o) => o.value !== "mostWorn",
);

//Firestore returns createdAt as a Timestamp, not a Date
const toMs = (d: any): number =>
  d?.toDate ? d.toDate().getTime() : new Date(d).getTime();

const useClosetSort = <T extends { createdAt: any }>(
  items: T[],
  sortOptions = SORT_OPTIONS,
) => {
  const [sortBy, setSortBy] = useState<ClosetSortOption>("recent");

  //sort the given items by the active sortBy option
  //does not mutate the input array
  const sortedItems = useMemo(() => {
    const list = [...items];

    switch (sortBy) {
      case "recent":
        return list.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));

      case "oldest":
        return list.sort((a, b) => toMs(a.createdAt) - toMs(b.createdAt));

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
    sortOptions,
  };
};

export default useClosetSort;