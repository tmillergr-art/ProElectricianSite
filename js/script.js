const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
  menuToggle.setAttribute('aria-expanded', !expanded);
  menu.classList.toggle('show');
});

// Close menu when a link is clicked
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('show');
    
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

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  if (!name || !email || !message) {
    showFormMessage('Please fill in all fields.', 'error');
    return;
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
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
      showFormMessage('Message sent successfully! We\'ll be in touch soon.', 'success');
      contactForm.reset();
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
