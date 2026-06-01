import {defineType, defineField} from 'sanity'
import {createCharacterCount} from '../components/CharacterCount'

/**
 * AI search optimization object — reused by every major content type.
 * Powers Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude and
 * voice assistants, plus the frontend's Quick Answer / Key Takeaways sections
 * and Speakable JSON-LD.
 */
export const aiSeo = defineType({
  name: 'aiSeo',
  title: 'AI SEO',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'quickAnswer',
      title: 'Quick Answer',
      type: 'text',
      rows: 3,
      description: '50–80 words. The direct answer surfaced by AI search engines.',
      components: {input: createCharacterCount({recommendedMin: 250, recommendedMax: 500})},
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'Concise summary that helps AI understand the content.',
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Rendered as a highlighted list at the top of articles.',
    }),
    defineField({
      name: 'commonQuestions',
      title: 'Common Questions',
      type: 'faqList',
      description: 'Question/answer pairs optimized for AI and voice search.',
    }),
    defineField({
      name: 'speakableContent',
      title: 'Speakable Content',
      type: 'text',
      rows: 3,
      description: 'Sentences suited to voice playback. Generates Speakable schema.',
    }),
    defineField({
      name: 'aiNotes',
      title: 'AI Notes (internal)',
      type: 'text',
      rows: 2,
      description: 'Editorial notes — never rendered.',
    }),
  ],
})
