document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONFIGURACIÓN Y LOGIN
    // ==========================================
    const PASS_CORRECTA = "1234";
    let cotizacionActual = [];

    const btnEntrar = document.getElementById('btn-entrar');
    if(btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            const pass = document.getElementById('admin-pass').value;
            if(pass === PASS_CORRECTA) {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('price-manager').style.display = 'block';
                renderPrices();
            } else {
                alert("Clave incorrecta");
            }
        });
    }

    // ==========================================
    // 2. ANIMACIONES AL HACER SCROLL (REVELAR)
    // ==========================================
    const observerOptions = { threshold: 0.1 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    // Seleccionamos todos los elementos que queremos que se animen
    const elementsToAnimate = document.querySelectorAll('.model-card, .section-title, .gallery-item, .contact-wrapper, .hero-content');
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal-hidden'); // Asegura que empiecen invisibles
        scrollObserver.observe(el);
    });

    // ==========================================
    // 3. TABS DEL PANEL (GESTIÓN / COTIZADOR)
    // ==========================================
    const btnTabGestion = document.getElementById('btn-tab-gestion');
    const btnTabCotizador = document.getElementById('btn-tab-cotizador');

    if(btnTabGestion) {
        btnTabGestion.addEventListener('click', () => {
            document.getElementById('tab-gestion').style.display = 'block';
            document.getElementById('tab-cotizador').style.display = 'none';
            btnTabGestion.classList.add('active');
            btnTabCotizador.classList.remove('active');
        });
    }

    if(btnTabCotizador) {
        btnTabCotizador.addEventListener('click', () => {
            document.getElementById('tab-gestion').style.display = 'none';
            document.getElementById('tab-cotizador').style.display = 'block';
            btnTabCotizador.classList.add('active');
            btnTabGestion.classList.remove('active');
            actualizarSelect();
        });
    }

    // ==========================================
    // 4. GESTIÓN DE PRECIOS
    // ==========================================
    const btnAddPrice = document.getElementById('btn-add-price');
    
    function renderPrices() {
        const listUl = document.getElementById('price-list-ul');
        if(!listUl) return;
        const prices = JSON.parse(localStorage.getItem('preciosCarp')) || [];
        listUl.innerHTML = prices.map((p, i) => `
            <li style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding:5px; background: #fff;">
                <span><strong>${p.item}</strong>: $${p.value}</span>
                <button class="delete-p" data-index="${i}" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;">Eliminar</button>
            </li>
        `).join('');

        // Listeners para los botones de borrar recien creados
        document.querySelectorAll('.delete-p').forEach(btn => {
            btn.onclick = (e) => {
                const index = e.target.getAttribute('data-index');
                let ps = JSON.parse(localStorage.getItem('preciosCarp'));
                ps.splice(index, 1);
                localStorage.setItem('preciosCarp', JSON.stringify(ps));
                renderPrices();
            };
        });
    }

    if(btnAddPrice) {
        btnAddPrice.addEventListener('click', () => {
            const item = document.getElementById('price-item').value;
            const value = document.getElementById('price-value').value;
            if(item && value) {
                let ps = JSON.parse(localStorage.getItem('preciosCarp')) || [];
                ps.push({item, value: parseFloat(value)});
                localStorage.setItem('preciosCarp', JSON.stringify(ps));
                document.getElementById('price-item').value = '';
                document.getElementById('price-value').value = '';
                renderPrices();
            } else {
                alert("Completa nombre y precio");
            }
        });
    }

    // ==========================================
    // 5. LÓGICA DEL COTIZADOR
    // ==========================================
    function actualizarSelect() {
        const select = document.getElementById('select-producto');
        if(!select) return;
        const prices = JSON.parse(localStorage.getItem('preciosCarp')) || [];
        if(prices.length === 0) {
            select.innerHTML = '<option value="">No hay productos cargados</option>';
        } else {
            select.innerHTML = prices.map(p => `<option value="${p.value}">${p.item}</option>`).join('');
        }
    }

    const btnAddCotiz = document.getElementById('btn-add-cotiz');
    if(btnAddCotiz) {
        btnAddCotiz.addEventListener('click', () => {
            const select = document.getElementById('select-producto');
            if(!select || !select.value) return;
            const nombre = select.options[select.selectedIndex].text;
            const precio = parseFloat(select.value);
            const qty = parseInt(document.getElementById('cotiz-qty').value);
            
            cotizacionActual.push({nombre, qty, sub: precio * qty});
            renderCotizacion();
        });
    }

    function renderCotizacion() {
        const body = document.getElementById('cotizacion-body');
        let total = 0;
        body.innerHTML = cotizacionActual.map((item, i) => {
            total += item.sub;
            return `<tr>
                <td>${item.nombre}</td>
                <td>${item.qty}</td>
                <td>$${item.sub}</td>
                <td><button onclick="window.removeCotizItem(${i})" style="color:red; border:none; background:none; cursor:pointer;">X</button></td>
            </tr>`;
        }).join('');
        document.getElementById('total-general').innerText = total.toLocaleString();
    }

    // Función global para que el botón de la tabla funcione
    window.removeCotizItem = (i) => {
        cotizacionActual.splice(i, 1);
        renderCotizacion();
    };

    const btnClearCotiz = document.getElementById('btn-clear-cotiz');
    if(btnClearCotiz) {
        btnClearCotiz.addEventListener('click', () => {
            cotizacionActual = [];
            renderCotizacion();
        });
    }

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

    const btnLogout = document.getElementById('btn-logout');
    if(btnLogout) {
        btnLogout.addEventListener('click', () => {
            location.reload();
        });
    }
});