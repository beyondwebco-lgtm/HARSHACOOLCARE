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

  // 8. Gallery Lightbox Controller & In-Card Slider
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

  // Register AC Slider items first (all 4 photos)
  const acSlides = document.querySelectorAll('#acSliderTrack .gallery-slide');
  const acSliderCard = document.getElementById('acFittingCard');
  let acCurrentIndex = 0;

  if (acSlides.length > 0) {
    acSlides.forEach((slide, sIdx) => {
      const img = slide.querySelector('img');
      const caption = slide.getAttribute('data-caption') || 'HARSHA COOL CARE Split & Window AC Fitting';
      galleryItems.push({
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : '',
        title: `Split & Window AC Fitting (${sIdx + 1}/4)`,
        category: '❄️ AC Installation & Repairing'
      });
    });

    if (acSliderCard) {
      acSliderCard.addEventListener('click', (e) => {
        // Only open lightbox if not clicking slider nav buttons or dots
        if (!e.target.closest('.slider-nav-btn') && !e.target.closest('.slider-dot')) {
          openLightbox(acCurrentIndex);
        }
      });

      acSliderCard.setAttribute('tabindex', '0');
      acSliderCard.setAttribute('role', 'button');
      acSliderCard.setAttribute('aria-label', 'View Split & Window AC Fitting photos in lightbox');
      acSliderCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(acCurrentIndex);
        }
      });
    }
  }

  // Register all other standard gallery cards
  const standardCards = document.querySelectorAll('.gallery-card:not(.gallery-card-slider)');
  standardCards.forEach((card) => {
    const imgElem = card.querySelector('.gallery-img-wrapper img');
    const titleElem = card.querySelector('.gallery-title');
    const catElem = card.querySelector('.gallery-label-pill');
    const itemIndex = galleryItems.length;

    galleryItems.push({
      src: imgElem ? imgElem.getAttribute('src') : '',
      alt: imgElem ? imgElem.getAttribute('alt') : '',
      title: titleElem ? titleElem.textContent.trim() : '',
      category: catElem ? catElem.textContent.trim() : ''
    });

    card.addEventListener('click', () => {
      openLightbox(itemIndex);
    });

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${titleElem ? titleElem.textContent.trim() : 'photo'} in lightbox`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(itemIndex);
      }
    });
  });

  // In-Card Slider Navigation Controls (Arrows, Dots, Counter, Swipe)
  const acPrev = document.getElementById('acSliderPrev');
  const acNext = document.getElementById('acSliderNext');
  const acCounter = document.getElementById('acSliderCounter');
  const acDots = document.querySelectorAll('#acSliderDots .slider-dot');
  const acSubtext = document.getElementById('acSliderSubtext');

  function showAcSlide(index) {
    if (!acSlides || acSlides.length === 0) return;
    if (index >= acSlides.length) index = 0;
    if (index < 0) index = acSlides.length - 1;
    acCurrentIndex = index;

    acSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === acCurrentIndex);
    });

    acDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === acCurrentIndex);
    });

    if (acCounter) {
      acCounter.textContent = `${acCurrentIndex + 1} / ${acSlides.length} Photos`;
    }

    if (acSubtext && acSlides[acCurrentIndex]) {
      const cap = acSlides[acCurrentIndex].getAttribute('data-caption');
      if (cap) acSubtext.textContent = cap;
    }
  }

  if (acNext) {
    acNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showAcSlide(acCurrentIndex + 1);
    });
  }

  if (acPrev) {
    acPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showAcSlide(acCurrentIndex - 1);
    });
  }

  acDots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      showAcSlide(i);
    });
  });

  // Touch Swipe for mobile one-by-one scrolling
  let touchStartX = 0;
  let touchEndX = 0;
  if (acSliderCard) {
    acSliderCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    acSliderCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        showAcSlide(acCurrentIndex + 1);
      } else if (touchEndX - touchStartX > 40) {
        showAcSlide(acCurrentIndex - 1);
      }
    }, { passive: true });
  }

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

