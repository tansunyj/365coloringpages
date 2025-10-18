import Image from 'next/image';

interface GenericArticleProps {
  title: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      text: string;
      image?: {
        src: string;
        alt: string;
        prompt: string;
      };
    }[];
  };
  ctaText?: string;
  ctaLink?: string;
}

export default function GenericArticle({ title, content, ctaText = "Browse Coloring Pages", ctaLink = "/categories" }: GenericArticleProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {/* 引言 */}
      <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
        {content.intro}
      </p>

      {/* 内容区域 */}
      {content.sections.map((section, index) => (
        <div key={index}>
          <h2>{section.heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.text }} />
          
          {section.image && (
            <div className="my-8 rounded-xl overflow-hidden">
              <Image
                src={section.image.src}
                alt={section.image.alt}
                width={1200}
                height={600}
                className="w-full h-auto"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                AI Image Prompt: {section.image.prompt}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* CTA */}
      <div className="my-8 p-6 bg-orange-100 dark:bg-gray-700 rounded-xl">
        <h3 className="mt-0 text-orange-800 dark:text-orange-300">🎨 Ready to Start Coloring?</h3>
        <p className="mb-4">
          Explore our collection and bring your creativity to life!
        </p>
        <a 
          href={ctaLink} 
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          {ctaText} �?
        </a>
      </div>
    </div>
  );
}

