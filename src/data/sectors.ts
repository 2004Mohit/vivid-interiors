export type Sector = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export const sectors: Sector[] = [
  {
    id: "residential",
    number: "01",
    title: "Residential",
    description:
      "Personal interiors shaped around everyday living, comfort, material and light.",
  },
  {
    id: "bungalows",
    number: "02",
    title: "Bungalows",
    description:
      "Distinctive homes where architecture, interiors and personality come together.",
  },
  {
    id: "studio-apartments",
    number: "03",
    title: "Studio Apartments",
    description:
      "Thoughtful compact spaces designed to feel open, functional and refined.",
  },
  {
    id: "commercial",
    number: "04",
    title: "Commercial Spaces",
    description:
      "Purposeful environments designed around identity, experience and function.",
  },
  {
    id: "jewellery",
    number: "05",
    title: "Jewellery Shops",
    description:
      "Elegant retail environments where display, lighting and brand identity meet.",
  },
  {
    id: "offices",
    number: "06",
    title: "IT Offices",
    description:
      "Contemporary workspaces balancing collaboration, productivity and character.",
  },
  {
    id: "hospitality",
    number: "07",
    title: "Hospitality",
    description:
      "Atmospheric spaces created to make every arrival, stay and experience memorable.",
  },
];
