export const POLYCAM_DEMO_DISHES = [
  {
    id: "burger",
    name: "Copper Pot Burger",
    fileName: "burger.glb",
    tips: "Scan the full plated burger. Walk a full circle slowly, 30–45 seconds.",
  },
  {
    id: "salmon",
    name: "Pan-Seared Salmon",
    fileName: "salmon.glb",
    tips: "Include the plate and sides. Good lighting, no harsh shadows.",
  },
  {
    id: "brownie",
    name: "Dark Chocolate Brownie",
    fileName: "brownie.glb",
    tips: "Scan from above and sides. Keep background plain (table or white plate).",
  },
] as const;

export const POLYCAM_STEPS = [
  "Install Polycam (free) on iPhone or Android.",
  "Plate the dish exactly how you serve it in the restaurant.",
  "Use good light — near a window or soft overhead light. Avoid dark corners.",
  "Open Polycam → Object mode → start scan.",
  "Walk slowly around the dish in a circle, keeping it centred.",
  "Tap finish → let it process → Export as GLB.",
  "Copy the .glb file to public/models/ in this project (see filenames below).",
  "Restart npm run dev → open Admin → AR models → Preview each dish.",
];
