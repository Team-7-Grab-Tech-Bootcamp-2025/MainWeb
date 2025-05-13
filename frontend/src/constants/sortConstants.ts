export const SORT_OPTIONS = {
  RATING: "rating",
  DISTANCE: "distance",
  REVIEW_COUNT: "reviewCount",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
