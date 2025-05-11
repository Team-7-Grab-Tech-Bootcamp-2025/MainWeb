export const CATEGORY_NAMES = {
  food: "Food",
  service: "Service",
  delivery: "Delivery",
  price: "Price",
  ambience: "Ambience",
} as const;

export const CATEGORY_NAMES_VN = {
  food: "Món ăn",
  service: "Dịch vụ",
  delivery: "Giao hàng",
  price: "Giá cả",
  ambience: "Không gian",
} as const;

export const CATEGORY_COLORS = {
  food: "#c99383",
  service: "#a3b18a",
  delivery: "#e1ad01",
  price: "#c99383",
  ambience: "#bf1922",
} as const;

export const CATEGORY_ICONS = {
  food: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-8 w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.325 3.05L8.667 20.432l1.932 1.031 4.658-17.382-1.932-1.031zM7.612 5.967c-1.932-1.031-3.394-.344-4.04 1.031-.647 1.375-.216 3.203 1.716 4.235 1.932 1.031 3.394.344 4.04-1.031.648-1.375.216-3.203-1.716-4.235zM19.45 3.047c-1.932-1.031-3.394-.344-4.04 1.031-.648 1.375-.216 3.203 1.715 4.235 1.932 1.031 3.394.344 4.04-1.031.648-1.375.216-3.203-1.715-4.235zM14.325 14.279l-1.932-1.031-1.932 1.031 1.932 1.031 1.932-1.031z"
      />
    </svg>
  ),
  service: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-8 w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  delivery: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-8 w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  ),
  price: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-8 w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  ambience: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-8 w-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
} as const;

export type RatingCategory =
  | keyof typeof CATEGORY_NAMES
  | keyof typeof CATEGORY_NAMES_VN;
