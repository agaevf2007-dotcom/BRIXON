import photosJson from "@/data/generated/product-photos.json";
import { MODEL3D_BY_CATEGORY } from "@/data/models-3d";
import { RETAIL_PRICES } from "@/data/retail-prices";
import type { Product } from "@/types/product";

const PHOTOS = photosJson as Record<string, string[]>;

export function applyRetail(products: Product[]): Product[] {
  return products.map((product) => {
    const images = (PHOTOS[product.id] ?? []).filter(Boolean);
    if (!images.length) {
      throw new Error(`No real product photos for ${product.id}`);
    }

    const price = RETAIL_PRICES[product.id];
    return {
      ...product,
      image: images[0],
      catalogImage: images[0],
      images,
      basePriceEUR: price?.basePriceEUR ?? product.basePriceEUR,
      oldPriceEUR: price?.oldPriceEUR ?? product.oldPriceEUR,
      priceSource: price?.source,
      model3d: MODEL3D_BY_CATEGORY[product.category],
    };
  });
}
