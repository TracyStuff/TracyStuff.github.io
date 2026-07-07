import { defineConfig } from "tinacms";

import { BlogCollection } from "./collections/blog";
import { GlobalConfigCollection } from "./collections/global-config";
import { PageCollection } from "./collections/page";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const mediaItemFields = [
  {
    type: "image",
    name: "src",
    label: "Media",
  },
  {
    type: "string",
    name: "alt",
    label: "Alt text",
  },
];

const galleryItemFields = [
  {
    type: "string",
    name: "title",
    label: "Title",
  },
  {
    type: "string",
    name: "caption",
    label: "Caption",
    ui: {
      component: "textarea",
    },
  },
  {
    type: "object",
    name: "media",
    label: "Images",
    list: true,
    fields: mediaItemFields,
  },
];

export default defineConfig({
  branch,

  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      BlogCollection,
      PageCollection,
      GlobalConfigCollection,
    ],
  },
});

