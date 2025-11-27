document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initModal();
    initMenuCategories();
    initGallery();
    initGalleryControls();
    initGalleryTouchEvents();
    initEventListeners();
    initReservationForm();
    initMap();
    initScrollAnimations();
    updateFooterYear();
});

// Карта Yandex Maps
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Контейнер карты не найден');
        return;
    }

    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API не загружен');
        return;
    }

    ymaps.ready(function() {
        const map = new ymaps.Map('map', {
            center: [59.920131, 30.29774], // Садовая ул., 66, Санкт-Петербург
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        });

        const placemark = new ymaps.Placemark([59.920131, 30.29774], {
            balloonContent: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 10px 0; color: #8B4513;">Delish</h3>
                    <p style="margin: 0 0 5px 0;">Садовая улица, д. 66</p>
                    <p style="margin: 0 0 5px 0;">Санкт-Петербург, Россия</p>
                    <p style="margin: 0; font-size: 12px; color: #7f8c8d;">59.920131° N, 30.29774° E</p>
                </div>
            `,
            hintContent: 'Delish - Ресторан узбекской кухни'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xNS41IDE2LjVMMjAgMjEuNUwyNC41IDE2LjUiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40]
        });

        map.geoObjects.add(placemark);
        placemark.balloon.open();
    });
}

// Навигация
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const logo = document.querySelector('.logo');

    sections[0]?.classList.add('active');

    // Обработчик для логотипа
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('home');
            closeMobileMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            closeMobileMenu();
        });
    });

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
            document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav')) {
            closeMobileMenu();
        }
    });

    function closeMobileMenu() {
        if (navLinksContainer) navLinksContainer.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Функция для прокрутки к секции
function scrollToSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId)?.classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Категории меню
function initMenuCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            categoryContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === category) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Модальное окно для блюд меню
function openMenuItemModal(title, price, description, weight, imageSrc) {
    const modal = document.getElementById('menuItemModal');
    const modalImage = document.getElementById('modalItemImage');
    const modalTitle = document.getElementById('modalItemTitle');
    const modalPrice = document.getElementById('modalItemPrice');
    const modalDescription = document.getElementById('modalItemDescription');
    const modalWeight = document.getElementById('modalItemWeight');

    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalDescription.textContent = description;
    modalWeight.textContent = weight;
    modalImage.src = imageSrc;
    modalImage.alt = title;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMenuItemModal() {
    const modal = document.getElementById('menuItemModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Галерея
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item) => {
        item.addEventListener('click', function() {
            const currentImageIndex = parseInt(this.getAttribute('data-index'));
            openGalleryModal(currentImageIndex);
        });
    });
}

function openGalleryModal(index) {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
    
    modalImage.src = `images/Галерея/${index}.webp`;
    modalImage.alt = `Фото ресторана ${index}`;
    
    modalImage.onerror = function() {
        this.style.display = 'none';
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            color: #7f8c8d;
            font-size: 4rem;
        `;
        tempDiv.innerHTML = '<i class="fas fa-image"></i>';
        this.parentNode.appendChild(tempDiv);
    };
    
    thumbnailsContainer.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const thumbnail = document.createElement('div');
        thumbnail.className = `gallery-thumbnail ${i === index ? 'active' : ''}`;
        thumbnail.style.background = `url('images/Галерея/${i}.webp') center/cover`;
        thumbnail.onerror = function() {
            this.style.background = '#f8f9fa';
            this.innerHTML = '<i class="fas fa-image"></i>';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = '#7f8c8d';
        };
        thumbnail.setAttribute('data-index', i);
        thumbnail.addEventListener('click', function() {
            const newIndex = parseInt(this.getAttribute('data-index'));
            changeGalleryImage(newIndex);
        });
        thumbnailsContainer.appendChild(thumbnail);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    modal.setAttribute('data-current-index', index);
    updateGalleryCounter(index);
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';
}

function changeGalleryImage(direction) {
    const modal = document.getElementById('galleryModal');
    let currentIndex = parseInt(modal.getAttribute('data-current-index') || 1);
    
    let newIndex;
    if (typeof direction === 'number') {
        newIndex = currentIndex + direction;
        if (newIndex > 8) newIndex = 1;
        if (newIndex < 1) newIndex = 8;
    } else {
        newIndex = direction;
    }
    
    const modalImage = document.getElementById('modalImage');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    modalImage.src = `images/Галерея/${newIndex}.webp`;
    modalImage.alt = `Фото ресторана ${newIndex}`;
    
    thumbnails.forEach((thumb) => {
        const thumbIndex = parseInt(thumb.getAttribute('data-index'));
        thumb.classList.remove('active');
        if (thumbIndex === newIndex) {
            thumb.classList.add('active');
        }
    });
    
    modal.setAttribute('data-current-index', newIndex);
    updateGalleryCounter(newIndex);
}

function updateGalleryCounter(index) {
    const counter = document.getElementById('galleryCounter');
    if (counter) {
        counter.textContent = `${index} / 8`;
    }
}

function initGalleryControls() {
    document.querySelector('.gallery-prev')?.addEventListener('click', function() {
        changeGalleryImage(-1);
    });
    
    document.querySelector('.gallery-next')?.addEventListener('click', function() {
        changeGalleryImage(1);
    });
}

function initGalleryTouchEvents() {
    const galleryModal = document.getElementById('galleryModal');
    let startX = 0;
    let endX = 0;

    if (!galleryModal) return;

    galleryModal.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    }, { passive: true });

    galleryModal.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeGalleryImage(1);
            } else {
                changeGalleryImage(-1);
            }
        }
    }

    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
}

