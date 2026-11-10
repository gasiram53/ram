document.documentElement.classList.add("js");

const revealItems = document.querySelectorAll(".reveal, .card, .project");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => {
        item.classList.add("reveal");
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach(item => item.classList.add("is-visible"));
}

const typedRole = document.querySelector(".typed-role");

if (typedRole) {
    const roles = (typedRole.dataset.roles || "").split("|").filter(Boolean);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (roles.length > 1 && !reducedMotion) {
        let roleIndex = 0;
        let characterIndex = roles[0].length;
        let deleting = true;

        const typeNextCharacter = () => {
            const role = roles[roleIndex];
            characterIndex += deleting ? -1 : 1;
            typedRole.textContent = role.slice(0, characterIndex);

            if (deleting && characterIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                window.setTimeout(typeNextCharacter, 240);
                return;
            }

            if (!deleting && characterIndex === roles[roleIndex].length) {
                deleting = true;
                window.setTimeout(typeNextCharacter, 1500);
                return;
            }

            window.setTimeout(typeNextCharacter, deleting ? 38 : 65);
        };

        window.setTimeout(typeNextCharacter, 1200);
    }
}

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        const projectCards = document.querySelectorAll(".project-card[data-category]");

        document.querySelectorAll(".filter-button").forEach(filterButton => {
            const isSelected = filterButton === button;
            filterButton.classList.toggle("is-active", isSelected);
            filterButton.setAttribute("aria-pressed", String(isSelected));
        });

        projectCards.forEach(card => {
            card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
    });
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const formData = new FormData(contactForm);
        const subject = encodeURIComponent(formData.get("subject").toString());
        const body = encodeURIComponent(
            `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`
        );

        window.location.href = `mailto:gasirampangi53@gmail.com?subject=${subject}&body=${body}`;
    });
}

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 420);
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

const yearElement = document.querySelector("#current-year");

if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    const section = href && href.startsWith("#") ? document.querySelector(href) : null;

    if (href === `${currentPage}#${currentPage}` || (currentPage === "" && href === "#home")) {
        link.setAttribute("aria-current", "page");
    }

    if (section && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                document.querySelectorAll(".nav-links a").forEach(navLink => navLink.removeAttribute("aria-current"));
                link.setAttribute("aria-current", "location");
            }
        }, { rootMargin: "-30% 0px -60% 0px" });
        sectionObserver.observe(section);
    }
});
