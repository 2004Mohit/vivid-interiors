import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "../../lib/gsap";
import { scrollToTarget } from "../../lib/lenis";
import ThemeToggle from "../ui/ThemeToggle";
import "./navigation.css";

const menuItems = [
  { number: "01", label: "Home", href: "#home" },
  { number: "02", label: "About", href: "#about" },
  { number: "03", label: "Expertise", href: "#services" },
  { number: "04", label: "Sectors", href: "#sectors" },
  { number: "05", label: "Projects", href: "#projects" },
  { number: "06", label: "Clients", href: "#clients" },
  { number: "07", label: "Contact", href: "#contact" },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  const navigationRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const menuMetaRef = useRef<HTMLDivElement>(null);
  const menuImageRef = useRef<HTMLDivElement>(null);
  const menuImageElementRef = useRef<HTMLImageElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

  /*
   * Stores the section that should be visited after
   * the mobile navigation panel has completely closed.
   */
  const pendingNavigationRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    const menuPanel = menuPanelRef.current;
    const menuItemsElement = menuItemsRef.current;
    const menuMeta = menuMetaRef.current;
    const menuImage = menuImageRef.current;
    const menuImageElement = menuImageElementRef.current;

    if (
      !navigation ||
      !menuPanel ||
      !menuItemsElement ||
      !menuMeta ||
      !menuImage ||
      !menuImageElement
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(menuPanel, {
        yPercent: -100,
      });

      gsap.set(menuItemsElement.children, {
        yPercent: 110,
        opacity: 0,
      });

      gsap.set(menuMeta, {
        opacity: 0,
        y: 20,
      });

      gsap.set(menuImage, {
        clipPath: "inset(100% 0% 0% 0%)",
      });

      gsap.set(menuImageElement, {
        scale: 1.15,
      });

      menuTimelineRef.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power4.out",
        },
      });

      menuTimelineRef.current
        .to(menuPanel, {
          yPercent: 0,
          duration: 0.9,
        })
        .to(
          menuImage,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.inOut",
          },
          "-=0.65",
        )
        .to(
          menuImageElement,
          {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
          },
          "<",
        )
        .to(
          menuItemsElement.children,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.07,
          },
          "-=0.75",
        )
        .to(
          menuMeta,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.45",
        );
    }, navigationRef);

    return () => {
      menuTimelineRef.current?.kill();
      context.revert();
    };
  }, []);

  /* ---------- compact navigation bar ---------- */

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", update, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", update);
    };
  }, []);

  /* ---------- direct desktop navigation ---------- */

  const navigateDirectly = useCallback((href: string) => {
    const element = document.querySelector<HTMLElement>(href);

    if (!element) {
      console.warn(`Navigation target not found: ${href}`);
      return;
    }

    setActiveHref(href);

    requestAnimationFrame(() => {
      scrollToTarget(element);
    });
  }, []);

  /* ---------- actual mobile navigation ---------- */

  const navigateToTarget = useCallback((href: string) => {
    const element = document.querySelector<HTMLElement>(href);

    if (!element) {
      console.warn(`Navigation target not found: ${href}`);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTarget(element);
      });
    });
  }, []);

  /* ---------- open mobile menu ---------- */

  const openMenu = () => {
    pendingNavigationRef.current = null;

    document.body.classList.add("menu-open");

    setIsOpen(true);

    requestAnimationFrame(() => {
      menuTimelineRef.current?.play();
    });
  };

  /* ---------- close mobile menu ---------- */

  const closeMenu = useCallback(() => {
    pendingNavigationRef.current = null;

    menuButtonRef.current?.focus();

    menuTimelineRef.current?.reverse();

    setIsOpen(false);

    gsap.delayedCall(0.95, () => {
      if (!pendingNavigationRef.current) {
        document.body.classList.remove("menu-open");
      }
    });
  }, []);

  /* ---------- mobile menu item navigation ---------- */

  const handleMenuItemClick = useCallback(
    (href: string) => {
      const element = document.querySelector<HTMLElement>(href);

      if (!element) {
        console.warn(`Navigation target not found: ${href}`);
        return;
      }

      setActiveHref(href);

      pendingNavigationRef.current = href;

      /*
       * Move focus outside the navigation panel BEFORE
       * aria-hidden becomes true.
       *
       * This prevents the browser warning:
       * "Blocked aria-hidden on an element because its
       * descendant retained focus."
       */
      menuButtonRef.current?.focus();

      menuTimelineRef.current?.reverse();

      setIsOpen(false);

      gsap.delayedCall(0.95, () => {
        const target = pendingNavigationRef.current;

        if (!target) {
          return;
        }

        pendingNavigationRef.current = null;

        document.body.classList.remove("menu-open");

        navigateToTarget(target);
      });
    },
    [navigateToTarget],
  );

  /* ---------- keyboard escape ---------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <header
      ref={navigationRef}
      className={`vivid-navigation${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="vivid-navigation__bar">
        {/* Brand */}
        <a
          href="#home"
          className="vivid-navigation__brand"
          aria-label="Vivid Interiors home"
          onClick={(event) => {
            event.preventDefault();
            navigateDirectly("#home");
          }}
        >
          <img
            src="/vivid-logo.png"
            alt="Vivid Interiors"
            className="vivid-navigation__mark"
          />

          <span className="vivid-navigation__brand-text">Vivid Interiors</span>
        </a>

        {/* Desktop Navigation */}
        <nav
          className="vivid-navigation__desktop-links"
          aria-label="Primary navigation"
        >
          {menuItems.map((item) => (
            <a
              key={item.number}
              href={item.href}
              className={activeHref === item.href ? "is-active" : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigateDirectly(item.href);
              }}
            >
              <span className="vivid-navigation__desktop-label">
                {item.label}
              </span>

              <span
                className="vivid-navigation__active-line"
                aria-hidden="true"
              >
                <span className="vivid-navigation__active-line-red" />
                <span className="vivid-navigation__active-line-pista" />
              </span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="vivid-navigation__actions">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            className={`vivid-navigation__menu-button ${
              isOpen ? "is-active" : ""
            }`}
            onClick={isOpen ? closeMenu : openMenu}
            aria-expanded={isOpen}
            aria-controls="vivid-navigation-menu"
          >
            <span>{isOpen ? "Close" : "Menu"}</span>

            <span className="vivid-navigation__menu-icon">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU PANEL
          Kept for mobile navigation
      ===================================================== */}

      <div
        ref={menuPanelRef}
        id="vivid-navigation-menu"
        className="vivid-navigation__panel"
        aria-hidden={!isOpen}
      >
        <div className="vivid-navigation__panel-inner">
          <div ref={menuItemsRef} className="vivid-navigation__links">
            {menuItems.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className={activeHref === item.href ? "is-active" : undefined}
                data-image="/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg"
                onClick={(event) => {
                  event.preventDefault();
                  handleMenuItemClick(item.href);
                }}
              >
                <span className="vivid-navigation__number">{item.number}</span>

                <span className="vivid-navigation__label">{item.label}</span>

                <span className="vivid-navigation__arrow">↗</span>

                <span
                  className="vivid-navigation__mobile-active-line"
                  aria-hidden="true"
                >
                  <span className="vivid-navigation__active-line-red" />
                  <span className="vivid-navigation__active-line-pista" />
                </span>
              </a>
            ))}
          </div>

          <div ref={menuImageRef} className="vivid-navigation__image">
            <img
              ref={menuImageElementRef}
              src="/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg"
              alt="Vivid Interiors architectural interior"
            />

            <div className="vivid-navigation__image-overlay" />
          </div>

          <div ref={menuMetaRef} className="vivid-navigation__meta">
            <div>
              <span>Studio</span>
              <strong>Pune, India</strong>
            </div>

            <div>
              <span>Instagram</span>
              <strong>@vividinteriors16</strong>
            </div>

            <div>
              <span>Contact</span>
              <strong>Enquire with us</strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
