import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import "./navigation.css";

const menuItems = [
  { number: "01", label: "Home", href: "#home" },
  { number: "02", label: "About", href: "#about" },
  { number: "03", label: "Expertise", href: "#services" },
  { number: "04", label: "Sectors", href: "#sectors" },
  { number: "05", label: "Projects", href: "#projects" },
  { number: "06", label: "Contact", href: "#contact" },
];

type NavTheme = "light" | "dark";

/** Luminance (0–1) of a computed CSS colour, or null if transparent/unparsable. */
function luminanceOf(color: string): number | null {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1]
    .split(/[ ,/]+/)
    .filter(Boolean)
    .map(Number);
  if (a < 0.5) return null;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  // true from the moment the menu opens until its close animation finishes
  const [panelShown, setPanelShown] = useState(false);
  // colour of the page content sitting underneath the bar
  const [pageTone, setPageTone] = useState<"light" | "dark">("light");

  const navigationRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const menuMetaRef = useRef<HTMLDivElement>(null);
  const menuImageRef = useRef<HTMLDivElement>(null);
  const menuImageElementRef = useRef<HTMLImageElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

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
      gsap.set(menuPanel, { yPercent: -100 });
      gsap.set(menuItemsElement.children, { yPercent: 110, opacity: 0 });
      gsap.set(menuMeta, { opacity: 0, y: 20 });
      gsap.set(menuImage, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(menuImageElement, { scale: 1.15 });

      menuTimelineRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out" },
        onReverseComplete: () => {
          document.body.classList.remove("menu-open");
          setPanelShown(false);
        },
      });

      menuTimelineRef.current
        .to(menuPanel, { yPercent: 0, duration: 0.9 })
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
          { scale: 1, duration: 1.3, ease: "power3.out" },
          "<",
        )
        .to(
          menuItemsElement.children,
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07 },
          "-=0.75",
        )
        .to(menuMeta, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45");
    }, navigationRef);

    return () => {
      menuTimelineRef.current?.kill();
      context.revert();
    };
  }, []);

  /* ---------- adapt bar colour to whatever is behind it ---------- */
  useEffect(() => {
    let raf = 0;

    const detect = () => {
      raf = 0;
      const bar = barRef.current;
      const nav = navigationRef.current;
      if (!bar || !nav) return;

      const y = Math.min(bar.offsetHeight / 2, window.innerHeight - 1);
      const stack = document.elementsFromPoint(window.innerWidth / 2, y);
      const under = stack.find((el) => !nav.contains(el));
      if (!under) return;

      // 1) explicit override: <section data-nav-theme="light" | "dark">
      const flagged = under.closest<HTMLElement>("[data-nav-theme]");
      if (flagged) {
        setPageTone(flagged.dataset.navTheme === "dark" ? "dark" : "light");
        return;
      }

      // 2) otherwise read the first solid background colour going up the tree
      let node: Element | null = under;
      while (node) {
        const lum = luminanceOf(getComputedStyle(node).backgroundColor);
        if (lum !== null) {
          setPageTone(lum < 0.45 ? "dark" : "light");
          return;
        }
        node = node.parentElement;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(detect);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  const openMenu = () => {
    document.body.classList.add("menu-open");
    setIsOpen(true);
    setPanelShown(true);

    requestAnimationFrame(() => {
      menuTimelineRef.current?.play();
    });
  };

  const closeMenu = useCallback(() => {
    menuButtonRef.current?.focus();
    menuTimelineRef.current?.reverse();
    setIsOpen(false);
  }, []);

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

  const handleMenuItemClick = (href: string) => {
    closeMenu();

    window.setTimeout(() => {
      const target = document.querySelector(href);

      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 700);
  };

  const handleMenuHover = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget.dataset.image;

    if (!target || !menuImageElementRef.current) {
      return;
    }

    menuImageElementRef.current.src = target;
  };

  // While the black menu panel is on screen the bar must be white-on-black
  const theme: NavTheme = panelShown
    ? "dark"
    : pageTone === "light"
      ? "light"
      : "dark";

  return (
    <header ref={navigationRef} className="vivid-navigation" data-theme={theme}>
      <div ref={barRef} className="vivid-navigation__bar">
        <a
          href="#home"
          className="vivid-navigation__brand"
          aria-label="Vivid Interiors home"
        >
          <img
            src="/vivid-logo.png"
            alt="Vivid Interiors"
            className="vivid-navigation__mark"
          />

          <span className="vivid-navigation__brand-text">Vivid Interiors</span>
        </a>

        <div className="vivid-navigation__actions">
          <a href="#contact" className="vivid-navigation__enquire">
            <span>Enquire</span>
            <i />
          </a>

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
                data-image="/images/01_Emirus_801/01_07_emirus_801_baner_pune_p010.jpeg"
                onClick={(event) => {
                  event.preventDefault();
                  handleMenuItemClick(item.href);
                }}
                onMouseEnter={handleMenuHover}
              >
                <span className="vivid-navigation__number">{item.number}</span>

                <span className="vivid-navigation__label">{item.label}</span>

                <span className="vivid-navigation__arrow">↗</span>
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
