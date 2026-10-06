export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Optional local image URL; service photos are not required. */
  image?: string;
  imageAlt?: string;
};

export const services: Service[] = [
  {
    id: "interior-planning",
    number: "01",
    title: "Interior Planning",
    description:
      "Interior planning is part of VIVID's documented expertise and forms the foundation for considered spatial decisions.",
  },
  {
    id: "turnkey-projects",
    number: "02",
    title: "Interior Turnkey Projects",
    description:
      "VIVID documents interior turnkey projects as a core area of its project expertise.",
  },
  {
    id: "project-management",
    number: "03",
    title: "Project Management",
    description:
      "Project management is included in VIVID's documented expertise for interior projects.",
  },
  {
    id: "commercial-residential",
    number: "04",
    title: "Commercial & Residential",
    description:
      "VIVID's documented expertise covers both commercial and residential interior work.",
  },
  {
    id: "civil-plumbing-mep",
    number: "05",
    title: "Civil & Plumbing (MEP)",
    description:
      "Civil and plumbing work, including MEP requirements, is part of the documented expertise.",
  },
  {
    id: "air-conditioning-ventilation",
    number: "06",
    title: "Air Conditioning / Ventilation",
    description:
      "Air conditioning and ventilation are included in VIVID's documented project expertise.",
  },
  {
    id: "smoke-fire",
    number: "07",
    title: "Smoke Detection / Fire Fighting",
    description:
      "Smoke detection and fire fighting are listed among VIVID's documented project capabilities.",
  },
  {
    id: "access-control",
    number: "08",
    title: "Access Control",
    description:
      "Access control is part of the documented expertise used across project requirements.",
  },
  {
    id: "video-imaging",
    number: "09",
    title: "Video Imaging",
    description:
      "Video imaging is included in VIVID's documented project expertise.",
  },
  {
    id: "public-address-music",
    number: "10",
    title: "Public Address / Music Systems",
    description:
      "Public address and music systems are part of the documented expertise.",
  },
  {
    id: "dg-ups",
    number: "11",
    title: "DG Set / UPS",
    description:
      "DG set and UPS requirements are included in VIVID's documented expertise.",
  },
  {
    id: "false-ceiling",
    number: "12",
    title: "False Ceiling",
    description:
      "False ceiling work is one of the documented areas of VIVID's project expertise.",
  },
  {
    id: "data-networking",
    number: "13",
    title: "Data / Networking",
    description:
      "Data and networking requirements are included in the documented expertise.",
  },
  {
    id: "fabrication-metal-furniture",
    number: "14",
    title: "Fabrication / Metal Furniture",
    description:
      "Fabrication and metal furniture are part of VIVID's documented expertise.",
  },
  {
    id: "modular-readymade",
    number: "15",
    title: "Modular / Readymade",
    description:
      "Modular and readymade work is included in VIVID's documented expertise.",
  },
  {
    id: "customised-loose-items",
    number: "16",
    title: "Customised / Loose Factory Made Items",
    description:
      "Customised and loose factory made items are part of the documented offering.",
  },
  {
    id: "painting-polishing",
    number: "17",
    title: "Painting / Polishing",
    description:
      "Painting and polishing are included in VIVID's documented project expertise.",
  },
];
