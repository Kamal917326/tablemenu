export type ARPreset = {
  id: string;
  label: string;
  modelUrl: string;
  defaultScale: number;
  category: "mains" | "starters" | "desserts" | "drinks" | "generic";
};

export const AR_PRESETS: ARPreset[] = [
  {
    id: "hamburger",
    label: "Burger / main course",
    modelUrl: "https://threejs.org/examples/models/gltf/Hamburger.glb",
    defaultScale: 0.35,
    category: "mains",
  },
  {
    id: "avocado",
    label: "Plated dish (generic)",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    defaultScale: 2.5,
    category: "starters",
  },
  {
    id: "water-bottle",
    label: "Drink / bottle",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb",
    defaultScale: 1.2,
    category: "drinks",
  },
  {
    id: "shoe-dessert",
    label: "Dessert placeholder",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialVariantsShoe/glTF-Binary/MaterialVariantsShoe.glb",
    defaultScale: 0.25,
    category: "desserts",
  },
];

export function getPresetByUrl(url: string): ARPreset | undefined {
  return AR_PRESETS.find((p) => p.modelUrl === url);
}
