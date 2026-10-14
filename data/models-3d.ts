import { L } from "@/data/products/_shared";
import type { CategorySlug, ProductModel3D } from "@/types/product";

function kenney(file: string): ProductModel3D {
  return {
    glb: `/models/kenney/${file}`,
    source: L(
      "Категорийная 3D-модель Kenney Furniture Kit (CC0). Точная модель этого SKU у производителя недоступна.",
      "Category 3D model from Kenney Furniture Kit (CC0). An official manufacturer model for this SKU is not available.",
    ),
  };
}

export const MODEL3D_BY_CATEGORY: Partial<Record<CategorySlug, ProductModel3D>> = {
  refrigerators: kenney("kitchenFridgeLarge.glb"),
  freezers: kenney("kitchenFridge.glb"),
  "washing-machines": kenney("washer.glb"),
  dryers: kenney("dryer.glb"),
  ovens: kenney("kitchenStove.glb"),
  cooktops: kenney("kitchenStoveElectric.glb"),
  microwaves: kenney("kitchenMicrowave.glb"),
  hoods: kenney("hoodLarge.glb"),
  "coffee-machines": kenney("kitchenCoffeeMachine.glb"),
  blenders: kenney("kitchenBlender.glb"),
  mixers: kenney("kitchenBlender.glb"),
  toasters: kenney("toaster.glb"),
  televisions: kenney("televisionModern.glb"),
  monitors: kenney("televisionModern.glb"),
  soundbars: kenney("speaker.glb"),
};
