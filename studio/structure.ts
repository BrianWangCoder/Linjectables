import type { StructureResolver } from "sanity/structure";

/** Friendly, owner-focused sidebar: clinic info first, then treatments & prices. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Clinic info, hours & homepage")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Clinic info, hours & homepage")),
      S.divider(),
      S.documentTypeListItem("treatmentCategory").title("Treatment categories"),
      S.documentTypeListItem("treatment").title("Treatments & prices"),
      S.documentTypeListItem("promotion").title("Promotions"),
      S.documentTypeListItem("concern").title("Concerns"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Legal pages"),
    ]);
