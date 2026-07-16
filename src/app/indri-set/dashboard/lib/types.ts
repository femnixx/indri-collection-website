// Shared types & constants for the analytics dashboard

export type DateRange = "3d" | "7d" | "30d" | "90d" | "365d";

export const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "3 Hari", value: "3d" },
  { label: "7 Hari", value: "7d" },
  { label: "1 Bulan", value: "30d" },
  { label: "3 Bulan", value: "90d" },
  { label: "1 Tahun", value: "365d" },
];

export const DATE_RANGE_TO_DAYS: Record<DateRange, number> = {
  "3d": 3,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};