// Модальное окно бронирования
function initModal() {
    const modal = document.getElementById('reservationModal');
    const closeBtn = document.querySelector('.reservation-modal .close');
    const menuItemModal = document.getElementById('menuItemModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeReservationForm);
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeReservationForm();
        }
        if (e.target === menuItemModal) {
            closeMenuItemModal();
        }
        if (e.target === document.getElementById('galleryModal')) {
            closeGalleryModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeReservationForm();
            closeMenuItemModal();
            closeGalleryModal();
        }
    });
}

// Форма бронирования
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('reservationDate');
    if (dateInput) {
        dateInput.min = today;
    }
    
    const timeInput = document.getElementById('reservationTime');
    if (timeInput) {
        timeInput.min = '11:00';
        timeInput.max = '22:30';
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateReservationForm()) {
            showNotification('Спасибо! Ваша заявка на бронирование принята. Мы свяжемся с вами для подтверждения в течение 15 минут.');
            closeReservationForm();
            this.reset();
        }
    });
}

function validateReservationForm() {
    const name = document.getElementById('reservationName');
    const phone = document.getElementById('reservationPhone');
    const date = document.getElementById('reservationDate');
    const time = document.getElementById('reservationTime');
    const guests = document.getElementById('reservationGuests');
    
    let isValid = true;
    
    [name, phone, date, time, guests].forEach(field => {
        if (field && !field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
            
            field.addEventListener('input', function() {
                this.style.borderColor = '#e1e8ed';
            });
        }
    });
    
    const phoneRegex = /^[\+]?[7-8]?[0-9\s\-\(\)]{10,}$/;
    if (phone && phone.value && !phoneRegex.test(phone.value)) {
        phone.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    return isValid;
}

function openReservationForm() {
    document.getElementById('reservationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeReservationForm() {
    document.getElementById('reservationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Обработчики событий
function initEventListeners() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                this.reset();
            }
        });
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
            input.addEventListener('input', function() {
                this.style.borderColor = '#e1e8ed';
            });
        }
    });
    
    return isValid;
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
        font-size: 0.9rem;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.feature-card, .menu-item, .team-member, .event-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Обновление года в футере
function updateFooterYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (navLinks) navLinks.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Предотвращение zoom на мобильных при фокусе
document.addEventListener('DOMContentLoaded', function() {
    let viewport = document.querySelector('meta[name="viewport"]');
    
    if (viewport && window.innerWidth <= 768) {
        window.addEventListener('focusin', function() {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        });
        
        window.addEventListener('focusout', function() {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        });
    }
});

// Оптимизация для медленных сетей
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.saveData || connection.effectiveType.includes('2g')) {
        // Отключаем некоторые тяжелые функции для медленных сетей
        const heavyElements = document.querySelectorAll('.hero-bg, .lazy-bg');
        heavyElements.forEach(el => el.style.display = 'none');
    }

}
