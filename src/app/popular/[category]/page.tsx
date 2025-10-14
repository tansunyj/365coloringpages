import PopularCategoryPageClient from './PopularCategoryPageClient';

interface PopularCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function PopularCategoryPage({ params }: PopularCategoryPageProps) {
  const { category } = await params;
  
  return (
    <PopularCategoryPageClient category={category} />
  );
}