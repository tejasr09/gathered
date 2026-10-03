{
  "name": "Gathered — design tokens",
  "description": "Figma-ready token reference. Create a page named 01 Foundations and add the collections below as local Variables.",
  "collections": [
    {
      "name": "Color / Core",
      "modes": ["Default"],
      "variables": {
        "color/ink": { "type": "COLOR", "values": ["#253431"] },
        "color/ink-soft": { "type": "COLOR", "values": ["#40504C"] },
        "color/paper": { "type": "COLOR", "values": ["#F5F1E9"] },
        "color/paper-white": { "type": "COLOR", "values": ["#FBFAF6"] },
        "color/sand": { "type": "COLOR", "values": ["#E7DECE"] },
        "color/sage": { "type": "COLOR", "values": ["#BAC1AE"] },
        "color/rust": { "type": "COLOR", "values": ["#C8755B"] },
        "color/rose": { "type": "COLOR", "values": ["#DDB1A8"] },
        "color/lilac": { "type": "COLOR", "values": ["#C7BED1"] },
        "color/gold": { "type": "COLOR", "values": ["#CBA36D"] },
        "color/line": { "type": "COLOR", "values": ["#25343130"] },
        "color/text-muted": { "type": "COLOR", "values": ["#7D8278"] }
      }
    },
    {
      "name": "Color / Event theme",
      "modes": ["Birthday party", "Wedding", "Naming ceremony", "Get-together", "Workshop"],
      "variables": {
        "theme/accent": { "type": "COLOR", "values": ["#C8755B", "#A86262", "#81728E", "#68765C", "#81728E"] },
        "theme/pale": { "type": "COLOR", "values": ["#EFE1D4", "#EDDFDA", "#E6E0EB", "#E3E7DC", "#E6E0EB"] },
        "theme/selected-card": { "type": "COLOR", "values": ["#F0D6C7", "#EFD8D4", "#E2D9E7", "#DCE1D4", "#E2D9E7"] }
      }
    },
    {
      "name": "Space / Radius / Type",
      "modes": ["Default"],
      "variables": {
        "space/1": { "type": "FLOAT", "values": [4] },
        "space/2": { "type": "FLOAT", "values": [8] },
        "space/3": { "type": "FLOAT", "values": [12] },
        "space/4": { "type": "FLOAT", "values": [16] },
        "space/6": { "type": "FLOAT", "values": [24] },
        "space/8": { "type": "FLOAT", "values": [32] },
        "space/12": { "type": "FLOAT", "values": [48] },
        "space/16": { "type": "FLOAT", "values": [64] },
        "space/24": { "type": "FLOAT", "values": [96] },
        "radius/small": { "type": "FLOAT", "values": [4] },
        "radius/medium": { "type": "FLOAT", "values": [12] },
        "radius/pill": { "type": "FLOAT", "values": [999] },
        "type/body-family": { "type": "STRING", "values": ["DM Sans"] },
        "type/display-family": { "type": "STRING", "values": ["Playfair Display"] },
        "type/mono-family": { "type": "STRING", "values": ["DM Mono"] },
        "type/body-small": { "type": "FLOAT", "values": [10] },
        "type/body-default": { "type": "FLOAT", "values": [12] },
        "type/section-title-mobile": { "type": "FLOAT", "values": [52] },
        "type/section-title-desktop": { "type": "FLOAT", "values": [78] }
      }
    }
  ],
  "breakpoints": { "mobile": 760, "desktop-content-max": 1440 },
  "notes": "Token JSON is a handoff reference; the project does not have a connected Figma account to create a native .fig file or publish Variables."
}
