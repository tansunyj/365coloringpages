import PopularCategoryClient from './PopularCategoryClient';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  const categories = [
    'animals', 'fantasy', 'ocean', 'space', 'nature', 'prehistoric', 
    'superhero', 'farm', 'fairy-tale', 'holidays', 'all'
  ];
  
  return categories.map(category => ({
    category
  }));
}

export default async function PopularCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <PopularCategoryClient category={resolvedParams.category} />;
} 