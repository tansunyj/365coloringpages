/**
 * JSON-LD Structured Data Component
 * Provides rich snippets for search engines
 */

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Homepage Organization Schema
 * Based on Schema.org standards
 */
export function HomePageJsonLd() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com';
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '365 Coloring Pages',
    url: site,
    logo: `${site}/logo.png`,
    description: 'Free printable coloring pages for kids and adults. Browse 10,000+ high-quality coloring sheets featuring animals, characters, holidays and more.',
    sameAs: [
      'https://twitter.com/365coloringpages',
      'https://facebook.com/365coloringpages',
      'https://pinterest.com/365coloringpages',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '365 Coloring Pages',
    url: site,
    description: 'Browse 10,000+ free printable coloring pages for kids and adults.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: site,
      },
    ],
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}

/**
 * Collection Page Schema
 * For category and list pages
 */
export function CollectionPageJsonLd({
  name,
  description,
  url,
  numberOfItems,
}: {
  name: string;
  description: string;
  url: string;
  numberOfItems?: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    ...(numberOfItems && { numberOfItems }),
  };

  return <JsonLd data={schema} />;
}

/**
 * Creative Work Schema
 * For individual coloring page detail pages
 */
export function CreativeWorkJsonLd({
  name,
  description,
  image,
  url,
  author,
  datePublished,
  keywords,
}: {
  name: string;
  description: string;
  image: string;
  url: string;
  author?: string;
  datePublished?: string;
  keywords?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    image,
    url,
    author: {
      '@type': 'Organization',
      name: author || '365 Coloring Pages',
    },
    publisher: {
      '@type': 'Organization',
      name: '365 Coloring Pages',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://365coloringpages.com'}/logo.png`,
      },
    },
    ...(datePublished && { datePublished }),
    ...(keywords && { keywords: keywords.join(', ') }),
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
  };

  return <JsonLd data={schema} />;
}

