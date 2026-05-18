interface PageSeo {
  title: string
  description: string
  path: string
}

const SITE_URL = 'https://upspell.vercel.app'
const SOCIAL_IMAGE = `${SITE_URL}/upspell-social.png`

export function usePageSeo({
  title,
  description,
  path,
}: PageSeo) {
  const url = `${SITE_URL}${path}`
  useSeoMeta({
    title,
    description,
    ogType: 'website',
    ogUrl: url,
    ogTitle: title,
    ogDescription: description,
    ogImage: SOCIAL_IMAGE,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: SOCIAL_IMAGE,
  })
  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}
