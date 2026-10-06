import "./clients.css";

type Client = {
  name: string;
  image?: string;
  alt?: string;
};

const clients: Client[] = [
  {
    name: "Gartech Engineering Poultry",
    image: "/images/clients/gartech.png",
    alt: "Gartech Engineering Poultry",
  },
  {
    name: "Kolte Patil Developers",
    image: "/images/clients/kolte-patil.png",
    alt: "Kolte Patil Developers",
  },
  {
    name: "Shapoorji Pallonji",
    image: "/images/clients/shapoorji-pallonji.png",
    alt: "Shapoorji Pallonji",
  },
  {
    name: "Ranawat Group",
    image: "/images/clients/ranawat-group.png",
    alt: "Ranawat Group",
  },
  {
    name: "Bhansali Developers",
  },
  {
    name: "Amanora – City Corporation",
  },
  {
    name: "Nagarkar Jewellers",
    image: "/images/clients/nagarkar-jewellers.png",
    alt: "Nagarkar Jewellers",
  },
  {
    name: "Jehangir Hospital",
  },
  {
    name: "HCJMRI",
    image: "/images/clients/hcjmri.png",
    alt: "HCJMRI",
  },
  {
    name: "JSPM University Pune",
    image: "/images/clients/jspm.png",
    alt: "JSPM University Pune",
  },
  {
    name: "Metaphors Architects",
  },
  {
    name: "Oud by Idol – India & UAE",
    image: "/images/clients/oud-by-idol.png",
    alt: "Oud by Idol India and UAE",
  },
];

function ClientLogo({ client }: { client: Client }) {
  return (
    <div className="vivid-clients__logo-card">
      <div className="vivid-clients__logo-inner">
        {client.image ? (
          <img
            src={client.image}
            alt={client.alt ?? client.name}
            className="vivid-clients__logo"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="vivid-clients__text-logo">{client.name}</span>
        )}
      </div>
    </div>
  );
}

function Clients() {
  return (
    <section
      id="clients"
      className="vivid-clients"
      aria-labelledby="clients-heading"
    >
      <div className="vivid-clients__header">
        <div className="vivid-clients__eyebrow">
          <span>CLIENTS</span>
        </div>

        <h2 id="clients-heading">
          Groups we&apos;ve
          <br />
          <span>worked with.</span>
        </h2>

        <p>
          A selection of organisations, developers, institutions and brands
          we&apos;ve had the opportunity to work with.
        </p>
      </div>

      <div className="vivid-clients__marquee">
        <div className="vivid-clients__fade vivid-clients__fade--left" />

        <div className="vivid-clients__track">
          <div className="vivid-clients__group">
            {clients.map((client) => (
              <ClientLogo key={`first-${client.name}`} client={client} />
            ))}
          </div>

          <div className="vivid-clients__group" aria-hidden="true">
            {clients.map((client) => (
              <ClientLogo key={`second-${client.name}`} client={client} />
            ))}
          </div>
        </div>

        <div className="vivid-clients__fade vivid-clients__fade--right" />
      </div>
    </section>
  );
}

export default Clients;
