// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Dash Platform Tutorials',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/dashpay/platform',
        },
      ],
      sidebar: [
        { label: 'Getting Started', slug: 'index' },
        {
          label: 'Identity',
          autogenerate: { directory: 'identity' },
        },
        {
          label: 'Names (DPNS)',
          autogenerate: { directory: 'names' },
        },
        {
          label: 'Contracts',
          autogenerate: { directory: 'contracts' },
        },
        {
          label: 'Documents',
          autogenerate: { directory: 'documents' },
        },
        {
          label: 'Tokens',
          autogenerate: { directory: 'tokens' },
        },
        {
          label: 'Platform Addresses',
          autogenerate: { directory: 'addresses' },
        },
        {
          label: 'Epoch & System',
          autogenerate: { directory: 'system' },
        },
        {
          label: 'Queries',
          autogenerate: { directory: 'queries' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
  ],
});
