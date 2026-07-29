import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage from '@/app/privacy/page'

describe('PrivacyPage', () => {
  it('renders the policy heading', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { name: /privacy policy/i, level: 1 })).toBeInTheDocument()
  })

  it('discloses Google as a third-party ad vendor', () => {
    render(<PrivacyPage />)
    // getAllByText, not getByText: the phrase appears in both the vendor bullet
    // and the advertising-policies bullet, and an ancestor <li> matches too.
    expect(screen.getAllByText(/third-party vendor/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/DoubleClick/i).length).toBeGreaterThan(0)
  })

  it('links to the Google ads opt-out', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('link', { name: /ads settings/i })).toHaveAttribute(
      'href',
      'https://www.google.com/settings/ads',
    )
  })

  it('links to Google advertising policies and the aboutads opt-out', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('link', { name: /advertising policies/i })).toHaveAttribute(
      'href',
      'https://policies.google.com/technologies/ads',
    )
    expect(screen.getByRole('link', { name: /aboutads/i })).toHaveAttribute(
      'href',
      'https://www.aboutads.info/choices/',
    )
  })

  it('discloses that YouTube thumbnails are fetched from Google', () => {
    render(<PrivacyPage />)
    expect(screen.getAllByText(/youtube thumbnails/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /google’s privacy policy/i })).toHaveAttribute(
      'href',
      'https://policies.google.com/privacy',
    )
  })

  it('covers both GDPR and CCPA rights', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { name: /gdpr/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ccpa/i, level: 2 })).toBeInTheDocument()
  })

  it('gives a contact address for rights requests', () => {
    render(<PrivacyPage />)
    const links = screen.getAllByRole('link', { name: /hello@crawfordyoung\.dev/i })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href', 'mailto:hello@crawfordyoung.dev')
  })
})
