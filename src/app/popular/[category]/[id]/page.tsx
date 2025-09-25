import UnifiedColoringDetail from '../../../../components/UnifiedColoringDetail';

interface PageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// 为静态导出生成路径
export async function generateStaticParams() {
  // 生成分类和ID的组合
  const categories = [
    'animals', 'fantasy', 'ocean', 'space', 'nature', 'prehistoric', 
    'superhero', 'farm', 'fairy-tale', 'holidays', 'all'
  ];
  const staticParams: { category: string; id: string }[] = [];
  
  // 为每个分类生成1-200的ID范围
  categories.forEach(category => {
    for (let i = 1; i <= 200; i++) {
      staticParams.push({
        category,
        id: i.toString()
      });
    }
  });

  return staticParams;
}

export default async function PopularCategoryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <UnifiedColoringDetail 
      id={resolvedParams.id} 
      type="popular" 
      category={resolvedParams.category}
    />
  );
} 