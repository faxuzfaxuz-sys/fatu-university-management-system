export const departmentValues = [
  "data_analytics",
  "software_engineering",
  "economics",
  "finance",
  "financial_technology",
] as const;

export type Department = (typeof departmentValues)[number];

export function isDepartment(value: unknown): value is Department {
  return typeof value === "string" && departmentValues.includes(value as Department);
}

export function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 200 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}