const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

function closeMobileMenu({ focusToggle = false } = {}) {
  if (!menuToggle || !menu) {
    return;
  }

  menuToggle.setAttribute('aria-expanded', 'false');
  menu.classList.remove('show');

  if (focusToggle) {
    menuToggle.focus();
  }
}

function trackConversion(eventName, eventData = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
    return;
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...eventData });
  }
}

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
  menuToggle.setAttribute('aria-expanded', !expanded);
  menu.classList.toggle('show');
});

// Close menu when clicking outside of menu/toggle
document.addEventListener('click', (event) => {
  if (!menu.classList.contains('show')) {
    return;
  }

  const clickTarget = event.target;
  const clickedInsideMenu = menu.contains(clickTarget);
  const clickedToggle = menuToggle.contains(clickTarget);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMobileMenu();
  }
});

// Close menu when a link is clicked
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    closeMobileMenu();
    
    // Handle smooth scroll for anchor links
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Smooth scroll for all navigation anchor links (including desktop)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const heroCallBtn = document.querySelector('.hero-call-btn');
if (heroCallBtn) {
  heroCallBtn.addEventListener('click', () => {
    trackConversion('click_call_now', {
      event_category: 'engagement',
      event_label: 'hero_call_now'
    });
  });
}

const heroEstimateBtn = document.querySelector('.hero-estimate-btn');
if (heroEstimateBtn) {
  heroEstimateBtn.addEventListener('click', () => {
    trackConversion('click_get_estimate', {
      event_category: 'engagement',
      event_label: 'hero_get_free_estimate'
    });
  });
}

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    trackConversion('click_phone_link', {
      event_category: 'engagement',
      event_label: link.getAttribute('href') || 'phone_link'
    });
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', () => {
    trackConversion('click_email_link', {
      event_category: 'engagement',
      event_label: link.getAttribute('href') || 'email_link'
    });
  });
});

const imageModal = document.getElementById('image-modal');
const imageModalImg = document.getElementById('image-modal-img');
const imageModalClose = document.getElementById('image-modal-close');
const projectImages = document.querySelectorAll('#projects img');

function openImageModal(src, alt) {
  if (!imageModal || !imageModalImg) {
    return;
  }
  imageModalImg.src = src;
  imageModalImg.alt = alt || 'Expanded project image';
  imageModal.classList.add('show');
  imageModal.setAttribute('aria-hidden', 'false');
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) {
    return;
  }
  imageModal.classList.remove('show');
  imageModal.setAttribute('aria-hidden', 'true');
  imageModalImg.src = '';
}

projectImages.forEach((img) => {
  img.addEventListener('click', () => {
    openImageModal(img.src, img.alt);
  });
});

if (imageModalClose) {
  imageModalClose.addEventListener('click', closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      closeImageModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  if (menu && menu.classList.contains('show')) {
    closeMobileMenu({ focusToggle: true });
  }

  if (imageModal && imageModal.classList.contains('show')) {
    closeImageModal();
  }
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  [nameInput, emailInput, messageInput].forEach((field) => {
    if (field) {
      field.setAttribute('aria-invalid', 'false');
    }
  });
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  
  if (!name || !email || !message) {
    if (!name) {
      nameInput.setAttribute('aria-invalid', 'true');
    }
    if (!email) {
      emailInput.setAttribute('aria-invalid', 'true');
    }
    if (!message) {
      messageInput.setAttribute('aria-invalid', 'true');
    }
    showFormMessage('Please fill in all fields.', 'error');
    return;
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    emailInput.setAttribute('aria-invalid', 'true');
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    
    const response = await fetch('contact.php', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      trackConversion('submit_contact_form', {
        event_category: 'lead',
        event_label: 'contact_form_success'
      });
      showFormMessage('Message sent successfully! We\'ll be in touch soon.', 'success');
      contactForm.reset();
      [nameInput, emailInput, messageInput].forEach((field) => {
        if (field) {
          field.setAttribute('aria-invalid', 'false');
        }
      });
    } else {
      showFormMessage(data.error || 'Failed to send message. Please try again.', 'error');
    }
  } catch (error) {
    showFormMessage('Error sending message. Please try again later.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

[nameInput, emailInput, messageInput].forEach((field) => {
  if (!field) {
    return;
  }

  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') {
      field.setAttribute('aria-invalid', 'false');
    }
  });
});

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.style.display = 'block';
  formMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
  formMessage.style.color = type === 'success' ? '#155724' : '#721c24';
  formMessage.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
  
  if (type === 'success') {
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }
}

// Service filter functionality
const serviceFilterInput = document.getElementById('service-filter');
if (serviceFilterInput) {
<<<<<<< Updated upstream
  const minAutocompleteChars = 3;
=======
>>>>>>> Stashed changes
  const serviceTitles = [...new Set(Array.from(document.querySelectorAll('#services .service h3'))
    .map((heading) => heading.textContent.trim())
    .filter(Boolean))];

  serviceFilterInput.addEventListener('input', (event) => {
    const typedValue = serviceFilterInput.value;
    const query = typedValue.trim();
    const isInsertAction = typeof event.inputType === 'string'
      ? event.inputType.startsWith('insert')
      : true;

<<<<<<< Updated upstream
    if (isInsertAction && query.length >= minAutocompleteChars) {
=======
    if (query && isInsertAction) {
>>>>>>> Stashed changes
      const prefixMatch = serviceTitles.find(
        (title) => title.toLowerCase().startsWith(query.toLowerCase())
      );

      if (prefixMatch && prefixMatch.toLowerCase() !== query.toLowerCase()) {
        serviceFilterInput.value = prefixMatch;
        serviceFilterInput.setSelectionRange(query.length, prefixMatch.length);
      }
    }

<<<<<<< Updated upstream
    const filter = query.toLowerCase();
=======
    const filter = serviceFilterInput.value.toLowerCase();
>>>>>>> Stashed changes
    document.querySelectorAll('#services .service').forEach(s => {
      const text = s.textContent.toLowerCase();
      if (text.includes(filter)) {
        // show: remove hiding class and ensure display
        s.classList.remove('hidden');
        s.style.display = '';
      } else {
        // fade then collapse
        s.classList.add('hidden');
        // after opacity transition, set display none to collapse
        setTimeout(() => {
          if (s.classList.contains('hidden')) {
            s.style.display = 'none';
          }
        }, 300);
      }
    });
  });
}
