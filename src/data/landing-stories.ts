export interface LandingStory {
  slug: string
  category: string
  readTime: string
  title: string
  excerpt: string
  opening: string
  sections: Array<{
    heading: string
    paragraphs: string[]
  }>
  closing: string
}

export const LANDING_STORIES: LandingStory[] = [
  {
    slug: 'small-rituals-for-a-human-digital-life',
    category: 'Technology',
    readTime: '5 min read',
    title: 'The small rituals that keep our digital lives human',
    excerpt:
      'A slower notification habit, one handwritten list, and a phone-free cup of tea can make technology feel like a tool again instead of a room we live in.',
    opening:
      'The problem was never that my phone could do too much. It was that every useful thing arrived through the same bright doorway as every interruption. A message from someone I loved sat beside a sale alert, a calendar reminder, and a headline designed to make me anxious. Eventually, everything began to feel equally urgent.',
    sections: [
      {
        heading: 'Begin the day somewhere else',
        paragraphs: [
          'I started leaving my phone outside the bedroom and keeping a small notebook by the window. Each morning I wrote three lines: what needed care, what could wait, and one thing I wanted to notice. The list was slower than an app, which was precisely why it worked.',
          'Nothing dramatic happened. I simply stopped letting a screen choose the first thought of my day. That small boundary made the rest of my technology feel more intentional.',
        ],
      },
      {
        heading: 'Give tools a closing time',
        paragraphs: [
          'At six in the evening, work apps leave my home screen. I do not delete them or pretend they are unimportant. I move them out of sight. The gesture takes seconds, but it marks a transition that remote work had blurred almost completely.',
          'Useful technology should know when its work is finished. When it does not, we have to teach it.',
        ],
      },
      {
        heading: 'Keep one beautiful inconvenience',
        paragraphs: [
          'I still write grocery lists on paper. I still carry a paperback on the train. These are not acts of rebellion; they are reminders that efficiency is only one kind of value. Some tasks become meaningful because they ask us to be present while doing them.',
        ],
      },
    ],
    closing:
      'A humane digital life is not built by abandoning technology. It is built from tiny rituals that return choice to our hands. The goal is not less technology at any cost. It is more room to hear ourselves think.',
  },
  {
    slug: 'a-quiet-sunday-window-garden',
    category: 'DIY',
    readTime: '3 min read',
    title: 'How I turned a quiet Sunday into a window garden',
    excerpt:
      'Three jars, a handful of cuttings, and no grand plan. By sunset, the kitchen window had become the brightest corner of the apartment.',
    opening:
      'The rain had cancelled every plan I thought I needed. By noon, I was standing in the kitchen with three empty jars, a pair of scissors, and the long stems of herbs I had almost thrown away.',
    sections: [
      {
        heading: 'Start with what is already growing',
        paragraphs: [
          'Mint, basil, and spring onions are forgiving companions. I trimmed each stem below a node, removed the lower leaves, and placed the cuttings in clean water. The jars did not match, which made the arrangement feel less like a project and more like a collection.',
          'I lined them along the brightest window and turned their labels toward the wall. Sunlight passed through the glass and made even the roots look decorative.',
        ],
      },
      {
        heading: 'Let the routine be the reward',
        paragraphs: [
          'Every few days I replace the water and check for new roots. It takes less than five minutes. That modest ritual has become a pause between making coffee and opening my laptop.',
          'A window garden does not demand expertise. It asks for attention in small, repeatable amounts, which is often the easiest kind of care to sustain.',
        ],
      },
    ],
    closing:
      'By evening, the kitchen had not changed very much, but it felt inhabited in a new way. The best home projects do that: they use what is close at hand and make an ordinary corner feel noticed.',
  },
  {
    slug: 'what-we-wear-in-private',
    category: 'Fashion',
    readTime: '4 min read',
    title: 'What we wear when nobody is watching',
    excerpt:
      'The soft shirt, the repaired sleeve, and the private language of comfort reveal more about personal style than our most carefully planned outfits.',
    opening:
      'My favorite shirt would never survive a wardrobe edit on social media. Its color has faded unevenly, one cuff is repaired with thread that does not quite match, and the collar has surrendered its original shape. Yet it is the first thing I reach for when I want to feel like myself.',
    sections: [
      {
        heading: 'Comfort keeps a better archive',
        paragraphs: [
          'Clothes remember the body differently from photographs. A softened elbow records hours at a desk. A stretched pocket remembers keys, train tickets, and hands searching for somewhere to rest.',
          'The garments we keep in private often carry a history that trend cycles cannot measure. Their value comes from familiarity rather than novelty.',
        ],
      },
      {
        heading: 'Personal style begins offstage',
        paragraphs: [
          'What we choose without an audience reveals the shapes, fabrics, and colors that genuinely make us comfortable. Paying attention to those choices can produce a more honest public wardrobe too.',
          'Instead of asking whether an outfit looks impressive, I have started asking whether it feels recognizable. The answer is quieter, but usually more useful.',
        ],
      },
    ],
    closing:
      'Style is not only performance. Sometimes it is the repaired sleeve no one else notices and the relief of putting on something that already knows you.',
  },
  {
    slug: 'the-twenty-minute-walk',
    category: 'Health',
    readTime: '4 min read',
    title: 'The twenty-minute walk that reset my week',
    excerpt:
      'No tracker, no target, just enough space to hear myself think again and return with a gentler plan for the days ahead.',
    opening:
      'By Wednesday afternoon, the week had become a single crowded thought. I had moved from task to task without ever feeling finished, and even rest had begun to resemble another item on a list.',
    sections: [
      {
        heading: 'Leave the measurement behind',
        paragraphs: [
          'I went outside without headphones or a fitness goal. There was no route to complete and no pace to maintain. I walked until my shoulders dropped, then followed the streets that looked most familiar.',
          'Without numbers to satisfy, the walk stopped being a performance. I noticed a bakery closing for the day, a child naming passing buses, and the first cool edge in the evening air.',
        ],
      },
      {
        heading: 'Let movement make room',
        paragraphs: [
          'The problems waiting at home did not disappear, but they separated from one another. One needed an email. One needed patience. Several did not need anything until tomorrow.',
          'Walking gave each thought enough space to become its actual size. Most were smaller than they had seemed indoors.',
        ],
      },
    ],
    closing:
      'Twenty minutes was not a cure or a transformation. It was a reset: a brief return to scale, breath, and the simple fact that I could move through the week without carrying all of it at once.',
  },
]

export function findLandingStory(slug: string | undefined) {
  return LANDING_STORIES.find((story) => story.slug === slug)
}