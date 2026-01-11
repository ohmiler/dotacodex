// Generate a SEO-friendly slug for a hero: "Anti-Mage" -> "anti-mage-1"
export function generateHeroSlug(name: string, id: number): string {
    const slugName = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens

    return `${slugName}-${id}`;
}

// Extract Hero ID from a slug: "anti-mage-1" -> 1
export function getHeroIdFromSlug(slug: string): number {
    // Check if slug is just a number (legacy support)
    if (/^\d+$/.test(slug)) {
        return parseInt(slug, 10);
    }

    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);

    return isNaN(id) ? 0 : id;
}
