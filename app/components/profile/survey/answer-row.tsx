import { CheckCircle2 } from 'lucide-react'

export const QUESTION_META: Record<
  string,
  { label: string; type: 'choice' | 'scale' }
> = {
  Q1: {
    label: 'New app/phone behaviour',
    type: 'choice',
    options: {
      A: 'I set it up myself and explore all the settings on my own',
      B: 'I watch a YouTube tutorial or read instructions to figure it out',
      C: 'I ask a friend or family member to help me set it up',
      D: 'I just use it for the basics without exploring much',
    },
  },
  Q2: {
    label: 'Content you stop and watch',
    type: 'choice',
    options: {
      A: 'Satisfying video edits, cool transitions, or visually beautiful content',
      B: 'Interesting facts, news, or "did you know" type videos',
      C: 'Business pages, brand stories, or people building their following',
      D: 'Tutorials showing how to fix or build something',
      E: 'Funny memes or entertainment with no particular theme',
    },
  },
  Q3: {
    label: 'Digital content creation',
    type: 'choice',
    options: {
      A: 'Yes, I do it often and genuinely enjoy making things look good',
      B: 'Yes, but mainly just to get something done, not because I love it',
      C: "I have tried once or twice but it didn't really interest me",
      D: 'No, I have never tried',
    },
  },
  Q4: {
    label: 'Troubleshooting approach',
    type: 'choice',
    options: {
      A: 'I try to fix it myself, restart, clear cache, Google the problem, test things',
      B: 'I look for a YouTube video or forum that explains the fix',
      C: 'I hand it to someone else to deal with',
      D: 'I wait and hope it fixes itself',
    },
  },
  Q5: {
    label: 'Comfort helping others with tech',
    type: 'scale',
    scaleLabel: {
      low: 'Very uncomfortable',
      high: 'I genuinely enjoy helping others with this',
    },
  },
  Q6: {
    label: 'Enjoyment of pattern-spotting',
    type: 'scale',
    scaleLabel: {
      low: 'Not at all',
      high: 'I really enjoy that kind of thinking',
    },
  },
  Q7: {
    label: 'How you use your phone',
    type: 'choice',
    options: {
      A: 'I customize everything: wallpapers, widgets, fonts, until it looks exactly right',
      B: 'I use it to learn things: podcasts, articles, YouTube rabbit holes',
      C: 'I am always in group chats, helping people, or organizing things for others',
      D: 'I follow business or side-hustle pages, or I am already trying to sell something',
      E: 'I like knowing how things work — I have searched things like "how does WiFi actually work"',
      F: 'I keep notes, to-do lists, or manage files and schedules on my phone',
    },
  },
  Q8: {
    label: 'Interest in visual design',
    type: 'scale',
    scaleLabel: { low: 'Not interested at all', high: 'I really enjoy this' },
  },
  Q9: {
    label: 'What you would build with tech',
    type: 'choice',
    options: {
      A: 'An app or game that people download and use every day',
      B: 'A tool that looks amazing and is incredibly easy to use',
      C: 'A system that analyzes data and gives smart recommendations to people',
      D: 'A security system that protects accounts and keeps private data safe',
      E: 'An online store or brand that earns real money',
      F: 'A platform that connects people and helps communities work together',
      G: 'An AI system that learns from data and gets smarter over time',
      H: 'A network or infrastructure that keeps important systems running reliably',
    },
  },
  Q10: {
    label: 'Most meaningful accomplishment',
    type: 'choice',
    options: {
      A: 'Writing code that actually works and does something useful for people',
      B: 'Designing something so clean and beautiful that everyone asks who made it',
      C: 'Finding a pattern in a messy dataset that nobody else noticed',
      D: 'Being the person who stopped a scam or prevented a data breach',
      E: 'Growing a page or brand from zero to thousands of followers or customers',
      F: 'Leading a team that ships a big technology project on time',
      G: 'Building something creative that uses AI in a way no one has tried before',
      H: 'Making sure a whole system keeps running with zero failures',
    },
  },
  Q11: {
    label: 'Excitement about tech university major',
    type: 'scale',
    scaleLabel: { low: 'Not excited at all', high: 'I cannot wait' },
  },
  Q12: {
    label: 'What you want to learn more about',
    type: 'choice',
    options: {
      A: 'How to build apps and write code that solves real problems',
      B: 'How AI systems learn from data and make decisions on their own',
      C: 'How to design websites and digital products that look and feel great',
      D: 'How data is collected, analyzed, and turned into useful insights',
      E: 'How hackers break into systems and how to stop them',
      F: 'How the internet and networks actually work behind the scenes',
      G: 'How to build and grow a business or brand online',
      H: 'How technology is managed and led inside large organizations',
    },
  },
}

function ScaleBar({ value }: { value: number }) {
  const pct = (value / 5) * 100
  const color =
    value >= 4
      ? 'bg-green-500'
      : value >= 3
        ? 'bg-primary'
        : value >= 2
          ? 'bg-yellow-500'
          : 'bg-muted-foreground'

  return (
    <div className='flex items-center gap-3'>
      <div className='flex-1 h-2 bg-card rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className='text-xs font-bold text-foreground w-6 text-right'>
        {value}/5
      </span>
    </div>
  )
}

export function AnswerRow({ code, value }: { code: string; value: string }) {
  // Used only as a fallback export — ScaleCard and ChoiceCard in survey-content handle rendering
  const meta = QUESTION_META[code] ?? { label: code, type: 'choice' }
  const numVal = Number(value)
  const isScale = meta.type === 'scale' && !isNaN(numVal)

  return (
    <div className='flex flex-col gap-2 py-3.5 border-b border-border last:border-0'>
      <div className='flex items-center gap-2'>
        <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0'>
          {code}
        </span>
        <span className='text-sm font-semibold text-foreground'>
          {meta.label}
        </span>
      </div>
      {!isScale && (
        <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 w-fit'>
          <CheckCircle2 size={11} /> Option {value}
        </span>
      )}
    </div>
  )
}
