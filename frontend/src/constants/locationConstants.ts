export const CITIES = {
  HCM: { id: "1", name: "Hồ Chí Minh" },
  HN: { id: "2", name: "Hà Nội" },
} as const;

export type CityKey = "HCM" | "HN" | "ALL";

// Normalize raw district data
export const DISTRICTS = {
  HCM: [
    { id: "32", name: "Quận 1" },
    { id: "28", name: "Quận 2" },
    { id: "27", name: "Quận 3" },
    { id: "26", name: "Quận 4" },
    { id: "25", name: "Quận 5" },
    { id: "24", name: "Quận 6" },
    { id: "23", name: "Quận 7" },
    { id: "22", name: "Quận 8" },
    { id: "21", name: "Quận 9" },
    { id: "31", name: "Quận 10" },
    { id: "30", name: "Quận 11" },
    { id: "29", name: "Quận 12" },
    { id: "19", name: "Quận Bình Thạnh" },
    { id: "6", name: "Quận Tân Bình" },
    { id: "15", name: "Quận Gò Vấp" },
    { id: "8", name: "Quận Phú Nhuận" },
    { id: "2", name: "Thành phố Thủ Đức" },
    { id: "18", name: "Quận Bình Tân" },
    { id: "5", name: "Quận Tân Phú" },
    { id: "52", name: "Huyện Bình Chánh" },
    { id: "46", name: "Huyện Hóc Môn" },
    { id: "43", name: "Huyện Nhà Bè" },
    { id: "49", name: "Huyện Củ Chi" },
    { id: "50", name: "Huyện Cần Giờ" },
  ],
  HN: [
    { id: "20", name: "Quận Ba Đình" },
    { id: "16", name: "Quận Cầu Giấy" },
    { id: "3", name: "Quận Đống Đa" },
    { id: "14", name: "Quận Hai Bà Trưng" },
    { id: "13", name: "Quận Hoàn Kiếm" },
    { id: "12", name: "Quận Hoàng Mai" },
    { id: "10", name: "Quận Long Biên" },
    { id: "4", name: "Quận Tây Hồ" },
    { id: "7", name: "Quận Thanh Xuân" },
    { id: "11", name: "Quận Hà Đông" },
    { id: "9", name: "Quận Nam Từ Liêm" },
    { id: "17", name: "Quận Bắc Từ Liêm" },
    { id: "38", name: "Huyện Thanh Trì" },
    { id: "47", name: "Huyện Hoài Đức" },
    { id: "36", name: "Huyện Thạch Thất" },
    { id: "48", name: "Huyện Gia Lâm" },
    { id: "40", name: "Huyện Sóc Sơn" },
    { id: "45", name: "Huyện Mê Linh" },
    { id: "35", name: "Huyện Đan Phượng" },
    { id: "53", name: "Huyện Ba Vì" },
    { id: "34", name: "Huyện Đông Anh" },
    { id: "1", name: "Thị xã Sơn Tây" },
    { id: "44", name: "Huyện Mỹ Đức" },
    { id: "42", name: "Huyện Phúc Thọ" },
    { id: "37", name: "Huyện Thường Tín" },
    { id: "51", name: "Huyện Chương Mỹ" },
    { id: "41", name: "Huyện Quốc Oai" },
    { id: "33", name: "Huyện Ứng Hòa" },
    { id: "39", name: "Huyện Thanh Oai" },
  ],
} as const;

// Pre-compute lookup tables for optimized access

// 1. City ID to City Key mapping
export const CITY_ID_TO_KEY: Record<string, CityKey> = Object.entries(
  CITIES,
).reduce(
  (acc, [key, city]) => {
    acc[city.id] = key as CityKey;
    return acc;
  },
  {} as Record<string, CityKey>,
);

// 2. All districts with city information
export const ALL_DISTRICTS = [
  ...DISTRICTS.HCM.map((d) => ({
    ...d,
    cityId: "1",
    cityKey: "HCM" as CityKey,
  })),
  ...DISTRICTS.HN.map((d) => ({ ...d, cityId: "2", cityKey: "HN" as CityKey })),
];

// 3. District lookup by ID for O(1) access
export const DISTRICT_BY_ID = ALL_DISTRICTS.reduce(
  (acc, district) => {
    acc[district.id] = district;
    return acc;
  },
  {} as Record<string, (typeof ALL_DISTRICTS)[0]>,
);

// 4. Pre-computed city options for UI components
export const CITY_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  ...Object.entries(CITIES).map(([key, city]) => ({
    value: key,
    label: city.name,
  })),
];

// 5. Get districts by city ID
export const getDistrictsByCityId = (cityId: string) => {
  if (!cityId || cityId === "0") return ALL_DISTRICTS;
  return ALL_DISTRICTS.filter((d) => d.cityId === cityId);
};

// 6. Get city key from city ID
export const getCityKeyFromId = (cityId: string | null): CityKey => {
  if (!cityId || cityId === "0") return "ALL";
  return CITY_ID_TO_KEY[cityId] || "ALL";
};

// 7. Get city ID from city key
export const getCityIdFromKey = (cityKey: CityKey): string => {
  if (cityKey === "ALL") return "0";
  return CITIES[cityKey]?.id || "0";
};
