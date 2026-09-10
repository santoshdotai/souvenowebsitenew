# Souveno.ai website

Static website deployed from this repository to Vercel. No build step is required.

## Reusable website format

- `index.html`: platform, industries and business context.
- `about/index.html`: company identity and approach. Add verified team details here when available.
- `automations/index.html`: one automation example for every published tool or workflow.
- `assets/site.css`: shared brand, responsive layout and accessible focus styles.
- `assets/automations.js`: shared walkthrough behaviour, independent for every example.

To add a tool, duplicate an automation article, give it a unique ID, describe its trigger, ordered workflow and result (`data-result`), and link to it from the relevant product section. Keep the illustrative-data notice visible. The walkthrough does not execute integrations. Document actual setup and permissions before introducing live execution.

Keep this structure for future AI websites: explain the capability, demonstrate its workflow, show its result and review points, and provide a clear contact route. Update canonical URLs, company identity and sitemap for each new brand.

Preview with `python -m http.server 8092`. Verify desktop and mobile navigation, each example through completion and reset, and the About Us page before publishing.
