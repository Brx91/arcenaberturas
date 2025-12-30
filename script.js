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
