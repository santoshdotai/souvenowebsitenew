# Souveno.ai website

Static HTML website deployed from this repository to Vercel. Run `npm run build` to generate `dist/`; Vercel uses the build and output directory in `vercel.json`. No runtime framework or dependencies are required.

## Reusable website format

- `index.html`: platform, industries and business context.
- `about/index.html`: company identity and approach. Add verified team details here when available.
- `automations/index.html`: one automation example for every published tool or workflow.
- `assets/site.css`: shared brand, responsive layout and accessible focus styles.
- `assets/automations.js`: shared walkthrough behaviour, independent for every example.

To add a tool, duplicate an automation article, give it a unique ID, describe its trigger, ordered workflow and result (`data-result`), and link to it from the relevant product section. Keep the illustrative-data notice visible. The walkthrough does not execute integrations. Document actual setup and permissions before introducing live execution.

Keep this structure for future AI websites: explain the capability, demonstrate its workflow, show its result and review points, and provide a clear contact route. Update canonical URLs, company identity and sitemap for each new brand.

Preview with `npm run build` then `python -m http.server 8092 --directory dist`. Run `npm test` for page coverage, referral fields, redirect rules and analytics consent checks.

## Contact and measurement configuration

Edit `site.config.json` (public values only). WhatsApp is set to `918639332232`; an empty `bookingUrl` deliberately arranges the 20-minute call through WhatsApp. A future HTTPS scheduling URL can replace it. The build emits real links into every page, so CTAs also work without JavaScript.

The enquiry form prepares a WhatsApp message; the visitor must open WhatsApp and send it. It does not store leads or report a confirmed submission. Every future form must include a labelled `heard_about` field and persist its value to its actual destination.

Set public tracking values in `site.config.json`, or use these Vercel build environment variables:

| Setting | Vercel variable | Value |
| --- | --- | --- |
| GA4 | `GA4_MEASUREMENT_ID` | Measurement ID beginning `G-` |
| Clarity | `CLARITY_PROJECT_ID` | Project ID from tracking code |
| Search Console | `GOOGLE_SITE_VERIFICATION` | Content value of the HTML verification tag |
| Scheduling | `BOOKING_URL` | Optional HTTPS scheduling link |

Redeploy after changing any value. Empty analytics IDs keep the services disabled; never use sample IDs in production. Analytics runs only on the production .ai hosts and after opt-in. Events are `whatsapp_click`, `booking_click`, and `enquiry_whatsapp_open`; these indicate intent, not booked calls or delivered leads. Disable GA4 Enhanced Measurement **form interactions and outbound clicks** for this stream: use the explicit events to avoid duplicating contact events or collecting prefilled message URLs. The custom events exclude names and free-text enquiries. Set Clarity masking to Strict in its project settings, in addition to the form's explicit mask.

## Search Console activation

Use a Domain property for `souveno.ai` and add Google's exact TXT verification record in the active DNS provider. Alternatively, create the URL-prefix property `https://www.souveno.ai/`, set the HTML verification value above, deploy, and click Verify in Search Console. Submit `https://www.souveno.ai/sitemap.xml`. A verification tag alone does not complete verification or sitemap submission.

## Consolidating souveno.in

The canonical host remains `https://www.souveno.ai/`. Every page is rendered HTML, with canonical URLs and a sitemap. `vercel.json` includes permanent, path-preserving redirects from `souveno.in`, `www.souveno.in` and `souveno.ai`.

The .in domain is hosted at Hostinger and was not attached to either Vercel project at implementation time. The Vercel rules take effect for .in only after those hosts route to this project. Alternatively, configure a permanent redirect at Hostinger, retaining the path and query string. For an Apache-hosted site, these rules belong above other application rewrites in its existing `.htaccess` (preserve the other rules):

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?souveno\.in$ [NC]
RewriteRule ^ https://www.souveno.ai%{REQUEST_URI} [R=301,L,NE]
```

Keep valid SSL on both .in hosts. Check important old URLs for equivalent destination content before completing the migration, and add specific mappings when paths differ. After verifying ownership of both properties, submit the change of address in Search Console. Do not modify mail DNS records for this migration.

Production domain project: `souvenowebsitenew-hvf7` in team `souveno-ai`. Both this project and `souvenowebsitenew` deploy from `santoshdotai/souvenowebsitenew`, branch `main`.
