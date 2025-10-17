'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Settings, Palette, Heart, Download, User, Mail, Lock, Camera, Save, X, Eye, EyeOff, ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut, Star, Edit3, Plus, Trash2, ImageIcon, FileEdit, Upload } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UnifiedColoringDetail from '@/components/UnifiedColoringDetail';
import Toast from '@/components/Toast';
import { API_ENDPOINTS } from '@/lib/apiConfig';

// 生成默认头像URL（基于用户邮箱或名称）
const generateDefaultAvatar = (email: string, name?: string) => {
  // 使用UI Avatars服务生成漂亮的字母头像
  const displayName = name || email.split('@')[0];
  // 使用邮箱的首字母，背景色使用橙黄色系，只显示首字母
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f59e0b&color=fff&size=200&bold=true&length=1`;
};

// API 请求工具函数
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  
  console.log('🔐 fetchWithAuth 调用:', {
    url,
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'null',
    method: options.method || 'GET'
  });

  if (!token) {
    console.error('❌ 未找到 token，请先登录');
    alert('未找到登录信息，请先登录');
    window.location.href = '/';
    throw new Error('未找到 token');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  console.log('📤 发送请求:', { url, headers: { ...headers, Authorization: headers.Authorization?.substring(0, 30) + '...' } });

  const response = await fetch(url, {
    ...options,
    headers
  });

  console.log('📥 响应状态:', response.status, response.statusText);

  if (response.status === 401) {
    console.error('❌ Token 已失效 (401)');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    alert('登录已过期，请重新登录');
    window.location.href = '/';
    throw new Error('Token 已失效，请重新登录');
  }

  if (response.status === 500) {
    console.error('❌ 服务器错误 (500)');
    const errorText = await response.text();
    console.error('错误详情:', errorText);
  }

  return response;
};

// 头像裁剪对话框组件
const AvatarCropDialog = ({ isOpen, imageUrl, onClose, onSave, onReupload }: {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  onReupload?: (newImageUrl: string) => void;
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // 图片加载完成后初始化
  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setImageLoaded(true);
      // 重置位置和缩放
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  };

  // 处理鼠标按下开始拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  // 处理鼠标移动拖拽
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // 限制拖拽范围
    const maxX = 150;
    const maxY = 150;
    
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    });
  }, [isDragging, dragStart]);

  // 处理鼠标抬起结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 处理缩放
  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.1));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.1));
  };

  // 重置位置和缩放
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // 重新上传图片
  const handleReupload = () => {
    fileInputRef.current?.click();
  };

  // 处理重新选择文件
  const handleReuploadFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        showToast('请选择图片文件！', 'warning');
        return;
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        showToast('图片文件大小不能超过5MB！', 'warning');
        return;
      }

      // 创建FileReader来读取文件
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // 更新图片URL，重置状态
          setImageLoaded(false);
          setPosition({ x: 0, y: 0 });
          setScale(1);
          // 通过父组件回调更新图片
          if (onReupload) {
            onReupload(result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 裁剪图片 - 直接截取裁剪框内的像素内容
  const handleCrop = () => {
    if (!imageRef.current || !canvasRef.current || !imageLoaded || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const img = imageRef.current;
    const cropSize = 200; // 最终输出尺寸
    
    // 获取容器尺寸
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // 创建临时canvas来模拟当前的显示效果
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = containerWidth;
    tempCanvas.height = containerHeight;

    // 图片的CSS样式是: width: auto, height: auto
    // 这意味着图片按原始像素尺寸显示，然后通过transform缩放和移动
    
    // 获取图片的实际显示尺寸（在应用transform之前）
    // 由于设置了 maxWidth: none, maxHeight: none, width: auto, height: auto
    // 图片会按照其自然尺寸显示，但受容器限制
    let displayWidth = img.naturalWidth;
    let displayHeight = img.naturalHeight;
    
    // 如果图片太大，需要缩小以适应容器（模拟浏览器的默认行为）
    const maxWidth = containerWidth * 3; // 给一些余量
    const maxHeight = containerHeight * 3;
    
    if (displayWidth > maxWidth || displayHeight > maxHeight) {
      const scaleToFit = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
      displayWidth *= scaleToFit;
      displayHeight *= scaleToFit;
    }

    // 图片中心点（应用用户的拖拽偏移）
    const imgCenterX = containerWidth / 2 + position.x;
    const imgCenterY = containerHeight / 2 + position.y;

    // 在临时canvas上绘制变换后的图片
    tempCtx.save();
    tempCtx.translate(imgCenterX, imgCenterY);
    tempCtx.scale(scale, scale);
    tempCtx.drawImage(
      img,
      -displayWidth / 2,
      -displayHeight / 2,
      displayWidth,
      displayHeight
    );
    tempCtx.restore();

    // 裁剪区域参数（固定在容器中心的200x200圆形）
    const cropRadius = 100;
    const cropCenterX = containerWidth / 2;
    const cropCenterY = containerHeight / 2;
    const cropLeft = cropCenterX - cropRadius;
    const cropTop = cropCenterY - cropRadius;
    const cropDiameter = cropRadius * 2;

    // 从临时canvas中获取裁剪区域的像素数据
    const imageData = tempCtx.getImageData(cropLeft, cropTop, cropDiameter, cropDiameter);

    // 设置最终输出canvas
    canvas.width = cropSize;
    canvas.height = cropSize;
    ctx.clearRect(0, 0, cropSize, cropSize);

    // 创建圆形裁剪
    ctx.save();
    ctx.beginPath();
    ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // 创建临时canvas来放置裁剪的像素数据
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;
    
    cropCanvas.width = cropDiameter;
    cropCanvas.height = cropDiameter;
    cropCtx.putImageData(imageData, 0, 0);
    
    // 将裁剪区域绘制到最终canvas，并缩放到目标尺寸
    ctx.drawImage(cropCanvas, 0, 0, cropDiameter, cropDiameter, 0, 0, cropSize, cropSize);
    
    ctx.restore();

    // 获取裁剪结果
    const croppedDataUrl = canvas.toDataURL('image/png');
    onSave(croppedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        {/* 对话框头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Crop Avatar</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 裁剪区域 */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div 
              ref={containerRef}
              className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden cursor-move border-2 border-gray-300 mx-auto"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* 原始图片 */}
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop preview"
                className="absolute select-none pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                  transformOrigin: 'center',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  width: 'auto',
                  height: 'auto'
                }}
                draggable={false}
                onLoad={handleImageLoad}
              />
              
              {/* 圆形裁剪框覆盖层 */}
              <div className="absolute inset-0 pointer-events-none">
                {/* 圆形透明区域和遮罩 */}
                <div 
                  className="absolute border-4 border-white border-dashed rounded-full"
                  style={{
                    width: '200px',
                    height: '200px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
                  }}
                ></div>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Scale:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600 w-12">{scale.toFixed(1)}x</span>
              </div>
              
              <button
                onClick={handleZoomIn}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleReset}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={handleReupload}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                title="Upload New Image"
              >
                <Camera className="h-4 w-4" />
                New Image
              </button>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to use:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Drag the image to reposition it</li>
            <li>• Use the scale slider or zoom buttons to resize</li>
            <li>• The dashed circle shows the crop area</li>
            <li>• Click &quot;New Image&quot; to upload a different photo</li>
            <li>• Click &quot;Apply Crop&quot; to save your changes</li>
          </ul>
        </div>

        {/* 对话框按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            disabled={!imageLoaded}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            Apply Crop
          </button>
        </div>

        {/* 隐藏的canvas用于裁剪 */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* 隐藏的文件输入用于重新上传 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleReuploadFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

// 分页组件
const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {/* 页码按钮 */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

// 密码修改对话框组件
const PasswordChangeDialog = ({ isOpen, onClose, onSave, showToast }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSave = () => {
    if (!currentPassword || !newPassword) {
      showToast('请填写完整的密码信息', 'warning');
      return;
    }
    
    // 密码复杂性验证
    if (newPassword.length < 8) {
      showToast('新密码长度至少8位', 'warning');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      showToast('新密码必须包含大写字母、小写字母、数字和特殊字符', 'warning');
      return;
    }
    
    onSave(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    onClose();
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity z-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 w-full max-w-md p-6">
          {/* 对话框头部 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 密码输入表单 */}
          <div className="space-y-4">
            {/* 当前密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 新密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="8+ chars: A-Z, a-z, 0-9, !@#$..."
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            </div>
          </div>

          {/* 对话框按钮 */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('account-settings');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [creationsCurrentPage, setCreationsCurrentPage] = useState(1);
  const [favoritesCurrentPage, setFavoritesCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // 详情Dialog状态
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string>('');
  
  // My Creations Tab 状态
  const [creationsTab, setCreationsTab] = useState<'images' | 'coloring-pages'>('images');
  
  // 涂色卡片状态
  const [userColoringPages, setUserColoringPages] = useState<any[]>([]);
  const [coloringPagesLoading, setColoringPagesLoading] = useState(false);
  const [coloringPagesPagination, setColoringPagesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [showColoringPageDialog, setShowColoringPageDialog] = useState(false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false); // 只读模式标志
  const [editingColoringPage, setEditingColoringPage] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPageId, setDeletingPageId] = useState<number | null>(null);
  const [coloringPageFormData, setColoringPageFormData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnailUrl: '',
    previewUrl: '',
    originalFileUrl: '',
    difficulty: 'easy',
    ageRange: '3-5',
    theme: '',
    style: '',
    size: 'A4',
    seoTitle: '',
    seoDescription: '',
    aiPrompt: ''
  });

  // 元数据状态
  const [metadata, setMetadata] = useState<{
    difficulty: any[];
    size: any[];
    style: any[];
    theme: any[];
  }>({
    difficulty: [],
    size: [],
    style: [],
    theme: []
  });
  
  // Toast状态管理
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  // 显示Toast的函数
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ show: true, message, type });
  };

  // 关闭Toast的函数
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };
  
  // 文件上传相关的ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userInfo, setUserInfo] = useState({
    id: 0,
    nickname: '',
    email: '',
    avatar: '',
    provider: '',
    totalCreations: 0,
    totalFavorites: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      console.log('👤 开始获取用户信息...');
      setLoading(true);
      
      // 检查localStorage中的token
      const authToken = localStorage.getItem('authToken');
      const token = localStorage.getItem('token');
      console.log('🔍 localStorage 检查:', {
        hasAuthToken: !!authToken,
        hasToken: !!token,
        authTokenPrefix: authToken?.substring(0, 20),
        tokenPrefix: token?.substring(0, 20)
      });
      
      // 同步token：如果只有token没有authToken，或者只有authToken没有token，则同步
      if (token && !authToken) {
        localStorage.setItem('authToken', token);
        console.log('🔄 已同步 authToken');
      } else if (authToken && !token) {
        localStorage.setItem('token', authToken);
        console.log('🔄 已同步 token');
      }
      
      const response = await fetchWithAuth(API_ENDPOINTS.PUBLIC.USER.ME);
      const result = await response.json();
      
      console.log('📦 用户信息响应:', result);
      
      if (result.success && result.data) {
        console.log('✅ 获取用户信息成功:', {
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          hasAvatar: !!result.data.avatar
        });
        
        // 如果没有头像，生成默认头像
        const avatarUrl = result.data.avatar && result.data.avatar.trim() !== ''
          ? result.data.avatar
          : generateDefaultAvatar(result.data.email, result.data.name);
        
        console.log('🖼️ 头像URL:', { original: result.data.avatar, final: avatarUrl });
        
        // 更新React状态
        setUserInfo({
          id: result.data.id,
          nickname: result.data.name || '',
          email: result.data.email || '',
          avatar: avatarUrl,
          provider: result.data.provider || '',
          totalCreations: result.data.totalCreations || 0,
          totalFavorites: result.data.totalFavorites || 0,
          totalLikes: result.data.totalLikes || 0
        });
        
        // ⭐ 关键：保存到localStorage，供Header使用
        const userInfoForStorage = {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
          avatar: avatarUrl,  // 使用生成的头像URL
          provider: result.data.provider
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfoForStorage));
        console.log('💾 用户信息已保存到localStorage:', userInfoForStorage);
        
        // ⭐ 立即触发事件通知Header（不依赖React状态更新）
        if (userInfoForStorage.avatar) {
    const loginEvent = new CustomEvent('userLogin', {
      detail: {
        isLoggedIn: true,
              userAvatar: userInfoForStorage.avatar
      }
    });
    window.dispatchEvent(loginEvent);
          console.log('📢 已触发userLogin事件');
        }
        
        setError('');
      } else {
        console.error('❌ 获取用户信息失败:', result.error);
        setError(result.error || '获取用户信息失败');
      }
    } catch (err) {
      console.error('❌ 获取用户信息异常:', err);
      setError('获取用户信息失败，请重新登录');
    } finally {
      setLoading(false);
    }
  };

  // 获取元数据
  const fetchMetadata = async () => {
    try {
      console.log('🔄 开始获取元数据...');
      const response = await fetch('http://localhost:3001/api/metadata');
      const result = await response.json();
      
      console.log('📊 元数据API响应:', result);
      
      if (result.success && result.data) {
        const metadataMap: any = {
          difficulty: [],
          size: [],
          style: [],
          theme: []
        };
        
        result.data.forEach((group: any) => {
          if (group.type && group.items) {
            metadataMap[group.type] = group.items;
          }
        });
        
        console.log('✅ 元数据已设置:', metadataMap);
        setMetadata(metadataMap);
      }
    } catch (error) {
      console.error('❌ 获取元数据失败:', error);
    }
  };

  // 组件加载时获取用户信息和元数据
  useEffect(() => {
    fetchUserInfo();
    fetchMetadata();
  }, []);

  // 更新个人资料
  const updateProfile = async (name?: string, avatar?: string) => {
    try {
      console.log('📝 ===== 调用用户资料更新接口 =====');
      console.log('📝 接口:', API_ENDPOINTS.PUBLIC.USER.PROFILE);
      console.log('📝 方法: PUT');
      console.log('📝 参数:', { 
        name: name || '(未修改)', 
        avatar: avatar ? avatar : '(未修改)'
      });
      
      const body: any = {};
      if (name) body.name = name;
      if (avatar) body.avatar = avatar;

      console.log('📤 发送请求体:', JSON.stringify(body, null, 2));

      const response = await fetchWithAuth(API_ENDPOINTS.PUBLIC.USER.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      const result = await response.json();
      console.log('📥 更新接口响应:', result);
      
      if (result.success && result.data) {
        console.log('✅ 用户资料更新成功！');
        
        // 更新本地状态
        setUserInfo(prev => ({
          ...prev,
          nickname: result.data.name || prev.nickname,
          avatar: result.data.avatar || prev.avatar
        }));
        console.log('   → React状态已更新');
        
        // 更新 localStorage
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          const userInfoObj = JSON.parse(storedUserInfo);
          userInfoObj.name = result.data.name || userInfoObj.name;
          userInfoObj.avatar = result.data.avatar || userInfoObj.avatar;
          localStorage.setItem('userInfo', JSON.stringify(userInfoObj));
          console.log('   → localStorage已更新');
        }
        
        // 通知 Header 更新（这会触发Header的checkLoginStatus）
        const avatarUpdateEvent = new CustomEvent('userAvatarUpdate', {
          detail: { 
            avatar: result.data.avatar,
            userAvatar: result.data.avatar
          }
        });
        window.dispatchEvent(avatarUpdateEvent);
        console.log('   → Header组件已通知');
        console.log('📝 ===== 用户资料更新完成 =====\n');
        
        showToast('个人资料更新成功', 'success');
        return true;
      } else {
        console.error('❌ 用户资料更新失败:', result.error);
        showToast(result.error || '更新失败', 'error');
        return false;
      }
    } catch (error) {
      console.error('❌ 更新个人资料异常:', error);
      showToast('更新失败，请重试', 'error');
      return false;
    }
  };

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      console.log('🔒 开始修改密码...');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        showToast('未找到登录信息，请先登录', 'error');
        return false;
      }

      // 直接使用fetch，不使用fetchWithAuth，避免401时自动清除登录信息
      const response = await fetch(API_ENDPOINTS.PUBLIC.USER.CHANGE_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      console.log('📥 密码修改响应状态:', response.status);

      const result = await response.json();
      console.log('📦 密码修改响应:', result);
      
      if (response.status === 401) {
        // 当前密码错误，不清除登录信息
        showToast('当前密码错误，请检查后重试', 'error');
        return false;
      }
      
      if (result.success) {
        showToast('密码修改成功！', 'success');
        return true;
      } else {
        showToast(result.error || '密码修改失败', 'error');
        return false;
      }
    } catch (error) {
      console.error('❌ 修改密码异常:', error);
      showToast('修改失败，请重试', 'error');
      return false;
    }
  };

  // 获取列表数据（创作/收藏/点赞）
  const [creations, setCreations] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [creationsPagination, setCreationsPagination] = useState({ currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [favoritesPagination, setFavoritesPagination] = useState({ currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [likesPagination, setLikesPagination] = useState({ currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [listLoading, setListLoading] = useState(false);

  // 获取创作列表
  const fetchCreations = async (page: number = 1) => {
    try {
      setListLoading(true);
      const response = await fetchWithAuth(`${API_ENDPOINTS.PUBLIC.USER.CREATIONS}?page=${page}&limit=${itemsPerPage}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setCreations(result.data.pages || []);
        setCreationsPagination(result.data.pagination || { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      }
    } catch (error) {
      console.error('获取创作列表失败:', error);
    } finally {
      setListLoading(false);
    }
  };

  // 获取收藏列表
  const fetchFavorites = async (page: number = 1) => {
    try {
      setListLoading(true);
      const response = await fetchWithAuth(`${API_ENDPOINTS.PUBLIC.USER.FAVORITES}?page=${page}&limit=${itemsPerPage}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFavorites(result.data.pages || []);
        setFavoritesPagination(result.data.pagination || { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      }
    } catch (error) {
      console.error('获取收藏列表失败:', error);
    } finally {
      setListLoading(false);
    }
  };

  // 获取点赞列表
  const fetchLikes = async (page: number = 1) => {
    try {
      setListLoading(true);
      const response = await fetchWithAuth(`${API_ENDPOINTS.PUBLIC.USER.LIKES}?page=${page}&limit=${itemsPerPage}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setLikes(result.data.pages || []);
        setLikesPagination(result.data.pagination || { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      }
    } catch (error) {
      console.error('获取点赞列表失败:', error);
    } finally {
      setListLoading(false);
    }
  };

  // Tab 切换时加载数据
  useEffect(() => {
    if (activeTab === 'my-creations') {
      fetchCreations(creationsCurrentPage);
    } else if (activeTab === 'my-favorites') {
      fetchFavorites(favoritesCurrentPage);
    } else if (activeTab === 'my-likes') {
      fetchLikes(1); // 我的点赞暂时使用第一页
    }
  }, [activeTab, creationsCurrentPage, favoritesCurrentPage]);



  const handleSave = async () => {
    try {
      console.log('💾 开始保存用户信息...');
      setIsEditing(false);
      
      // 如果昵称有变化，调用API更新
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const originalInfo = JSON.parse(storedUserInfo);
        if (userInfo.nickname !== originalInfo.name) {
          console.log('📝 昵称已更改，调用API更新');
          const success = await updateProfile(userInfo.nickname);
          if (!success) {
            showToast('昵称更新失败，请重试', 'error');
            return;
          }
          showToast('昵称更新成功！', 'success');
        } else {
          showToast('没有需要保存的更改', 'info');
        }
      }
    } catch (error) {
      console.error('❌ 保存失败:', error);
      showToast('保存失败，请重试', 'error');
    }
  };

  // 处理头像上传
  const handleAvatarUpload = () => {
    // 触发文件选择对话框
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        showToast('请选择图片文件！', 'warning');
        return;
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        showToast('图片文件大小不能超过5MB！', 'warning');
        return;
      }

      // 创建FileReader来读取文件
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // 设置临时图片URL并打开裁剪对话框
          setTempImageUrl(result);
          setIsCropDialogOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 将base64转换为File对象
  const base64ToFile = (base64String: string, fileName: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  // 上传图片到服务器
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('📤 ===== 开始上传图片到服务器 =====');
      console.log('📤 上传接口:', API_ENDPOINTS.PUBLIC.UPLOAD.IMAGE);
      console.log('📤 文件信息:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        fileType: file.type
      });
      console.log('📤 Token:', token ? token.substring(0, 20) + '...' : 'null');

      if (!token) {
        console.error('❌ 没有找到 token，无法上传图片');
        showToast('请先登录后再上传图片', 'warning');
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 发送 POST 请求到:', API_ENDPOINTS.PUBLIC.UPLOAD.IMAGE);
      console.log('📤 请求头:', { Authorization: `Bearer ${token.substring(0, 20)}...` });
      console.log('📤 请求体: FormData { file: 图像二进制流 }');
      
      const response = await fetch(API_ENDPOINTS.PUBLIC.UPLOAD.IMAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📥 上传接口响应状态:', response.status, response.statusText);

      const result = await response.json();
      console.log('📥 上传接口完整响应:', JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        // 上传接口返回多个URL：previewUrl, thumbnailUrl, originalUrl
        const imageUrl = result.data.previewUrl || result.data.originalUrl || result.data.url;
        
        if (!imageUrl) {
          console.error('❌ 响应中未找到图片URL');
          console.error('响应数据:', result.data);
          showToast('图片上传失败：未获取到图片URL', 'error');
          return null;
        }
        
        console.log('✅ 图片上传成功！');
        console.log('📦 返回的URL地址:');
        console.log('   - previewUrl:', result.data.previewUrl || '(无)');
        console.log('   - thumbnailUrl:', result.data.thumbnailUrl || '(无)');
        console.log('   - originalUrl:', result.data.originalUrl || '(无)');
        console.log('✅ 使用URL:', imageUrl);
        console.log('📤 ===== 图片上传完成 =====\n');
        return imageUrl;
      } else {
        console.error('❌ 图片上传失败:', result.error || '未知错误');
        showToast(result.error || '图片上传失败', 'error');
        return null;
      }
    } catch (error) {
      console.error('❌ 图片上传异常:', error);
      showToast('图片上传失败，请重试', 'error');
      return null;
    }
  };

  // 处理裁剪完成
  const handleCropSave = async (croppedImage: string) => {
    try {
      console.log('\n🖼️ ========== 开始头像更新流程 ==========');
      console.log('步骤1: 立即更新本地UI（用户即时看到效果）');
      
      // 第1步：立即更新本地状态（给用户即时反馈）
    setUserInfo(prev => ({
      ...prev,
      avatar: croppedImage
    }));
      console.log('✅ 步骤1完成：本地UI已更新\n');
      
      // 第2步：将base64转换为File对象
      console.log('步骤2: 将base64转换为File对象');
      const fileName = `avatar-${Date.now()}.png`;
      const file = base64ToFile(croppedImage, fileName);
      console.log('✅ 步骤2完成：File对象已创建', {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type
      });
      console.log('\n');
      
      // 第3步：调用上传接口，获取图片URL
      console.log('步骤3: 调用图片上传接口 POST /api/upload/image');
      const imageUrl = await uploadImage(file);
      
      if (!imageUrl) {
        console.error('❌ 步骤3失败：未获取到图片URL');
        showToast('头像上传失败，请重试', 'error');
        // 恢复原头像
        fetchUserInfo();
        return;
      }
      
      console.log('✅ 步骤3完成：获取到图片URL');
      console.log('   图片URL:', imageUrl);
      console.log('\n');
      
      // 第4步：调用API更新用户资料
      console.log('步骤4: 调用用户资料更新接口 PUT /api/user/profile');
      console.log('   参数: { avatar:', imageUrl, '}');
      const success = await updateProfile(undefined, imageUrl);
      
      if (success) {
        console.log('✅ 步骤4完成：用户资料更新成功');
        console.log('✅ ========== 头像更新流程完成 ==========\n');
        setIsCropDialogOpen(false);
        setTempImageUrl('');
      } else {
        console.error('❌ 步骤4失败：用户资料更新失败');
        console.log('❌ ========== 头像更新流程失败 ==========\n');
        // 失败时恢复原头像
        fetchUserInfo();
      }
    } catch (error) {
      console.error('❌ 头像更新流程异常:', error);
      console.log('❌ ========== 头像更新流程异常终止 ==========\n');
      showToast('头像更新失败，请重试', 'error');
      fetchUserInfo();
    }
  };

  // 处理重新上传（从裁剪对话框中）
  const handleReuploadFromCrop = (newImageUrl: string) => {
    setTempImageUrl(newImageUrl);
    setIsCropDialogOpen(true);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    // 立即调用密码修改API
    console.log('🔒 开始修改密码...');
    const success = await changePassword(currentPassword, newPassword);
    
    if (success) {
      // 密码修改成功后会自动跳转到首页重新登录
      setIsPasswordDialogOpen(false);
      setPasswordChanged(false);
    }
    // 失败的情况已经在changePassword中显示了Toast
  };

  const menuItems = [
    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: Settings,
      isActive: activeTab === 'account-settings'
    },
    {
      id: 'my-creations',
      label: 'My Creations',
      icon: Palette,
      isActive: activeTab === 'my-creations'
    },
    {
      id: 'my-favorites',
      label: 'My Favorites',
      icon: Heart,
      isActive: activeTab === 'my-favorites'
    }
  ];

  const renderAccountSettings = () => (
    <div className="bg-white rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>

      {/* 隐藏的文件输入元素 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 表单区域 */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
          <input
            type="text"
            value={userInfo.nickname}
            onChange={(e) => setUserInfo(prev => ({ ...prev, nickname: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your nickname"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userInfo.email}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="flex gap-3">
            <input
              type="password"
              value={userInfo.password}
              disabled
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <button 
              onClick={() => setIsPasswordDialogOpen(true)}
              className="px-4 py-3 text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 rounded-lg transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* 头像裁剪对话框 */}
      <AvatarCropDialog
        isOpen={isCropDialogOpen}
        imageUrl={tempImageUrl}
        onClose={() => setIsCropDialogOpen(false)}
        onSave={handleCropSave}
        onReupload={handleReuploadFromCrop}
      />

      {/* 密码修改对话框 */}
      <PasswordChangeDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onSave={handlePasswordChange}
        showToast={showToast}
      />
    </div>
  );

  // 获取用户涂色卡列表
  const fetchUserColoringPages = async (page = 1) => {
    try {
      setColoringPagesLoading(true);
      const response = await fetchWithAuth(
        `http://localhost:3001/api/coloring-pages/user/my-pages?page=${page}&limit=10&sort=newest`
      );
      const result = await response.json();
      
      console.log('📊 用户涂色卡API响应:', result);
      
      if (result.success && result.data) {
        // API返回的是 coloringPages 字段
        const pages = Array.isArray(result.data.coloringPages) ? result.data.coloringPages : [];
        setUserColoringPages(pages);
        
        // 确保pagination字段存在
        if (result.data.pagination) {
          setColoringPagesPagination({
            currentPage: result.data.pagination.currentPage || 1,
            totalPages: result.data.pagination.totalPages || 1,
            totalCount: result.data.pagination.totalCount || 0
          });
        }
      } else {
        // 如果API返回不成功，设置为空数组
        setUserColoringPages([]);
      }
    } catch (error) {
      console.error('Failed to fetch user coloring pages:', error);
      showToast('Failed to load coloring pages', 'error');
      // 确保出错时也设置为空数组
      setUserColoringPages([]);
    } finally {
      setColoringPagesLoading(false);
    }
  };

  // 创建/更新涂色卡片
  const saveColoringPage = async () => {
    try {
      const url = editingColoringPage
        ? `http://localhost:3001/api/coloring-pages/user/${editingColoringPage.id}`
        : 'http://localhost:3001/api/coloring-pages/user/create';
      
      // 转换camelCase为snake_case格式
      const requestData = {
        title: coloringPageFormData.title,
        slug: coloringPageFormData.slug,
        description: coloringPageFormData.description,
        thumbnail_url: coloringPageFormData.thumbnailUrl,
        preview_url: coloringPageFormData.previewUrl,
        original_file_url: coloringPageFormData.originalFileUrl,
        difficulty: coloringPageFormData.difficulty,
        age_range: coloringPageFormData.ageRange,
        theme: coloringPageFormData.theme,
        style: coloringPageFormData.style,
        size: coloringPageFormData.size,
        ai_prompt: coloringPageFormData.aiPrompt,
        seo_title: coloringPageFormData.seoTitle,
        seo_description: coloringPageFormData.seoDescription
      };
      
      console.log('💾 保存数据:', requestData);
      
      const response = await fetchWithAuth(url, {
        method: editingColoringPage ? 'PUT' : 'POST',
        body: JSON.stringify(requestData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast(editingColoringPage ? 'Coloring page updated!' : 'Coloring page created!', 'success');
        setShowColoringPageDialog(false);
        fetchUserColoringPages(coloringPagesPagination.currentPage);
      } else {
        showToast(result.message || 'Failed to save', 'error');
      }
    } catch (error) {
      console.error('Failed to save coloring page:', error);
      showToast('Failed to save', 'error');
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (id: number) => {
    setDeletingPageId(id);
    setShowDeleteConfirm(true);
  };

  // 确认删除涂色卡片
  const confirmDeleteColoringPage = async () => {
    if (!deletingPageId) return;
    
    try {
      const response = await fetchWithAuth(
        `http://localhost:3001/api/coloring-pages/user/${deletingPageId}`,
        { method: 'DELETE' }
      );
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Coloring page deleted', 'success');
        fetchUserColoringPages(coloringPagesPagination.currentPage);
      } else {
        showToast(result.message || 'Failed to delete', 'error');
      }
    } catch (error) {
      console.error('Failed to delete coloring page:', error);
      showToast('Failed to delete', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setDeletingPageId(null);
    }
  };

  // 打开新建涂色卡片对话框（从AI生成的图片）
  const openCreateColoringPageDialog = (aiImage: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingColoringPage(null);
    setColoringPageFormData({
      title: aiImage.prompt || '',
      slug: `coloring-page-${Date.now()}`,
      description: '',
      thumbnailUrl: aiImage.imageUrl,
      previewUrl: aiImage.imageUrl,
      originalFileUrl: aiImage.imageUrl,
      difficulty: 'easy',
      ageRange: '3-5岁',
      theme: '动物',
      style: 'Line Art',
      size: 'A4',
      seoTitle: aiImage.prompt || '',
      seoDescription: '',
      aiPrompt: aiImage.prompt || ''
    });
    setShowColoringPageDialog(true);
  };

  // 打开查看涂色卡片对话框（只读模式）
  const openViewColoringPageDialog = (page: any) => {
    console.log('👁️ 查看涂色卡片 - 原始数据:', page);
    
    const formData = {
      title: page.title || '',
      slug: page.slug || '',
      description: page.description || '',
      thumbnailUrl: page.thumbnail_url || page.thumbnailUrl || '',
      previewUrl: page.preview_url || page.previewUrl || '',
      originalFileUrl: page.original_file_url || page.originalFileUrl || page.imageUrl || '',
      difficulty: page.difficulty || 'easy',
      ageRange: page.age_range || page.ageRange || '3-5',
      theme: page.theme || '',
      style: page.style || '',
      size: page.size || 'A4',
      seoTitle: page.seo_title || page.seoTitle || '',
      seoDescription: page.seo_description || page.seoDescription || '',
      aiPrompt: page.ai_prompt || page.aiPrompt || ''
    };
    
    setEditingColoringPage(page);
    setColoringPageFormData(formData);
    setIsReadOnlyMode(true); // 设置为只读模式
    setShowColoringPageDialog(true);
  };

  // 打开编辑涂色卡片对话框
  const openEditColoringPageDialog = (page: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('📝 编辑涂色卡片 - 原始数据:', page);
    
    const formData = {
      title: page.title || '',
      slug: page.slug || '',
      description: page.description || '',
      thumbnailUrl: page.thumbnail_url || page.thumbnailUrl || '',
      previewUrl: page.preview_url || page.previewUrl || '',
      originalFileUrl: page.original_file_url || page.originalFileUrl || page.imageUrl || '',
      difficulty: page.difficulty || 'easy',
      ageRange: page.age_range || page.ageRange || '3-5',
      theme: page.theme || '',
      style: page.style || '',
      size: page.size || 'A4',
      seoTitle: page.seo_title || page.seoTitle || '',
      seoDescription: page.seo_description || page.seoDescription || '',
      aiPrompt: page.ai_prompt || page.aiPrompt || ''
    };
    
    console.log('📋 映射后的表单数据:', formData);
    
    setEditingColoringPage(page);
    setColoringPageFormData(formData);
    setIsReadOnlyMode(false); // 设置为编辑模式
    setShowColoringPageDialog(true);
  };

  // 编辑AI生成的图片（跳转到AI Generator）
  const editAIImage = (image: any, e: React.MouseEvent) => {
    e.stopPropagation();
    // 保存到 localStorage
    localStorage.setItem('editingAIImage', JSON.stringify({
      imageUrl: image.imageUrl,
      prompt: image.prompt
    }));
    // 跳转到 AI Generator
    window.location.href = '/ai-generator';
  };

  const renderMyCreations = () => {
    return (
      <div className="bg-white rounded-lg p-8">
        {/* Tab 切换 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setCreationsTab('images')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  creationsTab === 'images'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>AI Generated Images</span>
                  {creations.length > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {creationsPagination.totalCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => {
                  setCreationsTab('coloring-pages');
                  if (!userColoringPages || userColoringPages.length === 0) {
                    fetchUserColoringPages(1);
                  }
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  creationsTab === 'coloring-pages'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <span>My Coloring Pages</span>
                  {userColoringPages && userColoringPages.length > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {coloringPagesPagination.totalCount}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {creationsTab === 'images' ? 'AI Generated Images' : 'My Coloring Pages'}
        </h2>
        
        {/* AI Generated Images Tab */}
        {creationsTab === 'images' && (
          <>
            {listLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : creations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creations.map((creation) => (
                    <div key={creation.id} className="group cursor-pointer relative" onClick={() => handleViewDetail(creation.id)}>
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                        <Image
                          src={creation.thumbnailUrl || creation.imageUrl}
                          alt={creation.title}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          unoptimized
                        />
                        
                        {/* 悬停操作按钮 */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                          <button
                            onClick={(e) => editAIImage(creation, e)}
                            className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                            title="Edit in AI Generator"
                          >
                            <FileEdit className="h-4 w-4" />
                            <span className="text-sm font-medium">Edit Image</span>
                          </button>
                          <button
                            onClick={(e) => openCreateColoringPageDialog(creation, e)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                            title="Create Coloring Page"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">Create Page</span>
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900">{creation.title}</h3>
                      <p className="text-sm text-gray-500">Created on {new Date(creation.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>

                {/* 分页组件 */}
                {creationsPagination.totalPages > 1 && (
                  <Pagination
                    currentPage={creationsPagination.currentPage}
                    totalPages={creationsPagination.totalPages}
                    onPageChange={setCreationsCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't created any AI images yet.</p>
                <a href="/ai-generator" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
                  Go to AI Generator →
                </a>
              </div>
            )}
          </>
        )}

        {/* My Coloring Pages Tab */}
        {creationsTab === 'coloring-pages' && (
          <>
            {coloringPagesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : userColoringPages && userColoringPages.length > 0 ? (
              <>
                {/* Table Layout */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image & Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Range</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userColoringPages.map((page) => (
                        <tr 
                          key={page.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => openViewColoringPageDialog(page)}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">#{page.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0 relative rounded overflow-hidden">
                                <Image
                                  src={page.thumbnail_url || page.preview_url}
                                  alt={page.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{page.title}</div>
                                <div className="text-xs text-gray-500">{page.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{page.theme || '-'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{page.style || '-'}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              page.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              page.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {page.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{page.age_range}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(page.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              page.status === 'published' ? 'bg-green-100 text-green-800' :
                              page.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {page.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={(e) => openEditColoringPageDialog(page, e)}
                                className="text-orange-600 hover:text-orange-900 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteConfirm(page.id);
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页组件 */}
                {coloringPagesPagination.totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={coloringPagesPagination.currentPage}
                      totalPages={coloringPagesPagination.totalPages}
                      onPageChange={(page) => fetchUserColoringPages(page)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't created any coloring pages yet.</p>
                <p className="text-sm text-gray-400 mt-2">Create from your AI generated images!</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // 处理取消收藏（已废弃，使用handleFavorite代替）
  const handleUnfavorite = async (pageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await handleFavorite(pageId, true, e);
  };

  // 处理点赞
  const handleLike = async (pageId: number, isLiked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        showToast('请先登录', 'warning');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/coloring-pages/${pageId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // 刷新当前列表
        if (activeTab === 'my-creations') {
          fetchCreations(creationsCurrentPage);
        } else if (activeTab === 'my-favorites') {
          fetchFavorites(favoritesCurrentPage);
        }
      } else {
        showToast(result.error || '操作失败', 'error');
      }
    } catch (error) {
      console.error('❌ 点赞操作失败:', error);
      showToast('操作失败，请重试', 'error');
    }
  };

  // 处理收藏
  const handleFavorite = async (pageId: number, isFavorited: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        showToast('请先登录', 'warning');
        return;
      }

      console.log(`${isFavorited ? '💔 取消收藏' : '💛 添加收藏'}:`, pageId);

      if (isFavorited) {
        // 取消收藏 - 使用新的API
        const response = await fetch(`http://localhost:3001/api/user/favorite`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pageId }),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ 取消收藏成功');
          // 刷新当前列表
          if (activeTab === 'my-creations') {
            fetchCreations(creationsCurrentPage);
          } else if (activeTab === 'my-favorites') {
            fetchFavorites(favoritesCurrentPage);
          }
        } else {
          showToast(result.error || '操作失败', 'error');
        }
      } else {
        // 添加收藏 - 使用旧的API
        const response = await fetch(`http://localhost:3001/api/coloring-pages/${pageId}/favorite`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ 添加收藏成功');
          // 刷新当前列表
          if (activeTab === 'my-creations') {
            fetchCreations(creationsCurrentPage);
          } else if (activeTab === 'my-favorites') {
            fetchFavorites(favoritesCurrentPage);
          }
        } else {
          showToast(result.error || '操作失败', 'error');
        }
      }
    } catch (error) {
      console.error('❌ 收藏操作失败:', error);
      showToast('操作失败，请重试', 'error');
    }
  };

  // 处理查看卡片详情
  const handleViewDetail = (pageId: number) => {
    console.log('👁️ 查看详情:', pageId);
    setSelectedDetailId(pageId.toString());
    setIsDetailDialogOpen(true);
  };

  const renderMyFavorites = () => {
    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Favorites</h2>
        
        {listLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : favorites.length > 0 ? (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
            <div key={favorite.id} className="group cursor-pointer" onClick={() => handleViewDetail(favorite.id)}>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                <Image
                      src={favorite.thumbnailUrl || favorite.imageUrl}
                  alt={favorite.title}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  unoptimized
                />
                {/* 点赞和收藏按钮 - 右上角 */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  {/* 点赞按钮（上方） */}
                  <button
                    onClick={(e) => handleLike(favorite.id, favorite.isLiked || false, e)}
                    className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                      favorite.isLiked
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'
                    }`}
                    title={favorite.isLiked ? '已点赞' : '点赞'}
                  >
                    <Heart className={`h-5 w-5 ${favorite.isLiked ? 'fill-current' : ''}`} />
                  </button>
                  
                  {/* 收藏按钮（下方） */}
                  <button
                    onClick={(e) => handleFavorite(favorite.id, true, e)}
                    className="p-2 rounded-full shadow-lg transition-all duration-200 bg-yellow-500 text-white"
                    title="已收藏"
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-gray-900">{favorite.title}</h3>
                  <p className="text-sm text-gray-500">Favorited on {new Date(favorite.favoritedAt || favorite.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* 分页组件 */}
            {favoritesPagination.totalPages > 1 && (
        <Pagination
                currentPage={favoritesPagination.currentPage}
                totalPages={favoritesPagination.totalPages}
          onPageChange={setFavoritesCurrentPage}
        />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't favorited any coloring pages yet.</p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account-settings':
        return renderAccountSettings();
      case 'my-creations':
        return renderMyCreations();
      case 'my-favorites':
        return renderMyFavorites();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 左侧导航 */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6">
              {/* 用户头像区域 */}
              <div className="flex justify-center mb-6 pb-6 border-b border-gray-100">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden relative">
                    <Image
                      src={userInfo.avatar}
                      alt="User Avatar"
                      width={80}
                      height={80}
                      className="object-cover"
                      unoptimized
                    />
                    {/* 悬停时显示的相机图标覆盖层 */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                         onClick={handleAvatarUpload}>
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        item.isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
      
      {/* 详情Dialog */}
      {isDetailDialogOpen && selectedDetailId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl my-8">
              {/* 关闭按钮 */}
              <button
                onClick={() => setIsDetailDialogOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="关闭"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
              
              {/* 详情内容 */}
              <div className="overflow-hidden rounded-2xl">
                <UnifiedColoringDetail 
                  id={selectedDetailId}
                  type="categories"
                  category="General"
                  isDialog={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Coloring Page Dialog */}
      {showColoringPageDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {isReadOnlyMode ? 'View Coloring Page' : editingColoringPage ? 'Edit Coloring Page' : 'Add Coloring Page'}
              </h3>
              <button
                onClick={() => setShowColoringPageDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 p-6">
                {/* Left: Image Preview */}
                <div className="flex flex-col">
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col relative">
                    {coloringPageFormData.thumbnailUrl ? (
                      <div className="relative group flex-1 flex flex-col bg-gray-100 rounded-lg overflow-hidden">
                        {/* Image Container */}
                        <div className="flex-1 w-full h-full">
                          <Image
                            src={coloringPageFormData.thumbnailUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600 mb-1">No Image</span>
                        <span className="text-xs text-gray-400">Please create from AI generated image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Form Fields */}
                <div className="aspect-square flex flex-col space-y-1 overflow-y-auto pr-2">
                  {/* Title and Slug */}
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={coloringPageFormData.title}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, title: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter coloring page title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={coloringPageFormData.slug}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, slug: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="coloring-page-slug"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      Description
                    </label>
                    <textarea
                      value={coloringPageFormData.description}
                      onChange={(e) => setColoringPageFormData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={isReadOnlyMode}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter description"
                    />
                  </div>

                  {/* Difficulty, Age Range, Size */}
                  <div className="grid grid-cols-3 gap-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Difficulty
                      </label>
                      <select
                        value={coloringPageFormData.difficulty}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {metadata.difficulty.length > 0 ? (
                          metadata.difficulty.map((item: any) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Age Range
                      </label>
                      <input
                        type="text"
                        value={coloringPageFormData.ageRange}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, ageRange: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="3-5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Size
                      </label>
                      <select
                        value={coloringPageFormData.size}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, size: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {metadata.size.length > 0 ? (
                          metadata.size.map((item: any) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="A4">A4 (210x297mm)</option>
                            <option value="Letter">Letter (8.5x11in)</option>
                            <option value="Original">Original</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Theme and Style */}
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Theme
                      </label>
                      <select
                        value={coloringPageFormData.theme}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, theme: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select theme</option>
                        {metadata.theme.length > 0 && metadata.theme.map((item: any) => (
                          <option key={item.value} value={item.value}>
                            {item.icon && `${item.icon} `}{item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Style
                      </label>
                      <select
                        value={coloringPageFormData.style}
                        onChange={(e) => setColoringPageFormData(prev => ({ ...prev, style: e.target.value }))}
                        disabled={isReadOnlyMode}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select style</option>
                        {metadata.style.length > 0 && metadata.style.map((item: any) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* AI Prompt */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      AI Prompt
                    </label>
                    <textarea
                      value={coloringPageFormData.aiPrompt}
                      onChange={(e) => setColoringPageFormData(prev => ({ ...prev, aiPrompt: e.target.value }))}
                      disabled={isReadOnlyMode}
                      rows={3}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="AI generation prompt"
                    />
                  </div>

                  {/* SEO 字段已隐藏 - 但数据仍会在后台保存 */}
                  {/* SEO Title */}
                  {/* <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={coloringPageFormData.seoTitle}
                      onChange={(e) => setColoringPageFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                      disabled={isReadOnlyMode}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Title for search engine optimization"
                    />
                  </div> */}

                  {/* SEO Description */}
                  {/* <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">
                      SEO Description
                    </label>
                    <textarea
                      value={coloringPageFormData.seoDescription}
                      onChange={(e) => setColoringPageFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                      disabled={isReadOnlyMode}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Description for search engine optimization"
                    />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowColoringPageDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {isReadOnlyMode ? 'Close' : 'Cancel'}
                </button>
                {!isReadOnlyMode && (
                  <button
                    onClick={saveColoringPage}
                    className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[30vh]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this coloring page? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingPageId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteColoringPage}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast通知 */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
} 