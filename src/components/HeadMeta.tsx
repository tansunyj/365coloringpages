'use client';

import { useEffect } from 'react';

/**
 * 客户端 Head Meta 组件
 * 用于在客户端确保 meta 标签正确插入到 <head> 中
 * 这是为了解决 Next.js 15 + Turbopack 开发模式下 metadata 可能在 body 中的问题
 */
export function HeadMeta({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}) {
  useEffect(() => {
    // 设置 title
    if (title) {
      document.title = title;
    }

    // 设置或更新 meta 标签
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // 设置 link 标签
    const setLinkTag = (rel: string, href: string) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      
      link.href = href;
    };

    // 基础 SEO meta 标签
    if (description) setMetaTag('description', description);
    if (keywords) setMetaTag('keywords', keywords);
    
    // Canonical URL
    if (canonical) setLinkTag('canonical', canonical);
    
    // Open Graph
    if (ogTitle) setMetaTag('og:title', ogTitle, true);
    if (ogDescription) setMetaTag('og:description', ogDescription, true);
    if (ogUrl) setMetaTag('og:url', ogUrl, true);
    if (ogImage) setMetaTag('og:image', ogImage, true);
    
    // Twitter Card
    if (twitterTitle) setMetaTag('twitter:title', twitterTitle);
    if (twitterDescription) setMetaTag('twitter:description', twitterDescription);
    if (twitterImage) setMetaTag('twitter:image', twitterImage);
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogUrl, ogImage, twitterTitle, twitterDescription, twitterImage]);

  return null;
}

