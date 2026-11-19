import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "y9o8cxlp";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "linjectables",
  title: "LINJECTABLES",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    // Singletons can't be created/duplicated/deleted from the "new document" menu
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== "siteSettings"),
    actions: (prev, { schemaType }) =>
      schemaType === "siteSettings"
        ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : prev,
  },
});
