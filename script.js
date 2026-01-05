document.addEventListener('DOMContentLoaded', () => {
  

    // 2. ANIMACIONES AL HACER SCROLL (REVELAR)
   
    const observerOptions = { threshold: 0.1 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    // Seleccion todos los elementos a animar
    const elementsToAnimate = document.querySelectorAll('.model-card, .section-title, .gallery-item, .contact-wrapper, .hero-content');
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal-hidden'); // Asegura que empiecen invisibles
        scrollObserver.observe(el);
    });

    // ==========================================
    // 6. LIGHTBOX Y LOGOUT
    // ==========================================
    const gallery = document.getElementById('gallery');
    if(gallery) {
        gallery.addEventListener('click', (e) => {
            if(e.target.tagName === 'IMG') {
                document.getElementById('lightbox-img').src = e.target.src;
                document.getElementById('lightbox').style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    const closeLightbox = document.querySelector('.close-lightbox');
    if(closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            document.getElementById('lightbox').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

const form = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault(); // Evita que la página se recargue
    const status = document.createElement("p");
    status.style.marginTop = "10px";
    status.style.fontWeight = "bold";

    const data = new FormData(event.target);
    
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "¡Gracias por contactarnos! Te responderemos a la brevedad.";
            status.style.color = "var(--success)";
            form.reset(); // Limpia el formulario
        } else {
            status.innerHTML = "Ups! Hubo un problema, por favor reintentá.";
            status.style.color = "red";
        }
        form.appendChild(status);
    }).catch(error => {
        status.innerHTML = "Error de conexión.";
        form.appendChild(status);
    });
}

form.addEventListener("submit", handleSubmit);

function openModal(id) {
    document.getElementById(id).style.display = "block";
    document.body.style.overflow = "hidden"; // Evita que se pueda scrollear la web de fondo
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
    document.body.style.overflow = "auto"; // Devuelve el scroll
}

// Cerrar si el usuario hace click fuera de la caja blanca
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}
