/* app.js
   Combined header and page behavior for the recreated site.
   This file replaces separate header/component logic and page script logic.
*/

const APP = (() => {
  const isElement = (value) => value instanceof Element;

  const scrollToSection = (hash) => {
    if (!hash || !hash.startsWith('#')) return;
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const initHeaderBehavior = () => {
    const innerWrapper = document.querySelector('.header-nav');
    const centerEl = document.querySelector('#header .title-logo-wrapper h1');
    const checkbox = document.getElementById('mobileNavToggle');
    const desktopScrollNav = document.querySelector('.show-on-scroll');
    const mobileScrollToggle = document.querySelector('.show-on-scroll-mobile');
    const navLinks = document.querySelectorAll('#mainNavigation a, #mobileNavigation a');

    if (!innerWrapper || !centerEl) return;

    const hasAttachedClass = () =>
      innerWrapper.closest('.show-on-scroll.attach') !== null;

    const centerNav = () => {
      if (hasAttachedClass()) {
        innerWrapper.style.setProperty('--half-center-width', '0');
        return;
      }

      const navItems = document.querySelectorAll('#mainNavigation > div');
      const header = document.getElementById('header');
      const headerPadding = 30;
      const wrapperWidth = header ? header.offsetWidth - 2 * headerPadding : 0;
      const centerElWidth = centerEl.offsetWidth;
      const navSpace = wrapperWidth - centerElWidth;

      let leftWidth = 0;
      let rightWidth = 0;
      if (navItems.length > 1) {
        const split = Math.floor(navItems.length / 2);
        leftWidth = Array.from(navItems)
          .slice(0, split)
          .reduce((sum, item) => sum + item.offsetWidth, 0);
        rightWidth = Array.from(navItems)
          .slice(split)
          .reduce((sum, item) => sum + item.offsetWidth, 0);
      }

      if (window.innerWidth <= 972 || leftWidth > navSpace - 12 || rightWidth > navSpace - 12) {
        innerWrapper.style.setProperty('--half-center-width', '0');
      } else {
        innerWrapper.style.setProperty('--half-center-width', `${centerElWidth / 2}px`);
      }
    };

    const setAttachState = () => {
      const scrolled = window.scrollY > 120;
      if (desktopScrollNav) {
        desktopScrollNav.classList.toggle('attach', scrolled && window.innerWidth > 768);
      }
      if (mobileScrollToggle) {
        mobileScrollToggle.classList.toggle('attach', scrolled && window.innerWidth <= 768);
      }
      centerNav();
      updateActiveSection();
    };

    const updateActiveSection = () => {
      const sections = Array.from(document.querySelectorAll('main section[id]'));
      if (!sections.length) return;

      const offset = Math.max(window.innerHeight * 0.2, 120);
      const scrollPosition = window.scrollY + offset;
      let activeSectionId = sections[0].id;

      sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition) {
          activeSectionId = section.id;
        }
      });

      navLinks.forEach((link) => {
        const parent = link.closest('div');
        if (!parent) return;
        const linkHref = link.getAttribute('href');
        parent.classList.toggle('active', linkHref === `#${activeSectionId}`);
      });
    };

    const closeMobileNav = () => {
      if (!checkbox) return;
      checkbox.checked = false;
      document.body.classList.remove('mobile-nav-open');
    };

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (hash && hash.startsWith('#') && document.querySelector(hash)) {
          event.preventDefault();
          scrollToSection(hash);
        }
        closeMobileNav();
      });
    });

    if (checkbox) {
      checkbox.addEventListener('change', () => {
        document.body.classList.toggle('mobile-nav-open', checkbox.checked);
      });
    }

    window.addEventListener('resize', setAttachState);
    window.addEventListener('scroll', setAttachState);
    setAttachState();
  };

  const initPageBehavior = () => {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (isElement(menuToggle) && isElement(mainNav)) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.hash;
        if (hash && document.querySelector(hash)) {
          event.preventDefault();
          scrollToSection(hash);
          if (mainNav) mainNav.classList.remove('open');
          if (isElement(menuToggle)) {
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    const form = document.getElementById('contactForm');
    if (isElement(form)) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('This is a static demo page. The contact form is not connected to a backend.');
      });
    }
  };

  const init = () => {
    initHeaderBehavior();
    initPageBehavior();
  };

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', APP.init);
} else {
  APP.init();
}
