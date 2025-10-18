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
  const colorButtonRef = useRef<HTMLButtonElement>(null);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'text' | null>('pen');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [showTip, setShowTip] = useState(false);
  const [textInput, setTextInput] = useState<{
    show: boolean;
    x: number;
    y: number;
    text: string;
    isDragging: boolean;
  }>({
    show: false,
    x: 100,
    y: 100,
    text: '',
    isDragging: false,
  });
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // 初始化画�?
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
          // 如果 blob 方式失败，尝试直接加�?
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
        // 降级：直接尝试加载图�?
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

  // 保存到历史记�?
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

  // 开始绘�?
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 如果是文本工具，显示文本输入�?
    if (activeTool === 'text') {
      const pos = getMousePos(e);
      if (!pos) return;
      
      setTextInput({
        show: true,
        x: pos.x,
        y: pos.y,
        text: '',
        isDragging: false,
      });
      return;
    }
    
    if (!activeTool) return;
    
    const pos = getMousePos(e);
    if (!pos) return;

    setIsDrawing(true);
    lastPos.current = pos;
  };

  // 绘制�?
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
      // 用户开始编辑后隐藏提示
      if (showTip) {
        setShowTip(false);
      }
    }
  };

  // 启用画笔工具
  const enablePen = () => {
    setActiveTool('pen');
  };

  // 启用橡皮�?
  const enableEraser = () => {
    setActiveTool('eraser');
  };

  // 启用文字工具
  const enableText = () => {
    setActiveTool('text');
  };
  
  // 添加文字到画�?
  const addTextToCanvas = (text: string, x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx || !text.trim()) return;

    ctx.font = `${brushSize * 6}px Arial`;
    ctx.fillStyle = brushColor;
    ctx.fillText(text, x, y);
    saveToHistory();
    
    // 重置文本输入
    setTextInput({
      show: false,
      x: 100,
      y: 100,
      text: '',
      isDragging: false,
    });
  };

  // 清除画布（保留背景）
  const clearCanvas = () => {
    if (history.length > 0 && historyStep >= 0) {
      const ctx = context;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      // 恢复到第一个状态（原始图片�?
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
        {/* 头部工具�?*/}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Image Editor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 工具�?*/}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 overflow-x-auto overflow-y-visible">
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

          {/* 橡皮�?*/}
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
            onClick={enableText}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTool === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Type className="h-4 w-4" />
            <span className="text-sm">Text</span>
          </button>

          <div className="w-px h-8 bg-gray-300 mx-2" />

          {/* 颜色选择�?*/}
          <div className="relative">
            <button
              ref={colorButtonRef}
              onClick={() => {
                if (!showColorPicker && colorButtonRef.current) {
                  const rect = colorButtonRef.current.getBoundingClientRect();
                  setColorPickerPosition({
                    top: rect.bottom + 8,
                    left: rect.left,
                  });
                }
                setShowColorPicker(!showColorPicker);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div
                className="w-6 h-6 rounded border-2 border-gray-300"
                style={{ backgroundColor: brushColor }}
              />
              <span className="text-sm text-gray-700">Color</span>
            </button>
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
            className={`p-2 rounded-lg transition-all ${
              historyStep <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 shadow-sm'
            }`}
            title={historyStep <= 0 ? 'No actions to undo' : 'Undo (撤销上一步操�?'}
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className={`p-2 rounded-lg transition-all ${
              historyStep >= history.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 shadow-sm'
            }`}
            title={historyStep >= history.length - 1 ? 'No actions to redo' : 'Redo (重做上一步操�?'}
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
          
          {/* 操作提示 */}
          {!isLoading && showTip && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-20 animate-bounce">
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                <span className="font-medium">💡 点击"Pen"工具，然后在图片上绘制，即可使用撤销/重做功能�?/span>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow-lg rounded-lg relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair"
            />
            
            {/* 文本输入�?- 在画布上显示 */}
            {textInput.show && (
              <div
                className="absolute bg-white border-2 border-blue-500 rounded-lg shadow-lg p-2"
                style={{
                  left: `${textInput.x}px`,
                  top: `${textInput.y}px`,
                  minWidth: '200px',
                  zIndex: 100,
                }}
              >
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={textInput.text}
                    onChange={(e) => setTextInput(prev => ({ ...prev, text: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTextToCanvas(textInput.text, textInput.x, textInput.y + 30);
                      } else if (e.key === 'Escape') {
                        setTextInput(prev => ({ ...prev, show: false }));
                      }
                    }}
                    placeholder="输入文字..."
                    autoFocus
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addTextToCanvas(textInput.text, textInput.x, textInput.y + 30)}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => setTextInput(prev => ({ ...prev, show: false }))}
                      className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                    >
                      取消
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">💡 �?Enter 添加，Esc 取消</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 颜色选择器弹出层 - 使用 fixed 定位，避免被遮挡 */}
      {showColorPicker && (
        <>
          <div
            className="fixed inset-0 z-[10000]"
            onClick={() => setShowColorPicker(false)}
          />
          <div
            className="fixed z-[10001]"
            style={{
              top: `${colorPickerPosition.top}px`,
              left: `${colorPickerPosition.left}px`,
            }}
          >
            <ChromePicker
              color={brushColor}
              onChange={(color) => setBrushColor(color.hex)}
            />
          </div>
        </>
      )}
    </div>
  );
}
