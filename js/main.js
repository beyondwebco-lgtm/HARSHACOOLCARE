/**
 * HARSHACOOLCARE - Official JavaScript
 * Fast, lightweight, zero-dependency vanilla JS for interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      const isExpanded = mobileToggle.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Active Navigation Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const handleScroll = () => {
    const scrollY = window.pageYOffset;
    const headerHeight = 90;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 3. Quick Booking / WhatsApp Message Generator
  const bookingForm = document.getElementById('serviceBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = document.getElementById('formService').value || 'Home Appliance Service';
      const name = document.getElementById('formName').value.trim() || 'Customer';
      const area = document.getElementById('formArea').value.trim() || 'Khammam';
      const details = document.getElementById('formDetails').value.trim() || 'General service inquiry';

      const message = `Hello HarshaCoolCare! 🛠️\n\nI need service assistance for my appliance.\n\n*Service:* ${service}\n*Customer Name:* ${name}\n*Location/Area:* ${area}\n*Problem / Details:* ${details}\n\nPlease let me know technician availability and estimated time. Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917794080383?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // 4. Quick Pre-fill Service from Service Cards
  window.selectServiceAndScroll = function(serviceName) {
    const selectElem = document.getElementById('formService');
    const contactSection = document.getElementById('contact');

    if (selectElem) {
      for (let i = 0; i < selectElem.options.length; i++) {
        if (selectElem.options[i].text.includes(serviceName) || selectElem.options[i].value.includes(serviceName)) {
          selectElem.selectedIndex = i;
          break;
        }
      }
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Flash highlight on the form
      const formCard = document.querySelector('.service-widget-card');
      if (formCard) {
        formCard.style.outline = '3px solid #0284c7';
        setTimeout(() => {
          formCard.style.outline = 'none';
        }, 1500);
      }
    }
  };

  // 5. Copy Phone Number to Clipboard with Toast
  window.copyPhoneNumber = function(e) {
    if (e) e.preventDefault();
    const phone = '7794080383';
    navigator.clipboard.writeText(phone).then(() => {
      showToast('Copied 7794080383 to clipboard!');
    }).catch(() => {
      window.location.href = `tel:${phone}`;
    });
  };

  function showToast(msg) {
    let toast = document.getElementById('copyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'copyToast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 6. Smooth Scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Simple Fade-In on Scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .appliance-deal-card, .why-card, .buy-sell-banner, .contact-info-card, .service-widget-card, .gallery-card').forEach(el => {
    observer.observe(el);
  });

  // 8. Gallery Lightbox Controller
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryItems = [];

  galleryCards.forEach((card, index) => {
    const imgElem = card.querySelector('.gallery-img-wrapper img');
    const titleElem = card.querySelector('.gallery-title');
    const catElem = card.querySelector('.gallery-label-pill');

    galleryItems.push({
      src: imgElem ? imgElem.getAttribute('src') : '',
      alt: imgElem ? imgElem.getAttribute('alt') : '',
      title: titleElem ? titleElem.textContent.trim() : '',
      category: catElem ? catElem.textContent.trim() : ''
    });

    card.addEventListener('click', () => {
      openLightbox(index);
    });

    // Keyboard support for accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${titleElem ? titleElem.textContent.trim() : 'photo'} in lightbox`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    if (!lightbox || !galleryItems[index]) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryItems[currentGalleryIndex];
    if (!item) return;
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt || item.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCategory) lightboxCategory.textContent = item.category;
  }

  function nextGalleryItem() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function prevGalleryItem() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextGalleryItem(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevGalleryItem(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextGalleryItem();
    else if (e.key === 'ArrowLeft') prevGalleryItem();
  });

  // 9. Gallery Filter Tabs Controller
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const cardCat = card.getAttribute('data-category') || 'all';
          if (filterVal === 'all' || cardCat.includes(filterVal)) {
            card.classList.remove('hide');
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
  }
});

