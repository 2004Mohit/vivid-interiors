export type Sector = {
  id: string;
  number: string;
  title: string;
  description: string;
  projectIds: string[];
  imageProjectId: string;
};

export const sectors: Sector[] = [
  {
    id: "residential",
    number: "01",
    title: "Residential",
    description:
      "Residential interiors are one of VIVID's documented areas of work, with portfolio examples across Pune.",
    projectIds: [
      "emirus-801",
      "emirus-701",
      "swarnvilas",
      "sky-i-manas-lake",
      "ganga-legend",
      "marigold",
    ],
    imageProjectId: "emirus-801",
  },

  {
    id: "commercial",
    number: "02",
    title: "Commercial",
    description:
      "Commercial interiors are documented alongside a portfolio of workplaces and commercial environments.",
    projectIds: [
      "bramhacorp-kalyani-nagar",
      "devar-infratech",
      "gartech-chale",
    ],
    imageProjectId: "bramhacorp-kalyani-nagar",
  },

  {
    id: "jewellery-shops",
    number: "03",
    title: "Jewellery Shops",
    description:
      "Jewellery shops are a documented VIVID sector, represented in the portfolio by S. S. Nagarkar Jewellers.",
    projectIds: ["nagarkar-jewellers"],
    imageProjectId: "nagarkar-jewellers",
  },

  {
    id: "studio-apartments",
    number: "04",
    title: "Studio Apartments",
    description:
      "Studio apartments are part of VIVID's documented areas of work.",
    projectIds: [],
    imageProjectId: "emirus-701",
  },

  {
    id: "sample-flats",
    number: "05",
    title: "Sample Flats",
    description: "Sample flats are part of VIVID's documented areas of work.",
    projectIds: [],
    imageProjectId: "swarnvilas",
  },

  {
    id: "it-offices",
    number: "06",
    title: "IT Offices",
    description:
      "IT offices are a documented area of work, with portfolio examples including the Vivid Interiors Office.",
    projectIds: ["vivid-office", "gartech-production-office"],
    imageProjectId: "vivid-office",
  },

  {
    id: "hospitality",
    number: "07",
    title: "Hospitality",
    description: "Hospitality is included in VIVID's documented areas of work.",
    projectIds: [],
    imageProjectId: "sky-i-manas-lake",
  },
];
