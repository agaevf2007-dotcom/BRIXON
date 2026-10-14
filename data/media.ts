export const unsplash = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const pexels = (id: number, width = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export function gallery(cover: string, ...rest: string[]) {
  const list = [cover, ...rest];
  return [...new Set(list)];
}

/** Lifestyle images reused on marketing pages only — not assigned to product SKUs. */
export const marketing = {
  heroKitchen:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80&fm=jpg",
  lifestyleKitchen:
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=2000&q=80",
  luxuryInterior:
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=80",
  architecture:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
  studio:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80",
  materials:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  nature:
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
  phone:
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1400&q=80",
  quiet:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  energy:
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80",
  care: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=1400&q=80",
  living:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
};

export function assertUniqueProductImages(
  products: Array<{ id: string; images: string[] }>,
) {
  const owners = new Map<string, string>();
  for (const product of products) {
    for (const image of product.images) {
      const previous = owners.get(image);
      if (previous && previous !== product.id) {
        throw new Error(
          `Image reused across ${previous} and ${product.id}: ${image}`,
        );
      }
      owners.set(image, product.id);
    }
  }
}
