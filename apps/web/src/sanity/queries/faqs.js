// =============================================================================
// FAQ queries — fetches standalone `faqItem` documents for use anywhere on the
// site (homepage FAQ section, etc.). Per-page FAQs live inside the content
// document itself and are fetched as part of that document's query.
// =============================================================================

/** Standalone FAQ items powering the global FAQ section. */
export const ALL_FAQS_QUERY = `*[_type == "faqItem"] | order(order asc){
  _id, question, answer
}`
