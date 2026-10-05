import { useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./contact.css";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_EMAILS = [
  "thestudiovelvet21@gmail.com",
  "vividinteriors16@gmail.com",
];

const ADDRESS =
  "ESTONIA APARTMENT, 9/1, Gulawani Maharaj Road, Swaroop Society, Vakil Nagar, Erandwane, Pune, Maharashtra 411004";

function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const form = formRef.current;
    const details = detailsRef.current;
    const map = mapRef.current;
    const grid = gridRef.current;

    if (!section || !eyebrow || !title || !form || !details || !map || !grid) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const animation = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      animation
        .fromTo(
          eyebrow,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        )
        .fromTo(
          title,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.4",
        )
        .fromTo(
          [form, details, map],
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.65",
        );

      gsap.to(grid, {
        x: 30,
        y: 18,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }, section);

    return () => context.revert();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const projectType = String(formData.get("projectType") || "");
    const location = String(formData.get("location") || "");
    const budget = String(formData.get("budget") || "");
    const message = String(formData.get("message") || "");

    const subject = `New Vivid Interiors Enquiry — ${name}`;

    const body = [
      "NEW VIVID INTERIORS ENQUIRY",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Project Type: ${projectType}`,
      `Project Location: ${location}`,
      `Approx. Budget: ${budget}`,
      "",
      "Message:",
      message,
      "",
      "---",
      "Submitted through the Vivid Interiors website.",
    ].join("\n");

    const mailto = `mailto:${CONTACT_EMAILS.join(",")}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
    window.location.href = mailto;
  };

  return (
    <section ref={sectionRef} className="vivid-contact">
      <div ref={gridRef} className="vivid-contact__grid" />

      <div className="vivid-contact__inner">
        <div ref={eyebrowRef} className="vivid-contact__eyebrow">
          <span>04</span>
          <p>Let's Talk</p>
        </div>

        <h2 ref={titleRef}>
          Have a space
          <br />
          <span>in mind?</span>
          <br />
          Let's shape it
          <br />
          <b>together.</b>
        </h2>

        <div className="vivid-contact__content">
          <form
            ref={formRef}
            className="vivid-contact__form"
            onSubmit={handleSubmit}
          >
            <div className="vivid-contact__form-heading">
              <span>01</span>
              <h3>Start an enquiry</h3>
            </div>

            <div className="vivid-contact__fields">
              <label>
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                />
              </label>

              <label>
                <span>Phone</span>
                <input name="phone" type="tel" placeholder="+91" required />
              </label>

              <label>
                <span>Project Type</span>
                <select name="projectType" defaultValue="" required>
                  <option value="" disabled>
                    Select project type
                  </option>
                  <option value="Residential">Residential</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Studio Apartment">Studio Apartment</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Jewellery Shop">Jewellery Shop</option>
                  <option value="IT Office">IT Office</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                <span>Project Location</span>
                <input
                  name="location"
                  type="text"
                  placeholder="City / location"
                  required
                />
              </label>

              <label>
                <span>Approx. Budget</span>
                <select name="budget" defaultValue="" required>
                  <option value="" disabled>
                    Select budget
                  </option>
                  <option value="Below ₹10 Lakhs">Below ₹10 Lakhs</option>
                  <option value="₹10–25 Lakhs">₹10–25 Lakhs</option>
                  <option value="₹25–50 Lakhs">₹25–50 Lakhs</option>
                  <option value="₹50 Lakhs–₹1 Crore">₹50 Lakhs–₹1 Crore</option>
                  <option value="Above ₹1 Crore">Above ₹1 Crore</option>
                  <option value="To be discussed">To be discussed</option>
                </select>
              </label>

              <label className="vivid-contact__field--full">
                <span>Message</span>
                <textarea
                  name="message"
                  placeholder="Tell us about your project..."
                  rows={5}
                  required
                />
              </label>
            </div>

            <button type="submit" className="vivid-contact__submit">
              <span>{submitted ? "Enquiry prepared" : "Send enquiry"}</span>
              <i aria-hidden="true">↗</i>
            </button>

            <p className="vivid-contact__form-note">
              Your enquiry will open in your email application addressed to both
              Vivid Interiors and The Studio Velvet.
            </p>
          </form>

          <div className="vivid-contact__aside">
            <div ref={detailsRef} className="vivid-contact__details">
              <div className="vivid-contact__detail-block">
                <span className="vivid-contact__detail-number">02</span>
                <p>Contact</p>

                <a href="tel:+919021094622">+91 90210 94622</a>

                <a href="mailto:vividinteriors16@gmail.com">
                  vividinteriors16@gmail.com
                </a>

                <a href="mailto:thestudiovelvet21@gmail.com">
                  thestudiovelvet21@gmail.com
                </a>
              </div>

              <div className="vivid-contact__detail-block">
                <span className="vivid-contact__detail-number">03</span>
                <p>Studio</p>

                <address>{ADDRESS}</address>
              </div>
            </div>

            <div ref={mapRef} className="vivid-contact__map">
              <iframe
                title="Vivid Interiors location in Pune"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.369407620625!2d73.82907576112922!3d18.50431676685247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfa781197ae9%3A0x6740901f6f49b9c2!2sSS%20Estonia!5e0!3m2!1sen!2sin!4v1630482572983!5m2!1sen!2sin"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
