'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Settings, Palette, Heart, Download, User, Mail, Lock, Camera, Save, X, Eye, EyeOff, ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { API_ENDPOINTS } from '@/lib/apiConfig';

// API 请求工具函数
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.href = '/';
    throw new Error('Token 已失效，请重新登录');
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
        alert('请选择图片文件！');
        return;
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片文件大小不能超过5MB！');
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
const PasswordChangeDialog = ({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSave = () => {
    if (!currentPassword || !newPassword) {
      alert('请填写完整的密码信息');
      return;
    }
    if (newPassword.length < 6) {
      alert('新密码长度至少6位');
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
                  placeholder="Enter new password (min 6 characters)"
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
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.PUBLIC.USER.ME);
      const result = await response.json();
      
      if (result.success && result.data) {
        setUserInfo({
          id: result.data.id,
          nickname: result.data.name || '',
          email: result.data.email || '',
          avatar: result.data.avatar || '',
          provider: result.data.provider || '',
          totalCreations: result.data.totalCreations || 0,
          totalFavorites: result.data.totalFavorites || 0,
          totalLikes: result.data.totalLikes || 0
        });
        setError('');
      } else {
        setError(result.error || '获取用户信息失败');
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
      setError('获取用户信息失败，请重新登录');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 在组件加载时通知Header组件用户已登录
  useEffect(() => {
    if (userInfo.avatar) {
      const loginEvent = new CustomEvent('userLogin', {
        detail: {
          isLoggedIn: true,
          userAvatar: userInfo.avatar
        }
      });
      window.dispatchEvent(loginEvent);
    }

    return () => {
      const logoutEvent = new CustomEvent('userLogout');
      window.dispatchEvent(logoutEvent);
    };
  }, [userInfo.avatar]);

  // 更新个人资料
  const updateProfile = async (name?: string, avatar?: string) => {
    try {
      const body: any = {};
      if (name) body.name = name;
      if (avatar) body.avatar = avatar;

      const response = await fetchWithAuth(API_ENDPOINTS.PUBLIC.USER.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setUserInfo(prev => ({
          ...prev,
          nickname: result.data.name || prev.nickname,
          avatar: result.data.avatar || prev.avatar
        }));
        // 通知 Header 更新头像
        const avatarUpdateEvent = new CustomEvent('userAvatarUpdate', {
          detail: { avatar: result.data.avatar }
        });
        window.dispatchEvent(avatarUpdateEvent);
        alert('个人资料更新成功');
        return true;
      } else {
        alert(result.error || '更新失败');
        return false;
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      alert('更新失败，请重试');
      return false;
    }
  };

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PUBLIC.USER.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('密码修改成功，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/';
        return true;
      } else {
        alert(result.error || '修改失败');
        return false;
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      alert('修改失败，请重试');
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



  const handleSave = () => {
    setIsEditing(false);
    if (passwordChanged) {
      alert('账户信息已保存！密码已更新。');
      setPasswordChanged(false);
    } else {
      alert('账户信息已保存！');
    }

    // 更新头像后通知Header组件
    if (userInfo.avatar) {
      const updateAvatarEvent = new CustomEvent('userAvatarUpdate', {
        detail: {
          userAvatar: userInfo.avatar
        }
      });
      window.dispatchEvent(updateAvatarEvent);
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
        alert('请选择图片文件！');
        return;
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片文件大小不能超过5MB！');
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

  // 处理裁剪完成
  const handleCropSave = (croppedImage: string) => {
    setUserInfo(prev => ({
      ...prev,
      avatar: croppedImage
    }));
  };

  // 处理重新上传（从裁剪对话框中）
  const handleReuploadFromCrop = (newImageUrl: string) => {
    setTempImageUrl(newImageUrl);
    setIsCropDialogOpen(true);
  };

  const handlePasswordChange = (currentPassword: string, newPassword: string) => {
    // 这里可以添加密码验证逻辑
    
    // 更新密码状态
    setPasswordChanged(true);
    alert('密码已在对话框中更新，请点击右下角的"Save Changes"按钮最终保存！');
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
          {passwordChanged && (
            <p className="text-xs text-green-600 mt-1">
              Password has been updated in dialog. Click &quot;Save Changes&quot; to apply.
            </p>
          )}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
            passwordChanged 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Save className="h-4 w-4" />
          Save Changes
          {passwordChanged && <span className="text-xs">(Password Updated)</span>}
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
      />
    </div>
  );

  const renderMyCreations = () => {
    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Creations</h2>
        
        {listLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : creations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creations.map((creation) => (
                <div key={creation.id} className="group cursor-pointer">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <Image
                      src={creation.thumbnailUrl || creation.imageUrl}
                      alt={creation.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
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
            <p className="text-gray-500">You haven't created any coloring pages yet.</p>
          </div>
        )}
      </div>
    );
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
                <div key={favorite.id} className="group cursor-pointer">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                    <Image
                      src={favorite.thumbnailUrl || favorite.imageUrl}
                      alt={favorite.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3">
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
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
    </div>
  );
} 