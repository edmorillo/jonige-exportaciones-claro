// 1. CONTROLADOR DE PESTAÑAS INDEPENDIENTE POR SECCIÓN (PRODUCTO Y OPERACIONES)
function openTab(evt, tabId) {
    const parentSection = evt.currentTarget.closest('section');

    const tabPanes = parentSection.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));

    const tabBtns = parentSection.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// 2. EFECTO NAVBAR AL HACER SCROLL
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 40) {
            navbar.style.borderBottomColor = 'rgba(194, 167, 92, 0.3)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        }
    }
});

// 3. MENÚ A PANTALLA COMPLETA (ESTILO VIDEO 1)
const mobileMenuBtn = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu');
const fullscreenMenu = document.getElementById('fullscreen-menu');
const closeLinks = document.querySelectorAll('.fs-close-link');

if (mobileMenuBtn && fullscreenMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        fullscreenMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita que el fondo se mueva con el menú abierto
    });
}

if (closeMenuBtn && fullscreenMenu) {
    closeMenuBtn.addEventListener('click', () => {
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

closeLinks.forEach(link => {
    link.addEventListener('click', () => {
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// 4. CARRUSEL DE PORTADA CON CONTROLES Y PAUSA (ESTILO VIDEO 2)
const slides = document.querySelectorAll('.hero-slide');
const bars = document.querySelectorAll('.slider-bar');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const pauseBtn = document.getElementById('pause-slide');
const pauseIcon = document.getElementById('pause-icon');

let currentSlide = 0;
let isPaused = false;
let slideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    bars.forEach((bar, i) => {
        bar.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

function startSlider() {
    slideInterval = setInterval(() => {
        if (!isPaused) {
            nextSlide();
        }
    }, 5500);
}

function resetTimer() {
    clearInterval(slideInterval);
    startSlider();
}

if (slides.length > 0) {
    startSlider();

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        if (isPaused) {
            pauseIcon.classList.remove('fa-pause');
            pauseIcon.classList.add('fa-play');
        } else {
            pauseIcon.classList.remove('fa-play');
            pauseIcon.classList.add('fa-pause');
        }
    });

    bars.forEach((bar, index) => {
        bar.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });
}

// 5. MOTOR DE ENVÍO CON ASUNTO DINÁMICO Y MAQUETA HTML (VÍA EMAILJS)
const rfqForm = document.getElementById('rfq-form');

if (rfqForm) {
    rfqForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = rfqForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;

        // 1. Armar el Asunto Dinámico según lo que eligió en el listado
        const lineaElegida = document.getElementById('linea_interes').value;
        const nombreCliente = rfqForm.querySelector('[name="nombre"]').value;
        const empresaPais = rfqForm.querySelector('[name="empresa_pais"]').value;
        const inputAsunto = document.getElementById('asunto_dinamico');

        if (lineaElegida === 'Madera Tropical') {
            inputAsunto.value = `🪵 [Cotización Madera] Solicitud de ${nombreCliente} (${empresaPais})`;
        } else if (lineaElegida === 'Camarón Vannamei') {
            inputAsunto.value = `🦐 [Cotización Camarón] Solicitud de ${nombreCliente} (${empresaPais})`;
        } else {
            inputAsunto.value = `📦 [Exportación Frescos - Al Kilo] Solicitud de ${nombreCliente} (${empresaPais})`;
        }

        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando solicitud...';
        submitBtn.disabled = true;

        try {
            // Envío a través de EmailJS con tu maqueta HTML personalizada
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
                method: 'POST',
                body: (() => {
                    const formData = new FormData(rfqForm);
                    formData.append('service_id', 'service_ic588fk');
                    formData.append('template_id', 'template_4ksf5cu');
                    formData.append('user_id', '-_MVByZp5Z3SMmXT3');
                    return formData;
                })()
            });

            if (response.ok) {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Solicitud Enviada con Éxito!';
                submitBtn.style.backgroundColor = '#25D366';
                submitBtn.style.color = '#07101E';
                rfqForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 5000);
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error al enviar. Intente nuevamente';
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
            }, 4000);
        }
    });
} 

// 6. EFECTO DE APARICIÓN AL BAJAR (SCROLL REVEAL AUTOMÁTICO)
document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll(
        '.stat-card, .section-header-center, .about-text-col, .about-highlight-card, .val-box, .spec-card, .step-card, .gallery-card-dental, .agency-card, .ag-feat, .footer-col-main, .footer-col-form'
    );

    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal-item');
        // Efecto escalonado suave para elementos en la misma fila
        const delay = (index % 3) * 0.1;
        el.style.transitionDelay = `${delay}s`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Se anima una sola vez y queda fijo
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));
});