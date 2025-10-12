'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wand2, Download, Printer, History, Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

export default function AIGeneratorClient() {
  const [prompt, setPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState(5);
  const [history, setHistory] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: 'A whimsical forest with talking animals and glowing mushrooms.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo',
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      prompt: 'Beautiful mandala with intricate patterns.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo',
      timestamp: new Date('2024-01-14T15:45:00')
    }
  ]);

  const sampleGeneratedImage: GeneratedImage = {
    id: Date.now().toString(),
    prompt: 'A whimsical forest with talking animals and glowing mushrooms.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1jT5zi9-qlvUaFP7QTRlAn8e0f-lZWeSi9zOtDe0_YQGrzjNgnRGCHoW0os_5NSIj6IALj7QbffWUCNF3zKbC1tjp42x0amRC4NelIg156aOh-OGUUTh1WwYMpEKFQ6p9w1VxzEdX0JIz7ArdQjEk9BlmrjVoH5UKe6rHmpbd1pBWzYY-Q2XGecxjCZT62vRpQlfbSCoyYQziETRsP2PxcawUNjAeUc7uZlR3zQfQsQXi3DuTd9RnzIb_bE-FqpVzP-dXVPPSbQo',
    timestamp: new Date()
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || generationsRemaining <= 0) return;

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newImage = {
      ...sampleGeneratedImage,
      prompt: prompt,
      id: Date.now().toString()
    };
    
    setCurrentImage(newImage);
    setHistory(prev => [newImage, ...prev.slice(0, 9)]);
    setGenerationsRemaining(prev => prev - 1);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (currentImage) {
    }
  };

  const handlePrint = () => {
    if (currentImage) {
    }
  };

  const selectFromHistory = (image: GeneratedImage) => {
    setCurrentImage(image);
    setPrompt(image.prompt);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcf8' }}>
      <Header />
      
      <main className="py-12">
        <div className="text-center mb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            AI Coloring Page Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create unique coloring pages with AI. Describe your idea, and our AI will bring it to life.
          </p>
        </div>

        {/* 核心布局容器: Flexbox 布局，确保所有子元素都在同一行且不重叠 */}
        <div className="flex justify-center items-stretch max-w-7xl mx-auto gap-12">
          
          {/* 左侧 Prompt 输入区域 - 固定的宽度和高度 */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Wand2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Create Your Vision</h3>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Describe your ideal coloring page
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="输入你的创意，AI将为你生成独一无二的涂色页……

例如：一个神奇的森林，里面有会说话的动物和发光的蘑菇。"
                    className="w-full h-96 p-5 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 text-base leading-relaxed placeholder-gray-400"
                  />
                </div>

                
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || generationsRemaining <= 0 || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0 disabled:hover:shadow-lg text-lg mt-4"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>AI is creating magic...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 中央正方形容器 - 居中并占据主体 */}
          <div className="flex-1 w-full max-w-4xl aspect-square">
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 h-full flex flex-col hover:shadow-xl transition-all duration-300">
              {currentImage ? (
                <>
                  <div className="flex-1 flex items-center justify-center mb-8">
                    <div className="relative w-full max-w-lg aspect-square">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-20 blur-lg"></div>
                      <div className="relative bg-white rounded-3xl p-4 shadow-xl">
                        <Image
                          src={currentImage.imageUrl}
                          alt={currentImage.prompt}
                          fill
                          className="object-contain rounded-2xl"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Generated Description
                      </h4>
                      <p className="text-gray-800 text-lg leading-relaxed font-medium">
                        {currentImage.prompt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      <Download className="h-5 w-5" />
                      Download HD
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      <Printer className="h-5 w-5" />
                      Print Page
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <Wand2 className="h-16 w-16 text-blue-500" />
                    </div>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Canvas Awaits
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed text-lg">
                    描述你的理想涂色页，让AI为你创造独一无二的艺术作品。
                  </p>
                  <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>在左侧输入框中描述你的想法</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧历史记录 - 固定的宽度和高度 */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <History className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700">Recent Creations</h3>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pb-16">
                {history.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => selectFromHistory(image)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group-hover:border-blue-300 transition-all duration-200 group-hover:shadow-md">
                      <Image
                        src={image.imageUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-end">
                        <div className="w-full p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-white text-xs font-medium line-clamp-2">
                            {image.prompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {history.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    你还没有生成过涂色页，<br/>
                    快来创建你的第一个作品吧！
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}