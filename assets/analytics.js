(() => {
  'use strict';
  const config = window.SOUVENO_CONFIG || {};
  // Preview and local verification must never pollute production reports.
  if (!['www.souveno.ai', 'souveno.ai'].includes(location.hostname)) return;
  if (!config.ga4MeasurementId && !config.clarityProjectId) return;
  const storageKey = 'souveno-analytics-consent-v1';
  const readConsent = () => { try { return localStorage.getItem(storageKey); } catch { return null; } };
  const saveConsent = value => { try { localStorage.setItem(storageKey, value); } catch { /* Choice remains valid for this page. */ } };
  const script = src => { const tag = document.createElement('script'); tag.async = true; tag.src = src; document.head.append(tag); };
  function enable() {
    if (window.souvenoAnalyticsEnabled) return;
    window.souvenoAnalyticsEnabled = true;
    if (config.ga4MeasurementId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', config.ga4MeasurementId, { page_location: location.origin + location.pathname, page_referrer: '', allow_google_signals: false, allow_ad_personalization_signals: false });
      script('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.ga4MeasurementId));
    }
    if (config.clarityProjectId) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
      script('https://www.clarity.ms/tag/' + encodeURIComponent(config.clarityProjectId));
    }
  }
  function showChoice() {
    if (document.querySelector('.analytics-consent')) return;
    const panel = document.createElement('section');
    panel.className = 'analytics-consent';
    panel.setAttribute('aria-label', 'Analytics preferences');
    panel.innerHTML = '<p>May we use Google Analytics and Microsoft Clarity to understand visits and improve this website? Optional analytics includes heatmaps and session recordings. <a href="/privacy/">Privacy details</a></p><button type="button" data-allow>Allow analytics</button><button type="button" data-decline>Decline</button>';
    panel.querySelector('[data-allow]').onclick = () => { saveConsent('granted'); enable(); panel.remove(); };
    panel.querySelector('[data-decline]').onclick = () => {
      saveConsent('denied');
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      if (window.clarity) window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
      const wasEnabled = window.souvenoAnalyticsEnabled;
      window.souvenoAnalyticsEnabled = false;
      panel.remove();
      if (wasEnabled) location.reload();
    };
    document.body.append(panel);
  }
  const settings = document.createElement('button');
  settings.type = 'button'; settings.className = 'analytics-settings'; settings.textContent = 'Analytics preferences'; settings.onclick = showChoice;
  document.body.append(settings);
  if (readConsent() === 'granted') enable();
  else if (readConsent() !== 'denied') showChoice();
})();
