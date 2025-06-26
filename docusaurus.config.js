// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "یادداشت های من",
  favicon: "/img/docusaurus.png",

  future: {
    v4: true,
  },

  url: "https://meiti-x.github.io",
  baseUrl: "/my-notes",
  organizationName: "meiti-x",
  projectName: "my-notes",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "fa",
    locales: ["fa"],
    localeConfigs: {
      fa: {
        label: "فارسی",
        direction: "rtl",
      },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "https://github.com/meiti-x.png",
      navbar: {
        title: "صفحه اصلی",
        items: [
          {
            href: "/docs/intro",
            label: "مستندات",
            position: "left",
          },
          {
            href: "/docs/tags",
            label: "تگ ها",
            position: "left",
          },
          {
            href: "https://github.com/meiti-x",
            label: "GitHub",
            position: "right",
          },
        ],
      },

      prism: {
        theme: prismThemes.oneDark,
        darkTheme: prismThemes.dracula,
      },
    }),

  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        debug: true,
        offlineModeActivationStrategies: [
          "appInstalled",
          "standalone",
          "queryString",
        ],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            href: "/img/docusaurus.png",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.json",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "rgb(37, 194, 160)",
          },
        ],
      },
    ],
  ],
};

export default config;
