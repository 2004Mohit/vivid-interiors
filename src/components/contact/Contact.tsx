import { useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import useReveal from "../../hooks/useReveal";
import Accent from "../ui/Accent";
import "./contact.css";

const CONTACT_EMAIL = "vividinteriors16@gmail.com";
const WHATSAPP_NUMBER = "919021094622";

const ADDRESS =
  "ESTONIA APARTMENT, 9/1, Gulawani Maharaj Road, Swaroop Society, Vakil Nagar, Erandwane, Pune, Maharashtra 411004";

function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [submitted, setSubmitted] = useState(false);

  // Enter / exit animation for every [data-reveal] element in this section
  useReveal(sectionRef);

  // Slow ambient drift of the background grid
  useLayoutEffect(() => {
    const grid = gridRef.current;

    if (!grid || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to(grid, {
        x: 30,
        y: 18,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }, grid);

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

    /*
     * WHATSAPP
     *
     * The complete enquiry is opened in WhatsApp with
     * all details already filled in.
     *
     * The visitor must press Send inside WhatsApp.
     */
    const encodedMessage = encodeURIComponent(`${subject}\n\n${body}`);

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    /*
     * EMAIL
     *
     * Keep the existing working email flow.
     */
    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Open WhatsApp with the complete enquiry pre-filled.
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Open the existing email application.
    setSubmitted(true);
    window.location.href = mailto;
  };

  return (
    <section ref={sectionRef} id="contact" className="vivid-contact">
      <div ref={gridRef} className="vivid-contact__grid" />

      <div className="vivid-contact__inner">
        <div className="vivid-contact__eyebrow" data-reveal="right">
          <span>06</span>
          <p>Let&apos;s Talk</p>
        </div>

        <h2 data-reveal="up" data-reveal-delay="0.1">
          Have a space
          <br />
          <Accent>in mind?</Accent>
          <br />
          Let&apos;s shape it
          <br />
          <Accent>together.</Accent>
        </h2>

        <div className="vivid-contact__content">
          <form
            className="vivid-contact__form"
            onSubmit={handleSubmit}
            data-reveal="left"
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
              Your enquiry will open in your email application and WhatsApp with
              all submitted details pre-filled. Please press Send in WhatsApp.
            </p>
          </form>

          <div className="vivid-contact__aside">
            <div className="vivid-contact__details" data-reveal="right">
              <div className="vivid-contact__detail-block">
                <span className="vivid-contact__detail-number">02</span>

                <p>Contact</p>

                <a href="tel:+919021094622">+91 90210 94622</a>

                <a href="mailto:vividinteriors16@gmail.com">
                  vividinteriors16@gmail.com
                </a>
              </div>

              <div className="vivid-contact__detail-block">
                <span className="vivid-contact__detail-number">03</span>

                <p>Studio</p>

                <address>{ADDRESS}</address>
              </div>
            </div>

            <div
              className="vivid-contact__map"
              data-reveal="scale"
              data-reveal-delay="0.1"
            >
              <a
                href="https://www.google.com/maps/search/?api=1&query=SS+Estonia,+Gulawani+Maharaj+Road,+Erandwane,+Pune,+Maharashtra+411004"
                target="_blank"
                rel="noopener noreferrer"
                className="vivid-contact__map-link"
                aria-label="Open Vivid Interiors studio location in Google Maps"
              >
                <iframe
                  title="Vivid Interiors location in Pune"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.369407620625!2d73.82907576112922!3d18.50431676685247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfa781197ae9%3A0x6740901f6f49b9c2!2sSS%20Estonia!5e0!3m2!1sen!2sin!4v1630482572983!5m2!1sen!2sin"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <span className="vivid-contact__map-mobile-overlay">
                  OPEN IN GOOGLE MAPS ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
