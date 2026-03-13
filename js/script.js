// =========================
// FORMULARIO DE CONTACTO
// =========================
const form = document.getElementById("contactForm");
const submitButton = document.getElementById("contactSubmit");
const statusMessage = document.getElementById("contactStatus");

function showError(input, message) {
    input.classList.add("error");
    const errorElement = input.parentElement.querySelector(".cta-form__error");

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(input) {
    input.classList.remove("error");
    const errorElement = input.parentElement.querySelector(".cta-form__error");

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setStatus(message, type = "") {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.classList.remove("success", "error");

    if (type) {
        statusMessage.classList.add(type);
    }
}

function setLoading(isLoading) {
    if (!submitButton) return;

    submitButton.disabled = isLoading;
    submitButton.classList.toggle("is-loading", isLoading);
}

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let valid = true;
        let firstErrorField = null;

        const nombre = document.getElementById("nombre");
        const empresa = document.getElementById("empresa");
        const email = document.getElementById("email");
        const telefono = document.getElementById("telefono");
        const mensaje = document.getElementById("mensaje");

        const fields = [nombre, empresa, email, telefono, mensaje];

        fields.forEach((field) => clearError(field));
        setStatus("");

        if (!nombre.value.trim()) {
            showError(nombre, "Ingresá tu nombre.");
            if (!firstErrorField) firstErrorField = nombre;
            valid = false;
        }

        if (!empresa.value.trim()) {
            showError(empresa, "Ingresá el nombre de la empresa.");
            if (!firstErrorField) firstErrorField = empresa;
            valid = false;
        }

        if (!email.value.trim()) {
            showError(email, "Ingresá tu email.");
            if (!firstErrorField) firstErrorField = email;
            valid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, "Ingresá un email válido.");
            if (!firstErrorField) firstErrorField = email;
            valid = false;
        }

        if (!telefono.value.trim()) {
            showError(telefono, "Ingresá tu teléfono.");
            if (!firstErrorField) firstErrorField = telefono;
            valid = false;
        }

        if (!mensaje.value.trim()) {
            showError(mensaje, "Contanos brevemente sobre tu proyecto.");
            if (!firstErrorField) firstErrorField = mensaje;
            valid = false;
        }

        if (!valid) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            return;
        }

        setLoading(true);
        setStatus("Enviando mensaje...");

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            const result = await response.json();

            if (result.success) {
                setStatus("Mensaje enviado correctamente. Te responderemos a la brevedad.", "success");
                form.reset();
            } else {
                setStatus(result.message || "No se pudo enviar el mensaje. Probá nuevamente.", "error");
            }
        } catch (error) {
            setStatus("Ocurrió un error al enviar el mensaje. Probá nuevamente.", "error");
        } finally {
            setLoading(false);
        }
    });
}
//SCROLL SUAVE 
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach((el) => {
    revealObserver.observe(el);
});


//abrir/cerrar el menú
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("is-active");
        mainNav.classList.toggle("is-open");

        const expanded = navToggle.classList.contains("is-active");
        navToggle.setAttribute("aria-expanded", expanded);
    });

    // Cerrar menú al tocar un link en mobile
    const navLinks = mainNav.querySelectorAll(".main-nav__link");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("is-active");
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

//Botón para volver arriba solo mobile
document.addEventListener("DOMContentLoaded", () => {
    const scrollTopBtn = document.querySelector(".scroll-top");
    if (!scrollTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 600) {
            scrollTopBtn.classList.add("is-visible");
        } else {
            scrollTopBtn.classList.remove("is-visible");
        }
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});


// envío de mail a Gmail web en desktop y mailto normal en mobile
(() => {
    const EMAIL = "info@libercle.com";
    const DEFAULT_SUBJECT = "Consulta Web";
    const DEFAULT_BODY = "Hola LiberClé, quiero hacer una consulta.";

    const enc = encodeURIComponent;

    const gmailCompose = (subject, body) =>
        `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(EMAIL)}&su=${enc(subject)}&body=${enc(body)}`;

    const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const parseMailto = (href) => {
        const out = { subject: DEFAULT_SUBJECT, body: DEFAULT_BODY };

        try {
            const q = href.split("?")[1];
            if (!q) return out;

            const params = new URLSearchParams(q);

            if (params.get("subject")) out.subject = params.get("subject");
            if (params.get("body")) out.body = params.get("body");

            return out;
        } catch {
            return out;
        }
    };

    document.querySelectorAll(".js-email-link").forEach((el) => {
        el.addEventListener("click", (e) => {
            if (isMobile()) return;

            const href = el.getAttribute("href") || "";
            if (!href.startsWith("mailto:")) return;

            const { subject, body } = parseMailto(href);

            e.preventDefault();
            window.open(gmailCompose(subject, body), "_blank", "noopener,noreferrer");
        });
    });
})();


/*para parallax*/

  (function () {
    const visual = document.getElementById('heroParallax');
    if (!visual || window.matchMedia('(max-width: 768px)').matches) return;

    const layers = visual.querySelectorAll('[data-depth]');

    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || 0.08);
        const moveX = x * depth * 42;
        const moveY = y * depth * 42;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    visual.addEventListener('mouseleave', () => {
      layers.forEach(layer => {
        layer.style.transform = 'translate3d(0,0,0)';
      });
    });
  })();


  