export const locales = ['en', 'zh', 'ja', 'fr', 'de', 'es', 'ru', 'ar', 'ko', 'hi', 'vi', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// 语言显示名称和标识
export const languageNames = {
  en: { name: 'English', nativeName: 'English', flagPath: '/images/flags/us.svg' },
  zh: { name: 'Chinese', nativeName: '中文', flagPath: '/images/flags/cn.svg' },
  ja: { name: 'Japanese', nativeName: '日本語', flagPath: '/images/flags/jp.svg' },
  fr: { name: 'French', nativeName: 'Français', flagPath: '/images/flags/fr.svg' },
  de: { name: 'German', nativeName: 'Deutsch', flagPath: '/images/flags/de.svg' },
  es: { name: 'Spanish', nativeName: 'Español', flagPath: '/images/flags/es.svg' },
  ru: { name: 'Russian', nativeName: 'Русский', flagPath: '/images/flags/ru.svg' },
  ar: { name: 'Arabic', nativeName: 'العربية', flagPath: '/images/flags/sa.svg' },
  ko: { name: 'Korean', nativeName: '한국어', flagPath: '/images/flags/kr.svg' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flagPath: '/images/flags/in.svg' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flagPath: '/images/flags/vn.svg' },
  pt: { name: 'Portuguese', nativeName: 'Português', flagPath: '/images/flags/pt.svg' }
} as const; 