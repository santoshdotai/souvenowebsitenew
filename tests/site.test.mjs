import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

execFileSync(process.execPath, ['scripts/build.mjs']);
const pages = ['index.html', 'about/index.html', 'automations/index.html', 'for-agencies/index.html', 'for-distributors/index.html', 'pricing/index.html', 'privacy/index.html', 'terms/index.html', 'dashboard.html', 'payment.html'];
test('every published page has working static WhatsApp and booking links', () => {
  for (const page of pages) {
    const html = readFileSync('dist/' + page, 'utf8');
    assert.match(html, /class="souveno-whatsapp" href="https:\/\/wa.me\/918639332232\?text=/, page);
    assert.match(html, /Book a 20-min use-case call/, page);
    assert.match(html, /<link rel="canonical" href="https:\/\/www.souveno.ai\//, page);
    assert.doesNotMatch(html, /\{\{|http-equiv="refresh"/, page);
    assert.match(html, /assets\/analytics.js/, page);
  }
});
test('all forms capture attribution and mask personal inputs', () => {
  for (const page of pages) {
    const html = readFileSync('dist/' + page, 'utf8');
    for (const form of html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)) {
      assert.match(form[0], /data-clarity-mask="true"/);
      assert.match(form[0], /name="heard_about" required/);
      assert.match(form[0], /How did you hear about us\?/);
    }
  }
});
test('legacy host redirects preserve paths and cannot redirect canonical host to itself', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.deepEqual(config.redirects.map(r => r.has[0].value), ['souveno.in', 'www.souveno.in', 'souveno.ai']);
  for (const rule of config.redirects) {
    assert.equal(rule.source, '/:path*');
    assert.equal(rule.destination, 'https://www.souveno.ai/:path*');
    assert.equal(rule.permanent, true);
  }
});
const analytics = readFileSync('assets/analytics.js', 'utf8');
function analyticsContext(hostname, consent) {
  const requests = [];
  const elements = [];
  const window = { SOUVENO_CONFIG: { ga4MeasurementId: 'G-TEST123', clarityProjectId: 'abc123' } };
  const document = {
    head: { append: tag => requests.push(tag.src) },
    body: { append: element => elements.push(element) },
    querySelector: () => null,
    createElement: tag => ({ tag, setAttribute() {}, querySelector: () => ({}), remove() {} })
  };
  vm.runInNewContext(analytics, { window, document, location: { hostname, origin: 'https://' + hostname, pathname: '/' }, localStorage: { getItem: () => consent } });
  return { requests, elements, window };
}
test('analytics sends no requests before consent, after decline or on previews', () => {
  for (const consent of [null, 'denied']) assert.equal(analyticsContext('www.souveno.ai', consent).requests.length, 0);
  assert.equal(analyticsContext('preview.vercel.app', 'granted').requests.length, 0);
});
test('consenting production visitors load GA4 and Clarity exactly once', () => {
  const { requests, window } = analyticsContext('www.souveno.ai', 'granted');
  assert.equal(requests.length, 2);
  assert.match(requests[0], /googletagmanager.com/);
  assert.match(requests[1], /clarity.ms/);
  assert.equal(window.souvenoAnalyticsEnabled, true);
  assert.equal(window.clarity.q[0][0], 'consentv2');
});
