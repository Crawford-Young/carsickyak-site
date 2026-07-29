/**
 * Every user-facing string the site authors, gated through the yak-voice
 * acceptance round (W1 T8, 2026-07-24). Pages and components consume
 * from here so copy reruns touch one file. Exception: error surfaces use
 * `@crawfordyoung/ui` RouteErrorFallback's built-in default labels — library
 * copy stays the library's.
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
    // provisional — not yak-voice gated; user reviews at QA
    pageTitle: 'about',
    bio: {
      name: 'CarsickYak',
      tagline: 'Gamer, Coder, Philosopher, Writer, Outdoorsman, Musician, Athlete, Nerd',
      line: 'Ranked grinder, but not taking it too seriously.',
    },
    quote: {
      text: 'In the midst of winter I found there was within me an invincible summer.',
      attribution: 'Albert Camus',
    },
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
  },
  // provisional — not yak-voice gated; user reviews at QA
  yak2peakLadder: {
    pageTitle: 'yak2peak',
    doneHeading: 'done',
    doingHeading: 'doing',
    queuedHeading: 'queued',
    goalPrefix: 'goal',
  },
  covers: {
    intro: 'folk songs and chill.',
    // provisional — not yak-voice gated; user reviews at QA
    pageTitle: 'covers',
    // provisional — not yak-voice gated; user reviews at QA
    empty: 'No covers up yet — more coming soon.',
    // provisional — not yak-voice gated; user reviews at QA
    emptyCta: 'watch the channel on YouTube',
  },
  footer: {
    attribution: 'made by Crawford Young',
    // not yak-voice gated — a legal-page label, kept plain on purpose
    privacyLabel: 'privacy',
  },
  notFound: {
    line: "Wrong turn. This page doesn't exist.",
    // provisional — not yak-voice gated; user reviews at QA
    homeLabel: 'back to home',
  },
  /**
   * Legal boilerplate — deliberately NOT yak-voice gated. Source of truth is
   * `docs/web/adsense-approval/content/privacy-policy.md`; this is a
   * transcription of it, and the required strings (`third-party vendor`,
   * `DoubleClick`, `Ads Settings`) are asserted by tests in every repo. A
   * future copy pass must not rewrite this into channel voice.
   */
  privacy: {
    pageTitle: 'Privacy Policy',
    effectiveDate: 'Effective July 28, 2026',
    covers: {
      heading: 'What this policy covers',
      body: 'This policy applies to carsickyak.crawfordyoung.dev, operated by Crawford Young. It explains what information the site collects, why, and what you can do about it.',
      offsite:
        "It does not cover sites this one links to. Once you follow a link off carsickyak.crawfordyoung.dev, that site's own policy applies.",
    },
    collected: {
      heading: 'Information collected',
      intro: 'This site collects very little.',
      logsLabel: 'Server logs.',
      logsBody:
        'The hosting provider (Vercel) records standard request data — IP address, user agent, requested path, timestamp — for security and reliability. These logs are retained by Vercel under their own policy and are not used to build a profile of you.',
      analyticsLabel: 'Analytics.',
      analyticsBody:
        'Aggregate page-view counts via Vercel Analytics and Vercel Speed Insights. These measure traffic and page performance in aggregate. They do not use cookies and do not track you across other sites.',
      thumbnailsLabel: 'YouTube thumbnails.',
      thumbnailsBody:
        'Video thumbnails on the home and covers pages are loaded directly from YouTube’s image servers, so your browser makes a request to Google when those pages render. No video is embedded and nothing plays in place — the tiles link out to YouTube, where',
      thumbnailsLinkLabel: 'Google’s privacy policy',
      thumbnailsBodyEnd: 'applies.',
    },
    advertising: {
      heading: 'Advertising',
      intro: 'This site displays advertising served by Google.',
      vendorLead: 'Google is a',
      vendorEmphasis: 'third-party vendor',
      vendorTail: 'and uses cookies to serve ads on this site.',
      doubleclickLead: 'Google’s use of advertising cookies — including the',
      doubleclickEmphasis: 'DoubleClick',
      doubleclickTail:
        'cookie — enables it and its partners to serve ads to you based on your visit to this site and other sites on the internet.',
      optOutLead: 'You may opt out of personalized advertising by visiting',
      optOutLinkLabel: 'Ads Settings',
      aboutAdsLead:
        'If you prefer not to use Google’s opt-out, many third-party vendors’ cookies can be disabled at',
      aboutAdsLinkLabel: 'www.aboutads.info',
      policiesLead: 'Third-party vendors’ use of cookies on this site is governed by',
      policiesLinkLabel: 'Google’s advertising policies',
    },
    cookies: {
      heading: 'Cookies',
      intro: 'A cookie is a small file a site stores in your browser.',
      adLabel: 'Advertising cookies',
      adBody: 'are set by Google as described above.',
      themeLabel: 'Preference storage.',
      themeBody:
        'Your light/dark theme choice is stored locally in your browser. It never leaves your device and is not a tracking cookie.',
      blocking:
        'You can block or delete cookies through your browser settings. Blocking advertising cookies does not prevent you from using the site; you will simply see less relevant ads.',
    },
    gdpr: {
      heading: 'Your rights (GDPR)',
      body: 'If you are in the European Economic Area or the United Kingdom, you have the right to access, correct, or erase personal data held about you, to object to or restrict its processing, and to data portability. Because this site holds no account or contact database, in practice this concerns server logs and advertising cookies.',
      exerciseLead: 'To exercise any of these rights, email',
      exerciseTail: 'You also have the right to complain to your local data protection authority.',
    },
    ccpa: {
      heading: 'Your rights (CCPA)',
      body: 'If you are a California resident, you have the right to know what personal information is collected and to request its deletion.',
      notSold: 'Personal information is not sold, and never has been.',
      requestLead: 'To make a request, email',
    },
    contact: {
      heading: 'Contact',
      lead: 'Questions about this policy:',
    },
    changes: {
      heading: 'Changes to this policy',
      body: 'This policy may be updated as the site changes. The effective date at the top reflects the most recent revision. Material changes will be noted on this page rather than announced separately.',
    },
  },
  meta: {
    home: 'CarsickYak — gaming, folk covers, and self growth. Live on Twitch Monday, Wednesday, and Saturday.',
    yak2peak:
      'yak2peak — a challenge where I try to reach my peak rank in games I used to be good at. The full ladder: done, doing, next.',
    about:
      'Gamer, Coder, Philosopher, Writer, Outdoorsman, Musician, Athlete, Nerd. The person behind CarsickYak.',
    covers: 'Folk covers recorded live on stream.',
    privacy:
      'What carsickyak.crawfordyoung.dev collects, how advertising cookies are used, and how to opt out.',
  },
} as const
