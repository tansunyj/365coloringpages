'use client';

import { useEffect } from 'react';

/**
 * 客户�?Meta 标签修复组件
 * 
 * 目的：确保所�?meta 标签都在 <head> 中，而不�?<body> �?
 * 原因：Next.js 15 + Turbopack 开发模式的已知 bug
 * 
 * 工作原理�?
 * 1. 在客户端检测所有在 <body> 中的 meta 标签
 * 2. 将它们移动到 <head> �?
 * 3. 确保 SEO 爬虫看到正确�?HTML 结构
 */
export default function ClientMetaFix() {
  useEffect(() => {
    // 等待 DOM 完全加载
    const moveMetaTagsToHead = () => {
      // 查找所有在 body 中的 meta 标签
      const bodyMetas = document.body.querySelectorAll('meta, title, link[rel="canonical"]');
      
      if (bodyMetas.length > 0) {

        bodyMetas.forEach((meta) => {
          // 移动�?head
          document.head.appendChild(meta);
        });
        
      }
    };
    
    // 立即执行
    moveMetaTagsToHead();
    
    // �?DOM 变化后再次执行（以防有延迟加载的 meta 标签�?
    const observer = new MutationObserver(() => {
      moveMetaTagsToHead();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // 清理
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return null; // 这个组件不渲染任何内�?
}

