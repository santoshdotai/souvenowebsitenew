(() => {
  'use strict';
  const config = window.SOUVENO_CONFIG || {};
  const form = document.querySelector('.use-case-form');
  const track = (name, fields = {}) => {
    if (window.souvenoAnalyticsEnabled && window.gtag) window.gtag('event', name, { page_path: location.pathname, ...fields });
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-contact]');
    if (link) track(link.dataset.contact === 'booking' ? 'booking_click' : 'whatsapp_click', { cta_location: link.dataset.location || 'page' });
  });
  if (!form) return;
  form.querySelector('button[type="submit"]').disabled = false;
  form.addEventListener('input', () => {
    document.querySelector('#enquiry-handoff').hidden = true;
    document.querySelector('#enquiry-status').textContent = '';
  });
  const referral = form.elements.namedItem('heard_about');
  const other = form.elements.namedItem('heard_about_other');
  referral.addEventListener('change', () => {
    other.closest('label').hidden = referral.value !== 'Other';
    other.required = referral.value === 'Other';
    if (!other.required) other.value = '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'Hi Souveno, I would like to discuss a use case.',
      'Name: ' + data.get('name'),
      'Business: ' + data.get('business'),
      'Use case: ' + data.get('use_case'),
      'How I heard about you: ' + data.get('heard_about') + (data.get('heard_about_other') ? ' — ' + data.get('heard_about_other') : ''),
      'Website: https://www.souveno.ai/'
    ].join('\n');
    // A handoff is not a submitted lead: visitors still choose Send in WhatsApp.
    track('enquiry_whatsapp_open', { referral_source: String(data.get('heard_about')) });
    const handoff = document.querySelector('#enquiry-handoff');
    handoff.href = 'https://wa.me/' + config.whatsappNumber + '?text=' + encodeURIComponent(message);
    handoff.hidden = false;
    document.querySelector('#enquiry-status').textContent = 'Your message is ready. Open WhatsApp below, then tap Send to share it with Souveno.';
    handoff.focus();
  });
})();
