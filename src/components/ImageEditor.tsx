'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Eraser, 
  Pencil, 
  Type, 
  Undo,
  Redo,
  Trash2
} from 'lucide-react';
import { ChromePicker } from 'react-color';

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  onSave?: (editedImageUrl: string) => void;
}

export default function ImageEditor({ imageUrl, onClose, onSave }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'text' | null>(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setContext(ctx);

    // 设置画布尺寸
    canvas.width = 800;
    canvas.height = 800;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 加载图片 - 使用代理 API 绕过跨域问题
    const loadImage = async () => {
      try {
        // 使用代理 API 获取图片
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
          // 缩放图片以适应画布
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          saveToHistory();
          setIsLoading(false);
          
          // 清理临时 URL
          URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
          console.error('Failed to load image');
          // 如果 blob 方式失败，尝试直接加载
          const directImg = new Image();
          directImg.crossOrigin = 'anonymous';
          directImg.onload = () => {
            const scale = Math.min(canvas.width / directImg.width, canvas.height / directImg.height);
            const x = (canvas.width - directImg.width * scale) / 2;
            const y = (canvas.height - directImg.height * scale) / 2;
            ctx.drawImage(directImg, x, y, directImg.width * scale, directImg.height * scale);
            saveToHistory();
            setIsLoading(false);
          };
          directImg.src = imageUrl;
        };
        img.src = objectUrl;
      } catch (error) {
        console.error('Error loading image:', error);
        // 降级：直接尝试加载图片
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          saveToHistory();
          setIsLoading(false);
        };
        img.src = imageUrl;
      }
    };

    loadImage();
  }, [imageUrl]);

  // 保存到历史记录
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(0, historyStep + 1), imageData]);
    setHistoryStep(prev => prev + 1);
  };

  // 撤销
  const undo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;

    const newStep = historyStep - 1;
    ctx.putImageData(history[newStep], 0, 0);
    setHistoryStep(newStep);
  };

  // 重做
  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;

    const newStep = historyStep + 1;
    ctx.putImageData(history[newStep], 0, 0);
    setHistoryStep(newStep);
  };

  // 获取鼠标位置
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 开始绘制
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeTool || activeTool === 'text') return;
    
    const pos = getMousePos(e);
    if (!pos) return;

    setIsDrawing(true);
    lastPos.current = pos;
  };

  // 绘制中
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !lastPos.current) return;

    const pos = getMousePos(e);
    if (!pos) return;

    context.beginPath();
    context.moveTo(lastPos.current.x, lastPos.current.y);
    context.lineTo(pos.x, pos.y);
    context.strokeStyle = activeTool === 'eraser' ? '#ffffff' : brushColor;
    context.lineWidth = activeTool === 'eraser' ? brushSize * 2 : brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();

    lastPos.current = pos;
  };

  // 停止绘制
  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPos.current = null;
      saveToHistory();
    }
  };

  // 启用画笔工具
  const enablePen = () => {
    setActiveTool('pen');
  };

  // 启用橡皮擦
  const enableEraser = () => {
    setActiveTool('eraser');
  };

  // 添加文字
  const addText = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;

    const text = prompt('Enter text:');
    if (!text) return;

    ctx.font = '30px Arial';
    ctx.fillStyle = brushColor;
    ctx.fillText(text, 100, 100);
    saveToHistory();
  };

  // 清除画布（保留背景）
  const clearCanvas = () => {
    if (history.length > 0 && historyStep >= 0) {
      const ctx = context;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      // 恢复到第一个状态（原始图片）
      ctx.putImageData(history[0], 0, 0);
      setHistoryStep(0);
      setHistory(prev => [prev[0]]);
    }
  };

  // 保存编辑后的图片
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png', 1.0);
    
    if (onSave) {
      onSave(dataURL);
    }
    
    // 保存后关闭编辑器
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* 头部工具栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Image Editor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 overflow-x-auto">
          {/* 画笔 */}
          <button
            onClick={enablePen}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTool === 'pen'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Pencil className="h-4 w-4" />
            <span className="text-sm">Pen</span>
          </button>

          {/* 橡皮擦 */}
          <button
            onClick={enableEraser}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTool === 'eraser'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Eraser className="h-4 w-4" />
            <span className="text-sm">Eraser</span>
          </button>

          {/* 文字 */}
          <button
            onClick={addText}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <Type className="h-4 w-4" />
            <span className="text-sm">Text</span>
          </button>

          <div className="w-px h-8 bg-gray-300 mx-2" />

          {/* 颜色选择器 */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div
                className="w-6 h-6 rounded border-2 border-gray-300"
                style={{ backgroundColor: brushColor }}
              />
              <span className="text-sm text-gray-700">Color</span>
            </button>
            {showColorPicker && (
              <div className="absolute top-full mt-2 z-10">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowColorPicker(false)}
                />
                <ChromePicker
                  color={brushColor}
                  onChange={(color) => setBrushColor(color.hex)}
                />
              </div>
            )}
          </div>

          {/* 画笔大小 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Size:</span>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-700 w-8">{brushSize}</span>
          </div>

          <div className="w-px h-8 bg-gray-300 mx-2" />

          {/* 撤销/重做 */}
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>

          {/* 清除 */}
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">Clear</span>
          </button>

          <div className="flex-1" />

          {/* 保存 */}
          <button
            onClick={saveImage}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Save</span>
          </button>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-auto relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading image...</p>
              </div>
            </div>
          )}
          <div className="bg-white shadow-lg rounded-lg">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
