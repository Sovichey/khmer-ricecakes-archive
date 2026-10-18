const genericAttributions = new Set(["Market Vendor", "Market Stall"]);

export function displayContributor(contributor) {
  if (genericAttributions.has(contributor)) {
    return "Contributor not recorded";
  }

  return contributor || "Contributor not recorded";
}
