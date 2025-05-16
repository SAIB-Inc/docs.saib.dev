import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Developer Portal | Softwarez at its Best, Inc.',
  tagline: 'Softwarez at its Best | Cardano Tooling',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.saib.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SAIB-Inc', // Usually your GitHub org/user name.
  projectName: 'docs.saib.dev', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            './src/styles/app.css',
            './src/css/custom.css'
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    colorMode: {
      defaultMode: 'dark',
    },
    image: 'img/saib_portal_og.webp',
    metadata: [
      {name: 'description', content: 'A guide to developing in Cardano with .NET, the SAIB Cardano Developer Portal contains detailed documentation and examples of key tools - Chrysalis, Argus, Razor, and more!'},
      {name: 'keywords', content: 'Cardano, SAIB, Chrysalis, Argus, Razor, COMP, Futura, .NET, Documentation, Development'},
      {property: 'og:title', content: 'Developer Portal | Softwarez at its Best, Inc.'},
      {property: 'og:description', content: 'A guide to developing in Cardano with .NET, the SAIB Cardano Developer Portal contains detailed documentation and examples of key tools - Chrysalis, Argus, Razor, and more!'},
      {property: 'og:type', content: 'website'},
      {property: 'twitter:card', content: 'summary_large_image'},
      {property: 'twitter:title', content: 'Developer Portal | Softwarez at its Best, Inc.'},
      {property: 'twitter:description', content: 'A guide to developing in Cardano with .NET, the SAIB Cardano Developer Portal contains detailed documentation and examples of key tools - Chrysalis, Argus, Razor, and more!'}
    ],
    navbar: {
      title: '',
      logo: {
        alt: 'SAIB Developer Portal',
        src: 'img/logo_light.svg',
        srcDark: 'img/logo_dark.svg'
      },
      items: [
        {
          docId: 'chrysalis',
          type: "docSidebar",
          sidebarId: "chrysalis",
          position: "left",
          label: "Chrysalis",
          className: "hover:text-[#049E96]!"
        },
        {
          docId: 'argus',
          type: 'docSidebar',
          sidebarId: 'argusSidebar',
          position: 'left',
          label: 'Argus',
          className: "hover:text-[#813ADF]!"
        },
        {
          docId: 'razor',
          type: 'docSidebar',
          sidebarId: 'razor',
          position: 'left',
          label: 'Razor',
          className: "hover:text-[#649DCA]!"
        },
        {
          docId: 'comp',
          type: 'docSidebar',
          sidebarId: 'comp',
          position: 'left',
          label: 'COMP',
          className: "hover:text-[var(--comp-color-primary)]!"
        },
        {
          docId: 'futura',
          type: 'docSidebar',
          sidebarId: 'futura',
          position: 'left',
          label: 'Futura',
          className: "hover:text-[var(--futura-color-primary)]!"
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/SAIB-Inc/docs.saib.dev',
            },
          ],
        },
      ],
      copyright: `© Softwarez at its Best, Inc. ${new Date().getFullYear()}. - All Rights Reserved`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};


export default config;
