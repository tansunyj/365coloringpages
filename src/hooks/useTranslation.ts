'use client';

import { useState, useEffect } from 'react';
import { type Locale } from '@/i18n/config';

// 动态导入翻译文件
const loadMessages = async (locale: Locale) => {
  try {
    const messages = await import(`@/messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    // 如果加载失败，回退到英文
    const messages = await import(`@/messages/en.json`);
    return messages.default;
  }
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 从localStorage或URL检测语言
  useEffect(() => {
    const detectLocale = (): Locale => {
      // 首先检查URL路径
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        const possibleLocale = segments[0] as Locale;
        
        // 检查是否是有效的语言代码
        const validLocales: Locale[] = ['en', 'zh', 'ja', 'fr', 'de', 'es', 'ru', 'ar', 'ko', 'hi', 'vi', 'pt'];
        if (validLocales.includes(possibleLocale)) {
          return possibleLocale;
        }
        
        // 如果URL中没有语言代码，检查localStorage
        const savedLocale = localStorage.getItem('preferred-locale') as Locale;
        if (savedLocale && validLocales.includes(savedLocale)) {
          return savedLocale;
        }
        
        // 最后检查浏览器语言
        const browserLang = navigator.language.split('-')[0] as Locale;
        if (validLocales.includes(browserLang)) {
          return browserLang;
        }
      }
      
      return 'en'; // 默认英文
    };

    const detectedLocale = detectLocale();
    setLocale(detectedLocale);
  }, []);

  // 加载翻译文件
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const loadedMessages = await loadMessages(locale);
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  // 翻译函数
  const t = (key: string, fallback?: string): string => {
    try {
      const keys = key.split('.');
      let value = messages;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return fallback || key;
        }
      }
      
      return typeof value === 'string' ? value : (fallback || key);
    } catch {
      return fallback || key;
    }
  };

  // 更改语言
  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
  };

  return {
    locale,
    t,
    changeLanguage,
    isLoading
  };
} 