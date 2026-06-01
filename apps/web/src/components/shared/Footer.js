// =============================================================================
// Footer — site footer with brand, description, nav links, social profiles, and
// copyright. Brand name and description come from Sanity Site Settings.
// Social profile URLs come from siteSettings.socialProfiles. Icons are lucide-react
// semantic stand-ins (lucide-react has no brand logos).
// =============================================================================

import Link from 'next/link'
import {X, Link2, Code2, PlayCircle, Globe, Camera} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'

/**
 * Map Sanity platform values to the closest available lucide-react icon.
 * lucide-react has no brand logos — we use semantic stand-ins.
 * Unmapped platforms fall back to Globe.
 */
const PLATFORM_ICONS = {
  twitter:   X,           // X brand
  linkedin:  Link2,       // professional links
  github:    Code2,       // code
  youtube:   PlayCircle,  // video / play
  facebook:  Globe,       // global network
  instagram: Camera,      // photos
}

/**
 * @param {{
 *   locale: string,
 *   brand?: string,
 *   description?: string,
 *   socialProfiles?: {platform: string, url: string}[]
 * }} props
 */
export default function Footer({locale, brand = 'YourBrand', description, socialProfiles = []}) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        <div className="flex flex-col sm:flex-row gap-10 pb-12 border-b border-tertiary">

          {/* Brand + description from Sanity Site Settings */}
          <div className="flex-1">
            <Link href={localizedPath(locale, '/')} className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-md" />
              <span className="text-white font-bold text-base">{brand}</span>
            </Link>
            {description ? (
              <p className="text-sm leading-relaxed max-w-xs">{description}</p>
            ) : null}
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={localizedPath(locale, '/blog')} className="text-sm hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/#faq')} className="text-sm hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar: copyright + social icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs">
          <p>&copy; {year} {brand}. All rights reserved.</p>

          {/* Social icons pulled from Sanity Site Settings → socialProfiles */}
          {socialProfiles?.length ? (
            <div className="flex items-center gap-3">
              {socialProfiles.map(({platform, url}) => {
                const Icon = PLATFORM_ICONS[platform] || Globe
                const label = platform.charAt(0).toUpperCase() + platform.slice(1)
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-md flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>

      </div>
    </footer>
  )
}
