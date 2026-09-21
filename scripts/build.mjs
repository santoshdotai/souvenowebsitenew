import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
for (const [key, env] of Object.entries({ bookingUrl: 'BOOKING_URL', ga4MeasurementId: 'GA4_MEASUREMENT_ID', clarityProjectId: 'CLARITY_PROJECT_ID', googleSiteVerification: 'GOOGLE_SITE_VERIFICATION' })) {
  if (process.env[env]) config[key] = process.env[env].trim();
}
if (!/^[1-9]\d{7,14}$/.test(config.whatsappNumber)) throw new Error('Invalid WhatsApp number');
if (config.ga4MeasurementId && !/^G-[A-Z0-9]+$/.test(config.ga4MeasurementId)) throw new Error('Invalid GA4 measurement ID');
if (config.clarityProjectId && !/^[a-z0-9]+$/i.test(config.clarityProjectId)) throw new Error('Invalid Clarity project ID');
if (config.bookingUrl && new URL(config.bookingUrl).protocol !== 'https:') throw new Error('Booking URL must use HTTPS');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const chat = 'https://wa.me/' + config.whatsappNumber + '?text=' + encodeURIComponent('Hi Souveno, I would like to discuss automation for my business.');
const booking = config.bookingUrl || 'https://wa.me/' + config.whatsappNumber + '?text=' + encodeURIComponent('Hi Souveno, I would like to book a 20-minute use-case call. Please share available times.');
const allowedDirectories = ['about', 'automations', 'for-agencies', 'for-distributors', 'pricing', 'privacy', 'terms'];
await mkdir(output, { recursive: true });
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
const pages = ['index.html', 'dashboard.html', 'payment.html', ...allowedDirectories.map(dir => dir + '/index.html')];
for (const file of pages) {
  let html = await readFile(path.join(root, file), 'utf8');
  html = html.replaceAll('{{WHATSAPP_URL}}', escape(chat)).replaceAll('{{BOOKING_URL}}', escape(booking));
  html = html.replace('<!-- search-console-verification -->', config.googleSiteVerification ? `<meta name="google-site-verification" content="${escape(config.googleSiteVerification)}">` : '');
  await mkdir(path.dirname(path.join(output, file)), { recursive: true });
  await writeFile(path.join(output, file), html);
}
for (const file of ['robots.txt', 'sitemap.xml']) await cp(path.join(root, file), path.join(output, file));
// Only explicitly public configuration is emitted; never serialize process.env.
await writeFile(path.join(output, 'assets/config.js'), 'window.SOUVENO_CONFIG = ' + JSON.stringify({ whatsappNumber: config.whatsappNumber, ga4MeasurementId: config.ga4MeasurementId, clarityProjectId: config.clarityProjectId }) + ';\n');
console.log(`Built ${pages.length} static pages. GA4: ${!!config.ga4MeasurementId}; Clarity: ${!!config.clarityProjectId}; Search Console tag: ${!!config.googleSiteVerification}`);
