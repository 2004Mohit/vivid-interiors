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
      "We create homes that feel personal, comfortable and naturally connected to the way you live. From spatial planning to the smallest detail, every element is considered to make your everyday space feel truly yours.",
    image: "/images/01_Emirus_801/01_01_emirus_801_baner_pune_p006.jpeg",
    imageAlt: "VIVID Interiors residential interior at Emirus 801, Pune",
  },

  {
    id: "commercial",
    number: "02",
    title: "Commercial",
    description:
      "We design commercial spaces that balance brand identity, functionality and experience. Every space is planned to work efficiently while creating an environment that people remember.",
    image:
      "/images/07_BramhaCorp_Kalyani_Nagar/07_01_bramhacorp_kalyani_nagar_p076.jpeg",
    imageAlt: "VIVID Interiors commercial interior at BramhaCorp, Pune",
  },

  {
    id: "jewellery-shops",
    number: "03",
    title: "Jewellery Shops",
    description:
      "We create jewellery spaces where every detail supports the value of what is being displayed. Carefully planned lighting, display areas, circulation and finishes come together to create a refined customer experience.",
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
      "We turn compact spaces into thoughtful homes where every square foot has a purpose. Smart planning, integrated storage, proportion and carefully selected materials create spaces that feel open, comfortable and complete.",
    image: "/images/02_Emirus_701/02_01_emirus_701_baner_pune_p022.jpeg",
    imageAlt: "VIVID Interiors studio apartment interior",
  },

  {
    id: "sample-flats",
    number: "05",
    title: "Sample Flats",
    description:
      "We design sample flats that help people imagine themselves living in a space. From the layout and materials to lighting and styling, every detail is created to communicate the possibilities of the finished home.",
    image: "/images/04_Swarnvilas/04_01_swarnvilas_baner_sus_road_p045.jpeg",
    imageAlt: "VIVID Interiors sample flat interior at Swarnvilas",
  },

  {
    id: "it-offices",
    number: "06",
    title: "IT Offices",
    description:
      "We create workplaces designed for the way modern teams work. Collaboration, focus, movement, technology and company culture are brought together to create productive spaces with a clear identity.",
    image:
      "/images/06_Vivid_Office/06_01_vivid_interiors_office_erandwane_pune_p071.jpeg",
    imageAlt: "VIVID Interiors office interior in Erandwane, Pune",
  },

  {
    id: "hospitality",
    number: "07",
    title: "Hospitality",
    description:
      "We design hospitality spaces around atmosphere and experience. Thoughtful layouts, materials, lighting and detailing work together to create places that feel welcoming, distinctive and memorable.",
    image:
      "/images/05_Sky_I_Manas_Lake/05_01_sky_i_manas_lake_bhugaon_p057.jpeg",
    imageAlt: "VIVID Interiors hospitality-inspired interior",
  },
];
