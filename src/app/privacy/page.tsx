import type { Metadata } from 'next'

import { copy } from '@/lib/copy'

export const metadata: Metadata = {
  title: copy.privacy.pageTitle,
  description: copy.meta.privacy,
}

const ADS_SETTINGS_URL = 'https://www.google.com/settings/ads'
const ABOUT_ADS_URL = 'https://www.aboutads.info/choices/'
const GOOGLE_AD_POLICIES_URL = 'https://policies.google.com/technologies/ads'
const GOOGLE_PRIVACY_URL = 'https://policies.google.com/privacy'
const CONTACT_EMAIL = 'hello@crawfordyoung.dev'

const LINK_CLASS = 'text-foreground underline underline-offset-4'

function ExternalLink({
  href,
  children,
}: {
  readonly href: string
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {children}
    </a>
  )
}

function ContactLink(): React.JSX.Element {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
      {CONTACT_EMAIL}
    </a>
  )
}

export default function PrivacyPage(): React.JSX.Element {
  const { privacy } = copy
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {privacy.pageTitle}
      </h1>
      <p className="text-muted-foreground mt-4 text-sm tracking-[0.2em] uppercase">
        {privacy.effectiveDate}
      </p>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {privacy.covers.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.covers.body}</p>
        <p className="mt-4 text-base leading-relaxed">{privacy.covers.offsite}</p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {privacy.collected.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.collected.intro}</p>
        <ul className="mt-4 flex list-disc flex-col gap-3 pl-6 text-base leading-relaxed">
          <li>
            <strong className="font-semibold">{privacy.collected.logsLabel}</strong>{' '}
            {privacy.collected.logsBody}
          </li>
          <li>
            <strong className="font-semibold">{privacy.collected.analyticsLabel}</strong>{' '}
            {privacy.collected.analyticsBody}
          </li>
          <li>
            <strong className="font-semibold">{privacy.collected.thumbnailsLabel}</strong>{' '}
            {privacy.collected.thumbnailsBody}{' '}
            <ExternalLink href={GOOGLE_PRIVACY_URL}>
              {privacy.collected.thumbnailsLinkLabel}
            </ExternalLink>{' '}
            {privacy.collected.thumbnailsBodyEnd}
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {privacy.advertising.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.advertising.intro}</p>
        <ul className="mt-4 flex list-disc flex-col gap-3 pl-6 text-base leading-relaxed">
          <li>
            {privacy.advertising.vendorLead}{' '}
            <strong className="font-semibold">{privacy.advertising.vendorEmphasis}</strong>{' '}
            {privacy.advertising.vendorTail}
          </li>
          <li>
            {privacy.advertising.doubleclickLead}{' '}
            <strong className="font-semibold">{privacy.advertising.doubleclickEmphasis}</strong>{' '}
            {privacy.advertising.doubleclickTail}
          </li>
          <li>
            {privacy.advertising.optOutLead}{' '}
            <ExternalLink href={ADS_SETTINGS_URL}>
              {privacy.advertising.optOutLinkLabel}
            </ExternalLink>
            .
          </li>
          <li>
            {privacy.advertising.aboutAdsLead}{' '}
            <ExternalLink href={ABOUT_ADS_URL}>
              {privacy.advertising.aboutAdsLinkLabel}
            </ExternalLink>
            .
          </li>
          <li>
            {privacy.advertising.policiesLead}{' '}
            <ExternalLink href={GOOGLE_AD_POLICIES_URL}>
              {privacy.advertising.policiesLinkLabel}
            </ExternalLink>
            .
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {privacy.cookies.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.cookies.intro}</p>
        <ul className="mt-4 flex list-disc flex-col gap-3 pl-6 text-base leading-relaxed">
          <li>
            <strong className="font-semibold">{privacy.cookies.adLabel}</strong>{' '}
            {privacy.cookies.adBody}
          </li>
          <li>
            <strong className="font-semibold">{privacy.cookies.themeLabel}</strong>{' '}
            {privacy.cookies.themeBody}
          </li>
        </ul>
        <p className="mt-4 text-base leading-relaxed">{privacy.cookies.blocking}</p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">{privacy.gdpr.heading}</h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.gdpr.body}</p>
        <p className="mt-4 text-base leading-relaxed">
          {privacy.gdpr.exerciseLead} <ContactLink />. {privacy.gdpr.exerciseTail}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">{privacy.ccpa.heading}</h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.ccpa.body}</p>
        <p className="mt-4 text-base leading-relaxed">
          <strong className="font-semibold">{privacy.ccpa.notSold}</strong>{' '}
          {privacy.ccpa.requestLead} <ContactLink />.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {privacy.contact.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed">
          {privacy.contact.lead} <ContactLink />.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {privacy.changes.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed">{privacy.changes.body}</p>
      </section>
    </main>
  )
}
