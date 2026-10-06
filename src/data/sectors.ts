export type Sector = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const sectors: Sector[] = [
  {
    id: "residential",
    number: "01",
    title: "Residential",
    description:
      "Residential interiors are one of VIVID's documented areas of work, with portfolio examples across Pune.",
    image: "/images/01_Emirus_801/01_01_emirus_801_baner_pune_p006.jpeg",
    imageAlt: "VIVID Interiors residential interior at Emirus 801, Pune",
  },

  {
    id: "commercial",
    number: "02",
    title: "Commercial",
    description:
      "Commercial interiors are documented across workplaces and commercial environments, combining functionality with a strong spatial identity.",
    image:
      "/images/07_BramhaCorp_Kalyani_Nagar/07_01_bramhacorp_kalyani_nagar_p076.jpeg",
    imageAlt: "VIVID Interiors commercial interior at BramhaCorp, Pune",
  },

  {
    id: "jewellery-shops",
    number: "03",
    title: "Jewellery Shops",
    description:
      "Premium retail environments designed around display, lighting, circulation and a distinctive customer experience.",
    image:
      "/images/03_Nagarkar_Jewellers/03_01_s_s_nagarkar_jewellers_tulshibaug_pune_p036.jpeg",
    imageAlt:
      "VIVID Interiors jewellery shop interior at S. S. Nagarkar Jewellers",
  },

  {
    id: "studio-apartments",
    number: "04",
    title: "Studio Apartments",
    description:
      "Compact residential environments where planning, proportion, storage and material choices work together to create efficient living spaces.",
    image: "/images/02_Emirus_701/02_01_emirus_701_baner_pune_p022.jpeg",
    imageAlt: "VIVID Interiors studio apartment interior",
  },

  {
    id: "sample-flats",
    number: "05",
    title: "Sample Flats",
    description:
      "Sample flats are designed to communicate a project's character through carefully considered planning, detailing, materials and presentation.",
    image: "/images/04_Swarnvilas/04_01_swarnvilas_baner_sus_road_p045.jpeg",
    imageAlt: "VIVID Interiors sample flat interior at Swarnvilas",
  },

  {
    id: "it-offices",
    number: "06",
    title: "IT Offices",
    description:
      "Contemporary workplaces designed around collaboration, productivity, circulation and the character of the organisation.",
    image:
      "/images/06_Vivid_Office/06_01_vivid_interiors_office_erandwane_pune_p071.jpeg",
    imageAlt: "VIVID Interiors office interior in Erandwane, Pune",
  },

  {
    id: "hospitality",
    number: "07",
    title: "Hospitality",
    description:
      "Hospitality environments shaped around atmosphere, comfort, movement and memorable spatial experiences.",
    image:
      "/images/05_Sky_I_Manas_Lake/05_01_sky_i_manas_lake_bhugaon_p057.jpeg",
    imageAlt: "VIVID Interiors hospitality-inspired interior",
  },
];
