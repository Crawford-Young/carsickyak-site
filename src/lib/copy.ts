/**
 * Every user-facing string on the site, gated through the yak-voice
 * acceptance round (W1 T8, 2026-07-24). Pages and components consume
 * from here so copy reruns touch one file.
 */
export const copy = {
  hero: {
    headline: 'A community built on self growth.',
    subline: 'music, poems, philosophy, fitness, building apps and games — and yes, still gaming.',
  },
  live: {
    liveLabel: 'live — come hang',
    offlineLabel: 'offline — back soon',
    // provisional — not yak-voice gated; user reviews at QA
    watchCta: 'watch now on Twitch',
  },
  // provisional — not yak-voice gated; user reviews at QA
  yak2peakTeaser: {
    latestDone: 'latest peak',
    nextUp: 'next up',
    goalPrefix: 'goal:',
  },
  sections: {
    latestVideos: 'latest videos',
    yak2peakTeaser: 'yak2peak — the climb so far',
    socials: 'everywhere else',
  },
  about: {
    philosophy: 'Show up and let it play out.',
    ranked: {
      heading: 'ranked grinder',
      body: 'Reaching my peak in all the games I used to play. New accounts, old games, one ladder at a time.',
    },
    folk: {
      heading: 'outside',
      body: 'Guitar, poems, camping in the rain. The part of the channel that happens off the sticks.',
    },
  },
  yak2peak: {
    intro: 'A challenge where I try to reach my peak rank in games I used to be good at.',
    motto: 'Consistency > everything.',
  },
  covers: {
    intro: 'folk songs and chill.',
  },
  footer: {
    attribution: 'made by Crawford Young',
  },
  notFound: {
    line: "Wrong turn. This page doesn't exist.",
  },
  meta: {
    home: 'CarsickYak — gaming, folk covers, and self growth. Live on Twitch Monday, Wednesday, and Saturday.',
    yak2peak:
      'yak2peak — a challenge where I try to reach my peak rank in games I used to be good at. The full ladder: done, doing, next.',
    about:
      'Gamer, Coder, Philosopher, Writer, Outdoorsman, Musician, Athlete, Nerd. The person behind CarsickYak.',
    covers: 'Folk covers recorded live on stream.',
  },
} as const
