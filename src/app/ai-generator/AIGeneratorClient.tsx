'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Wand2, History, Sparkles, ChevronUp, ChevronDown, AlertTriangle, Loader2, CheckCircle2, XCircle, Download, Printer, Image as ImageIcon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import LoginDialog from '../../components/LoginDialog';
import {
  generateAIImage,
  editAIImage,
  getRemainingGenerations,
  getMyCreations,
  formatErrorMessage,
  isAuthenticated,
  type GeneratedImage,
} from '../../lib/ai-api';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// 扩展 GeneratedImage 类型，添加错误信息字段
interface GeneratedImageWithError extends GeneratedImage {
  errorMessage?: string;
}

/**
 * 格式化时间为 yyyy-MM-dd HH:mm:ss
 * 支持 Date 对象或 ISO 字符串
 */
function formatDateTime(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效时间';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default function AIGeneratorClient() {
  const [prompt, setPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState(0);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [history, setHistory] = useState<GeneratedImageWithError[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingRemaining, setIsLoadingRemaining] = useState(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showPromptTooltip, setShowPromptTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; right: number } | null>(null);
  
  // 生成模式：文生图 or 图生图
  const [generationMode, setGenerationMode] = useState<'text-to-image' | 'image-to-image'>('text-to-image');
  
  // 防止重复调用的标志位（解决 React Strict Mode 导致的重复挂载问题）
  const isInitializedRef = useRef(false);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const [rightPanelHeight, setRightPanelHeight] = useState<number>(0);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 显示 Toast 提示
   */
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  /**
   * 加载初始数据：剩余次数和历史记录
   */
  const loadInitialData = useCallback(async () => {
    try {
      // 检查是否已登录 - 如果未登录，静默返回，不显示警告
      if (!isAuthenticated()) {
        setIsLoadingHistory(false);
        setIsLoadingRemaining(false);
        return;
      }

      // 并行加载剩余次数和历史记录
      const [remainingData, historyData] = await Promise.all([
        getRemainingGenerations().catch(() => ({ remaining: 0, used: 0, limit: 20 })),
        getMyCreations(1, 20).catch(() => ({ images: [], pagination: null })),
      ]);

      setGenerationsRemaining(remainingData.remaining);
      // 确保按ID倒序排列（最新的在前）- ID为字符串类型，需要转换为数字比较
      const sortedImages = historyData.images.sort((a, b) => {
        const idA = parseInt(a.id, 10);
        const idB = parseInt(b.id, 10);
        return idB - idA;
      });
      // 后端已经返回了正确的 status，直接使用
      setHistory(sortedImages);
      setHistoryPage(1);
      
      // 检查是否还有更多数据
      if (historyData.pagination) {
        const hasMore = historyData.pagination.hasNextPage;
        setHasMoreHistory(hasMore);
      } else {
        setHasMoreHistory(false);
      }
    } catch (err) {
      console.error('加载初始数据失败:', err);
      showToast('加载数据失败，请刷新页面重试', 'error');
    } finally {
      setIsLoadingHistory(false);
      setIsLoadingRemaining(false);
    }
  }, [showToast]);

  /**
   * 加载更多历史记录 - 使用 ref 彻底避免闭包和依赖问题
   */
  const loadingMoreRef = useRef(false);
  const historyPageRef = useRef(1);
  const hasMoreHistoryRef = useRef(true);
  const scrollListenerBoundRef = useRef(false); // 标记滚动监听是否已绑定
  const sentinelRef = useRef<HTMLDivElement>(null); // 底部观察哨兵
  const pendingTriggerRef = useRef(false); // 有待处理的下一次触发
  
  // 同步 state 到 ref
  useEffect(() => {
    historyPageRef.current = historyPage;
  }, [historyPage]);
  
  useEffect(() => {
    hasMoreHistoryRef.current = hasMoreHistory;
  }, [hasMoreHistory]);
  
  const loadMoreHistory = useCallback(async () => {
    const currentPage = historyPageRef.current;
    const currentHasMore = hasMoreHistoryRef.current;
    const isLoading = loadingMoreRef.current;
    
    if (!isAuthenticated()) {
      return;
    }
    
    if (isLoading) {
      // 如果已经在加载，设置待处理标志，等当前加载完成后会自动触发
      pendingTriggerRef.current = true;
      return;
    }
    
    if (!currentHasMore) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    
    try {
      const nextPage = currentPage + 1;
      const historyData = await getMyCreations(nextPage, 20);
      
      if (historyData.images.length > 0) {
        // 确保按ID倒序排列，并去重
        setHistory(prev => {
          const newImages = historyData.images
            .filter(newImg => !prev.some(existingImg => existingImg.id === newImg.id));
          // 后端已经返回了正确的 status，直接使用
          return [...prev, ...newImages].sort((a, b) => {
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);
            return idB - idA;
          });
        });
        setHistoryPage(nextPage);
        
        // 检查是否还有更多数据
        if (historyData.pagination) {
          const hasMore = historyData.pagination.hasNextPage;
          setHasMoreHistory(hasMore);
        } else {
          setHasMoreHistory(false);
        }
      } else {
        setHasMoreHistory(false);
      }
    } catch (err) {
      console.error('❌ 加载失败:', err);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
      // 若期间有挂起触发，顺序执行下一次
      if (pendingTriggerRef.current && hasMoreHistoryRef.current) {
        pendingTriggerRef.current = false;
        // 微任务队列中触发，避免和渲染竞争
        Promise.resolve().then(() => loadMoreHistory());
      }
    }
  }, []); // 空依赖数组 - 函数永远不会重新创建

  // 页面加载时获取初始数据
  useEffect(() => {
    // 如果已经初始化过，直接返回
    if (isInitializedRef.current) {
      return;
    }
    
    // 标记为已初始化
    isInitializedRef.current = true;
    
    // 加载初始数据
    loadInitialData();
  }, [loadInitialData]);

  // 监听滚动事件，实现无限滚动 - 等待 DOM 渲染完成，只绑定一次
  useEffect(() => {
    // 如果已经绑定过，不再重复绑定
    if (scrollListenerBoundRef.current) {
      return;
    }
    
    // 等待 isLoadingHistory 变为 false，说明数据已加载且 DOM 已渲染
    if (isLoadingHistory) {
      return;
    }

    // 使用更长的延迟确保 DOM 完全渲染
    const bindScrollTimer = setTimeout(() => {
      const scrollElement = historyScrollRef.current;
      if (!scrollElement) {
        return;
      }

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        
        // 当滚动到距离底部20px时再尝试触发（更靠近底部）
        if (distanceToBottom < 20) {
          if (loadingMoreRef.current) {
            pendingTriggerRef.current = true;
          } else {
            loadMoreHistory();
          }
        }
      };

      scrollElement.addEventListener('scroll', handleScroll);
      scrollListenerBoundRef.current = true; // 标记为已绑定
      
      // 初始检查：如果内容不够长，立即加载更多
      const checkInitialLoad = () => {
        const { scrollHeight, clientHeight } = scrollElement;
        
        if (scrollHeight <= clientHeight) {
          loadMoreHistory();
        }
      };
      
      // 延迟检查，等待DOM更新
      setTimeout(checkInitialLoad, 800);
    }, 800); // 延迟 800ms 等待 DOM 完全渲染
    
    return () => {
      clearTimeout(bindScrollTimer);
    };
  }, [isLoadingHistory, loadMoreHistory, history.length]); // history.length 变化时重新检查（但只绑定一次）
  
  // 当历史记录更新后，检查是否需要继续加载
  useEffect(() => {
    const scrollElement = historyScrollRef.current;
    if (!scrollElement || isLoadingMore) return;
    
    // 延迟检查，等待DOM渲染完成
    const timer = setTimeout(() => {
      const { scrollHeight, clientHeight } = scrollElement;
      
      // 如果内容仍然不够长，继续加载
      if (scrollHeight <= clientHeight && hasMoreHistoryRef.current && !loadingMoreRef.current) {
        loadMoreHistory();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [history, isLoadingMore, loadMoreHistory]);

  // 使用 IntersectionObserver 作为可靠的无限滚动触发器
  useEffect(() => {
    if (isLoadingHistory) return;
    const root = historyScrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMoreHistoryRef.current) {
          if (loadingMoreRef.current) {
            pendingTriggerRef.current = true;
          } else {
            loadMoreHistory();
          }
        }
      },
      // rootMargin 设为负值：仅当哨兵接近底部 80px 内才触发
      { root, threshold: 0, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isLoadingHistory, loadMoreHistory]);

  // 动态计算左侧内容高度，并应用到右侧
  useEffect(() => {
    const updateRightPanelHeight = () => {
      if (leftContentRef.current) {
        const height = leftContentRef.current.offsetHeight;
        setRightPanelHeight(height);
      }
    };

    // 初始计算
    updateRightPanelHeight();

    // 监听窗口大小变化
    window.addEventListener('resize', updateRightPanelHeight);
    
    // 使用 ResizeObserver 监听左侧内容大小变化
    const resizeObserver = new ResizeObserver(updateRightPanelHeight);
    if (leftContentRef.current) {
      resizeObserver.observe(leftContentRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateRightPanelHeight);
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * 刷新剩余次数
   */
  const refreshRemaining = async () => {
    try {
      const data = await getRemainingGenerations();
      setGenerationsRemaining(data.remaining);
    } catch (err) {
      console.error('刷新剩余次数失败:', err);
    }
  };

  /**
   * 生成图片
   */
  const handleGenerate = async () => {
    // 检查登录状态 - 如果未登录，打开登录对话框
    if (!isAuthenticated()) {
      setIsLoginDialogOpen(true);
      showToast('请先登录或注册账号以使用 AI 生成功能', 'warning');
      return;
    }

    // Validate prompt
    if (!prompt.trim()) {
      showToast('请输入提示词', 'warning');
      return;
    }

    // 图生图模式需要有当前图片
    if (generationMode === 'image-to-image' && !currentImage) {
      showToast('请先选择一张图片', 'warning');
      return;
    }

    // 检查剩余次数
    if (generationsRemaining <= 0) {
      showToast('今日生成次数已用完，请明天再试', 'warning');
      return;
    }

    setIsGenerating(true);
    // 立即关闭展开的输入框，变回单行形态
    setIsPromptExpanded(false);
    
    // 生成临时ID（使用时间戳）
    const tempId = `temp-${Date.now()}`;
    const currentPrompt = prompt.trim();
    
    // 立即添加 pending 状态的记录到历史记录顶部
    const pendingImage: GeneratedImageWithError = {
      id: tempId,
      prompt: currentPrompt,
      imageUrl: '', // 暂时为空
      timestamp: new Date(),
      status: 'pending',
    };
    
    setHistory(prev => [pendingImage, ...prev]);
    
    try {
      let newImage: GeneratedImage;
      
      // 根据模式调用不同的API
      if (generationMode === 'image-to-image' && currentImage) {
        // 图生图
        newImage = await editAIImage(currentImage.imageUrl, currentPrompt);
      } else {
        // 文生图
        newImage = await generateAIImage(currentPrompt);
      }
      
      // 更新当前图片
      setCurrentImage(newImage);
      
      // 更新历史记录中的 pending 记录为 completed 状态
      setHistory(prev => prev.map(item => 
        item.id === tempId 
          ? { ...newImage, status: 'completed' as const }
          : item
      ));
      
      // 刷新剩余次数
      await refreshRemaining();
      
      // 显示成功提示
      showToast(generationMode === 'image-to-image' ? '图片编辑成功！' : '图片生成成功！', 'success');
      
    } catch (err) {
      console.error('生成图片失败:', err);
      
      // 更新历史记录中的 pending 记录为 failed 状态
      setHistory(prev => prev.map(item => 
        item.id === tempId 
          ? { ...item, status: 'failed' as const, errorMessage: formatErrorMessage(err) }
          : item
      ));
      
      showToast(formatErrorMessage(err), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 登录成功的回调
   */
  const handleLoginSuccess = () => {
    // 重新加载初始数据（剩余次数和历史记录）
    loadInitialData();
    showToast('登录成功！欢迎回来 🎨', 'success');
  };

  /**
   * 从历史记录中选择图片
   */
  const selectFromHistory = (image: GeneratedImageWithError) => {
    // 只有成功的图片才能被选中显示
    if (image.status === 'completed' || !image.status) {
      setCurrentImage(image);
      setPrompt(image.prompt);
    }
  };

  /**
   * 处理鼠标进入历史记录卡片
   */
  const handleImageHoverStart = (imageId: string, event: React.MouseEvent<HTMLDivElement>) => {
    // 清除之前的计时器
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    // 保存当前目标元素
    const target = event.currentTarget;
    
    // 2秒后显示提示词
    hoverTimerRef.current = setTimeout(() => {
      // 检查元素是否还存在
      if (target && document.contains(target)) {
        // 计算提示框位置
        const rect = target.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top,
          right: window.innerWidth - rect.left + 12, // 12px 间距
        });
        setShowPromptTooltip(imageId);
      }
    }, 2000);
  };

  /**
   * 处理鼠标离开历史记录卡片
   */
  const handleImageHoverEnd = () => {
    // 鼠标离开时只清除计时器，不关闭已显示的提示框
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  /**
   * 关闭提示词框
   */
  const closePromptTooltip = () => {
    setShowPromptTooltip(null);
    setTooltipPosition(null);
  };

  /**
   * 下载当前图片 - 使用代理 API 下载图片
   */
  const handleDownloadImage = async () => {
    if (!currentImage?.imageUrl) return;

    try {
      showToast('正在准备下载...', 'info');
      
      // 使用代理 API 获取图片
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(currentImage.imageUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = `coloring-page-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('图片下载成功！', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showToast('下载失败，请稍后重试', 'error');
    }
  };

  /**
   * 打印当前图片 - 使用代理 API 加载图片
   */
  const handlePrintImage = async () => {
    if (!currentImage?.imageUrl) return;

    try {
      showToast('正在准备打印...', 'info');
      
      // 使用代理 API 获取图片
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(currentImage.imageUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showToast('请允许弹出窗口以便打印', 'warning');
        window.URL.revokeObjectURL(blobUrl);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Coloring Page</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body {
                  padding: 0;
                }
                img {
                  max-width: 100%;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img src="${blobUrl}" alt="Coloring Page" onload="window.print();" />
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // 打印完成后清理 blob URL
      printWindow.onafterprint = () => {
        window.URL.revokeObjectURL(blobUrl);
      };
      
      // 如果用户取消打印，也要清理（5秒后）
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 5000);
    } catch (error) {
      console.error('Print failed:', error);
      showToast('打印准备失败，请稍后重试', 'error');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />

      <main className="py-4">
        {/* 整体布局容器 - 紧凑布局，减少空白 */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex gap-4">
            
            {/* 左侧：主要内容区域 */}
            <div ref={leftContentRef} className="flex-1 flex flex-col gap-6">
              
              {/* 正方形容器 - 顶部对齐，充分利用空间 */}
              <div className="flex-shrink-0">
                <div className="w-full max-w-[1000px] aspect-square">
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 h-full w-full flex items-center justify-center hover:shadow-xl transition-all duration-300">
                    {currentImage ? (
                      <div className="relative w-full h-full aspect-square group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-20 blur-lg"></div>
                        <div className="relative bg-white rounded-3xl p-3 shadow-xl h-full w-full">
                              <Image
                                src={currentImage.imageUrl}
                                alt={currentImage.prompt}
                                fill
                                className="object-contain rounded-2xl"
                                unoptimized
                              />
                              
                              {/* 图片操作按钮 - 右上角 */}
                              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {/* 下载按钮 */}
                                <button
                                  onClick={handleDownloadImage}
                                  className="p-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                                  title="下载图片"
                                >
                                  <Download className="h-5 w-5 text-green-600 group-hover/btn:scale-110 transition-transform" />
                                </button>
                                
                                {/* 打印按钮 */}
                                <button
                                  onClick={handlePrintImage}
                                  className="p-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                                  title="打印图片"
                                >
                                  <Printer className="h-5 w-5 text-purple-600 group-hover/btn:scale-110 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="relative mb-6">
                          <div className="w-40 h-40 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <Wand2 className="h-20 w-20 text-blue-500" />
                          </div>
                          <div className="absolute top-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                          Your Canvas Awaits
                        </h3>
                        <p className="text-gray-600 max-w-lg leading-relaxed text-lg">
                          Describe your ideal coloring page and let AI create unique artwork for you.
                        </p>
                        <div className="flex items-center gap-2 mt-6 text-base text-gray-500">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          <span>Describe your idea in the input box below</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 遮罩层 - 展开时显示 */}
              {isPromptExpanded && (
                <div 
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
                  onClick={() => setIsPromptExpanded(false)}
                />
              )}

              {/* 提示词输入区域 - 可折叠，向上浮动展开 */}
              <div className={`bg-white rounded-3xl border border-gray-100 overflow-hidden max-w-[1000px] ${
                isPromptExpanded 
                  ? 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[1000px] w-[calc(100%-2rem)] shadow-2xl animate-in slide-in-from-bottom-4 duration-300' 
                  : 'relative shadow-lg'
              }`}>
                {/* 折叠头部 - 始终显示的一行 */}
                <div 
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Wand2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        {!isPromptExpanded ? (
                          <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your creative idea, AI will generate a unique coloring page... (Click to expand)"
                            className="w-full text-lg border-none bg-transparent focus:outline-none placeholder-gray-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPromptExpanded(true);
                            }}
                          />
                        ) : (
                          <h3 className="text-lg font-semibold text-gray-900">Create Your Coloring Page</h3>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {!isPromptExpanded && prompt.trim() && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAuthenticated()) {
                                setIsLoginDialogOpen(true);
                              } else {
                                handleGenerate();
                              }
                            }}
                            disabled={!prompt.trim() || (isAuthenticated() && generationsRemaining <= 0) || isGenerating}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                <span>Generate</span>
                              </>
                            )}
                          </button>
                          {!isAuthenticated() && (
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Login required
                            </span>
                          )}
                        </>
                      )}
                      <div className="text-gray-400">
                        {isPromptExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 展开内容 - 多行编辑模式 */}
                {isPromptExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    {/* 生成模式选择 */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Generation Mode
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setGenerationMode('text-to-image')}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                            generationMode === 'text-to-image'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span>Text to Image</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setGenerationMode('image-to-image')}
                          disabled={!currentImage}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                            generationMode === 'image-to-image'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${!currentImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>Image to Image</span>
                          </div>
                        </button>
                      </div>
                      {generationMode === 'image-to-image' && !currentImage && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Please select an image from history first
                        </p>
                      )}
                      {generationMode === 'image-to-image' && currentImage && (
                        <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Image selected, enter prompt to edit
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Describe Your Ideal Coloring Page
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={generationMode === 'image-to-image' 
                          ? "Describe how you want to modify the image...\n\nFor example: Add a red hat on the dog, or change the background color, etc." 
                          : "Enter your creative idea, AI will generate a unique coloring page...\n\nFor example: A magical forest with talking animals and glowing mushrooms. Or describe the scene, characters, style you want, etc."}
                        className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 text-base leading-relaxed placeholder-gray-400"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-5">
                      <div className="text-sm">
                        {isLoadingRemaining ? (
                          <span className="flex items-center gap-2 text-gray-500">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                            Loading...
                          </span>
                        ) : !isAuthenticated() ? (
                          <div className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Please <button onClick={() => setIsLoginDialogOpen(true)} className="font-semibold underline hover:text-orange-700">login or register</button> to generate images</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Remaining generations today: <span className={`font-semibold ${generationsRemaining > 0 ? 'text-blue-600' : 'text-red-600'}`}>{generationsRemaining}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsPromptExpanded(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          Collapse
                        </button>
                        <button
                          onClick={() => {
                            if (!isAuthenticated()) {
                              setIsLoginDialogOpen(true);
                            } else {
                              handleGenerate();
                            }
                          }}
                          disabled={!prompt.trim() || (isAuthenticated() && generationsRemaining <= 0) || isGenerating}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>AI is Creating Magic...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              <span>Generate Coloring Page</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：历史记录 - 独占细长列，与左侧内容对齐 */}
            <div className="w-48 flex-shrink-0 hidden lg:block">
              <div 
                className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 flex flex-col overflow-visible" 
                style={{ height: rightPanelHeight > 0 ? `${rightPanelHeight}px` : 'auto' }}
              >
                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                  <History className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700">历史记录</h3>
                </div>
                
                {isLoadingHistory ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500">加载中...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      ref={historyScrollRef}
                      className="flex-1 overflow-y-auto overflow-x-visible pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgb(209 213 219) transparent',
                        minHeight: 0
                      }}
                    >
                      {history.map((image) => (
                        <div
                          key={image.id}
                          className="mb-3 relative"
                        >
                          <div
                            onClick={() => image.status !== 'pending' && selectFromHistory(image)}
                            onMouseEnter={(e) => handleImageHoverStart(image.id, e)}
                            onMouseLeave={handleImageHoverEnd}
                            className={`group relative ${image.status === 'pending' ? 'cursor-wait' : 'cursor-pointer'}`}
                          >
                            <div className={`relative w-full aspect-square rounded-lg overflow-visible bg-gray-50 border transition-all duration-200 ${
                              image.status === 'pending' ? 'border-blue-300 animate-pulse' :
                              image.status === 'failed' ? 'border-red-300' :
                              'border-gray-200 group-hover:border-blue-300 group-hover:shadow-md'
                            }`}>
                            {/* Pending 状态 - 显示加载动画 */}
                            {image.status === 'pending' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                                <div className="text-center">
                                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-2" />
                                  <p className="text-xs text-blue-600 font-medium">生成中...</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Failed 状态 - 显示错误图标 */}
                            {image.status === 'failed' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                                <div className="text-center px-2">
                                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                  <p className="text-xs text-red-600 font-medium">生成失败</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Completed 状态或默认 - 显示图片 */}
                            {image.imageUrl && image.status !== 'pending' && image.status !== 'failed' && (
                              <>
                            <Image
                              src={image.imageUrl}
                              alt={image.prompt}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center rounded-lg">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Sparkles className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            </div>
                            
                            {/* 时间悬浮显示在图片底部 */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 rounded-b-lg">
                              <p className="text-[9px] text-white/90 text-center font-medium">
                                {formatDateTime(image.timestamp)}
                              </p>
                            </div>
                              </>
                            )}
                            
                            {/* 状态徽章 - 显示在右上角 */}
                            {image.status && (
                              <div className="absolute top-1 right-1 z-10">
                                {image.status === 'pending' && (
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                                  </div>
                                )}
                                {image.status === 'completed' && (
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                  </div>
                                )}
                                {image.status === 'failed' && (
                                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <XCircle className="h-3.5 w-3.5 text-white" />
                                  </div>
                                )}
                              </div>
                            )}
                            
                          </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* 加载更多指示器 */}
                      {isLoadingMore && (
                        <div className="flex justify-center py-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      
                      {/* 没有更多数据提示 */}
                      {!hasMoreHistory && history.length > 0 && (
                        <div className="text-center py-2">
                          <p className="text-xs text-gray-400">没有更多记录了</p>
                        </div>
                      )}

                      {/* 交叉观察哨兵 */}
                      <div ref={sentinelRef} style={{ height: 1 }} />
                    </div>
                    
                    {history.length === 0 && !isLoadingHistory && (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <History className="h-6 w-6 text-gray-300" />
                          </div>
                          <p className="text-gray-500 text-xs leading-relaxed">
                            暂无记录
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* 登录对话框 */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* 提示词悬浮提示 - Fixed定位，显示在图片左侧，点击空白处关闭 */}
      {showPromptTooltip && tooltipPosition && (
        <>
          {/* 透明背景遮罩 - 点击关闭 */}
          <div 
            className="fixed inset-0 z-[9998]"
            onClick={closePromptTooltip}
          />
          
          {/* 提示词框 */}
          <div 
            className="fixed z-[9999] animate-in fade-in slide-in-from-right-2 duration-300"
            style={{ 
              top: `${tooltipPosition.top}px`, 
              right: `${tooltipPosition.right}px` 
            }}
          >
            <div className="bg-gray-900/97 backdrop-blur-lg rounded-2xl shadow-2xl p-5 border border-gray-600 w-[420px]">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-600">
                <p className="text-gray-300 text-xs font-semibold uppercase tracking-wide">Prompt Details</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const promptText = history.find(img => img.id === showPromptTooltip)?.prompt || '';
                      navigator.clipboard.writeText(promptText);
                      showToast('Prompt copied to clipboard!', 'success');
                    }}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={closePromptTooltip}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="text-white text-sm leading-relaxed break-words max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 pr-2 select-text">
                {history.find(img => img.id === showPromptTooltip)?.prompt}
              </div>
              {/* 右侧箭头指示器 */}
              <div className="absolute left-full top-6 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-gray-900/97"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}