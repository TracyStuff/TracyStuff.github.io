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
    label: "Media",
    list: true,
    fields: mediaItemFields,
  },
];

export const GalleryCollection = {
  name: "galleryCollection",
  label: "Galleries Workspace",
  path: "content/galleries",
  format: "json",
  ui: {
    itemProps: (item: any) => {
      const itemsCount = item?.items?.length || 0;
      const subtitle = `${itemsCount} item${itemsCount === 1 ? '' : 's'}`;
      return { label: item?.name || "Untitled Gallery", description: subtitle };
    },
  },
  fields: [
    {
      type: "string",
      name: "name",
      label: "Gallery Name",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "galleryId", // CHANGED FROM "id" TO PREVENT GRAPHQL RUNTIME NAME CLASHES
      label: "Internal Canvas Gallery ID",
      description: "Unique string used to lock layouts. (e.g. portfolio-2026)",
    },
    {
      type: "object",
      name: "items",
      label: "Gallery Grid Items",
      list: true,
      fields: galleryItemFields,
    },
  ],
};

export const galleryBlock = {
  type: "object",
  name: "gallery",
  label: "Gallery Block",
  fields: [
    {
      type: "reference",
      name: "galleryRef",
      label: "Choose a Saved Gallery Document",
      collections: ["galleryCollection"],
    },
  ],
};

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
      GalleryCollection,
      GlobalConfigCollection,
    ],
  },
});
