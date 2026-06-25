(function () {
    "use strict";

    document.documentElement.classList.add("js");

    function initHeaderShadow() {
        const header = document.querySelector("[data-site-header]");
        if (!header) return;

        let isScrolled = null;
        let ticking = false;

        const updateHeader = () => {
            const nextIsScrolled = window.scrollY > 8;

            if (nextIsScrolled !== isScrolled) {
                header.classList.toggle("is-scrolled", nextIsScrolled);
                isScrolled = nextIsScrolled;
            }

            ticking = false;
        };

        updateHeader();
        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;
                ticking = true;
                window.requestAnimationFrame(updateHeader);
            },
            { passive: true }
        );
    }

    function initReveal() {
        const revealItems = document.querySelectorAll("[data-reveal]");
        if (!revealItems.length) return;

        if (!("IntersectionObserver" in window)) {
            revealItems.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                rootMargin: "0px 0px -10% 0px",
                threshold: 0.16
            }
        );

        revealItems.forEach((item) => observer.observe(item));
    }

    function initExpandableCards() {
        document.querySelectorAll(".person-card--expandable").forEach((card) => {
            const button = card.querySelector(".expand-btn");
            const body = card.querySelector(".person-card__body");
            if (!button || !body) return;

            button.addEventListener("click", () => {
                const isOpen = card.classList.toggle("is-open");
                button.setAttribute("aria-expanded", String(isOpen));
                body.setAttribute("aria-hidden", String(!isOpen));
            });
        });
    }

    function initContactForm() {
        const form = document.getElementById("nmp-contact-form");
        if (!form) return;

        const endpoint = form.getAttribute("action") || "https://formspree.io/f/mpqblbje";
        const submitButton = form.querySelector("[data-fs-submit-btn]");
        const status = form.querySelector("[data-form-status]");
        const modal = document.getElementById("nmp-success-modal");
        const modalCloseItems = modal ? modal.querySelectorAll("[data-modal-close]") : [];
        let lastFocusedElement = null;

        function setStatus(type, message) {
            if (!status) return;
            status.textContent = message;
            status.className = "form-status is-visible";
            status.classList.add(type === "success" ? "is-success" : "is-error");
        }

        function clearStatus() {
            if (!status) return;
            status.textContent = "";
            status.className = "form-status";
        }

        function setSubmitting(isSubmitting) {
            if (!submitButton) return;
            submitButton.disabled = isSubmitting;
            submitButton.textContent = isSubmitting ? "Sending..." : "Send Message";
        }

        function getFocusableModalItems() {
            if (!modal) return [];
            return Array.from(
                modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((item) => !item.hasAttribute("disabled") && item.offsetParent !== null);
        }

        function openModal() {
            if (!modal) return;
            lastFocusedElement = document.activeElement;
            modal.hidden = false;
            document.body.style.overflow = "hidden";

            window.setTimeout(() => {
                const closeButton = document.getElementById("nmp-close-modal-btn");
                if (closeButton) closeButton.focus();
            }, 0);
        }

        function closeModal() {
            if (!modal || modal.hidden) return;
            modal.hidden = true;
            document.body.style.overflow = "";

            if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
                lastFocusedElement.focus();
            }
        }

        modalCloseItems.forEach((item) => item.addEventListener("click", closeModal));

        window.addEventListener("keydown", (event) => {
            if (!modal || modal.hidden) return;

            if (event.key === "Escape") {
                closeModal();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = getFocusableModalItems();
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearStatus();

            if (!form.reportValidity()) {
                return;
            }

            setSubmitting(true);

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        Accept: "application/json"
                    },
                    body: new FormData(form)
                });

                if (!response.ok) {
                    let message = "Something went wrong. Please try again.";

                    try {
                        const data = await response.json();
                        if (Array.isArray(data.errors) && data.errors.length) {
                            message = data.errors.map((error) => error.message).join(", ");
                        }
                    } catch (error) {
                        message = "Something went wrong. Please try again.";
                    }

                    setStatus("error", message);
                    return;
                }

                form.reset();
                setStatus("success", "Message sent successfully. Thank you for reaching out to NMP.");
                openModal();
            } catch (error) {
                setStatus("error", "Network error. Please check your connection and try again.");
            } finally {
                setSubmitting(false);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initHeaderShadow();
        initReveal();
        initExpandableCards();
        initContactForm();
    });
})();
