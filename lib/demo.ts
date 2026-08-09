const demoNames: Record<string, string> = {
  "a1b2c3d4-0001-0001-0001-000000000001": "Maggie",
  "a1b2c3d4-0002-0002-0002-000000000002": "Jason",
  "a1b2c3d4-0003-0003-0003-000000000003": "Emily",
};

export function demoDisplayName(id: string, fallback: string) {
  return demoNames[id] ?? fallback.replace(/\s*\(Demo\)\s*$/i, "");
}
