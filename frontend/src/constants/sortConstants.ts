export const SORT_OPTIONS = {
  RELEVANCE: "relevance",
  RATING: "rating",
  DISTANCE: "distance",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
