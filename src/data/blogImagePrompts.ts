// 博客文章图片AI生成提示词配置
// 为每篇文章提供封面图和内部配图的专业AI提示词

export interface ImagePrompt {
  type: 'cover' | 'content';
  prompt: string;
  style?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export interface ArticleImages {
  slug: string;
  coverImage: ImagePrompt;
  contentImages: ImagePrompt[];
}

export const blogImagePrompts: ArticleImages[] = [
  {
    slug: 'coloring-pages-ultimate-guide',
    coverImage: {
      type: 'cover',
      prompt: 'A vibrant overhead view of an artist workspace with coloring books spread open, rainbow of colored pencils organized by color, freshly colored pages, warm natural lighting, professional photography style, inviting and creative atmosphere',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Close-up of hands holding colored pencils over a detailed mandala coloring page, peaceful meditation scene, soft focus background, warm cozy lighting',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Collection of diverse animal coloring pages spread on wooden table - lions, elephants, butterflies, puppies - with art supplies, educational and fun atmosphere',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Multi-generational family coloring together at dining table, grandparents and grandchildren, genuine smiles, bonding activity, warm family atmosphere, natural lighting',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'christmas-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Cozy Christmas coloring scene with festive coloring pages featuring Santa and snowflakes, hot cocoa with marshmallows, twinkling fairy lights, pine branches, colored pencils, magical holiday atmosphere, warm golden lighting',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Children sitting around fireplace coloring Christmas pages together, decorated tree in background, stockings hanging, festive decorations, joyful family activity, cozy winter evening',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Beautiful detailed Christmas tree coloring page illustration with ornaments, star topper, wrapped presents underneath, intricate line art suitable for coloring, clean black and white design',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Magical winter village scene with snow-covered cottages, glowing windows, starry night sky, gentle snowfall, church steeple, suitable for coloring page, whimsical storybook style',
        style: 'illustration'
      }
    ]
  },
  {
    slug: 'halloween-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Halloween coloring setup with spooky-cute coloring pages featuring friendly ghosts and pumpkins, orange and purple colored pencils, autumn leaves, candy corn, festive Halloween decorations, playful not scary atmosphere',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Kids in costume coloring Halloween pages at decorated table, jack-o-lanterns glowing, festive party atmosphere, fun and safe Halloween celebration',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Friendly cartoon ghost and smiling pumpkin coloring page design, cute not scary, suitable for children, clean line art, fun Halloween characters',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Haunted house coloring page with friendly bats, full moon, twisted trees, whimsical spooky atmosphere suitable for kids, detailed illustration style',
        style: 'illustration'
      }
    ]
  },
  {
    slug: 'adult-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Elegant adult coloring setup with intricate mandala and floral pages, high-quality colored pencils, calming tea, minimalist modern workspace, peaceful atmosphere, professional art supplies, soft natural lighting',
      style: 'photoreistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Close-up of adult hands coloring detailed geometric mandala pattern, showing concentration and mindfulness, stress relief activity, peaceful meditation scene',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Intricate floral mandala coloring page with detailed petals, leaves, and geometric patterns, sophisticated adult coloring design, clean black line art',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Zen meditation space with completed adult coloring pages displayed on wall, plants, candles, peaceful sanctuary atmosphere showing therapeutic benefits',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'cute-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Adorable kawaii-style coloring pages spread out featuring cute animals with big eyes, pastel colored pencils, stickers, happy cheerful atmosphere, bright and playful workspace',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Super cute baby animals coloring page - bunny, kitten, puppy with big eyes and happy faces, kawaii style, simple and adorable, perfect for kids',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Child coloring cute character page with bright smile, rainbow of crayons, creative expression, joyful activity, colorful playful atmosphere',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'unicorn-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Magical unicorn coloring scene with fantasy pages featuring majestic unicorns, rainbow colored pencils, glitter, stars, dreamy pastel colors, enchanted creative workspace, sparkly magical atmosphere',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Majestic unicorn in enchanted forest coloring page, flowing mane and tail, magical flowers, butterflies, stars, detailed fantasy illustration, ethereal and dreamy',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Rainbow unicorn leaping through clouds coloring page design, magical sparkles, celestial elements, whimsical fantasy art suitable for coloring',
        style: 'illustration'
      },
      {
        type: 'content',
        prompt: 'Young girl coloring unicorn page with amazement on face, creative imagination, magical playtime, fantasy and wonder atmosphere',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'flower-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Beautiful botanical coloring setup with detailed flower pages, real fresh flowers as reference, botanical colored pencils, gardening book, natural light from window, serene nature-inspired workspace',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Detailed rose garden coloring page with various flowers in full bloom, leaves, stems, thorns, botanical illustration style, intricate line art',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Sunflower field coloring page with big blooms, bees, butterflies, summer garden scene, cheerful and bright design',
        style: 'illustration'
      },
      {
        type: 'content',
        prompt: 'Person coloring flower pages in peaceful garden setting, surrounded by real plants, nature therapy, mindful outdoor activity',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'thanksgiving-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Thanksgiving coloring table with harvest-themed pages, autumn colored pencils in orange brown gold, pumpkins, fall leaves, cornucopia, cozy autumn atmosphere, warm golden hour lighting',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Turkey and harvest coloring page with pumpkins, corn, autumn leaves, Thanksgiving feast elements, family-friendly festive design',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Family gathering coloring Thanksgiving pages together, multi-generational, gratitude and togetherness, warm autumn table setting',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'spring-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Spring awakening coloring scene with flower blooming pages, pastel colored pencils, fresh tulips in vase, cherry blossoms, butterfly decorations, light airy atmosphere, soft morning light',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Spring garden coloring page with blooming flowers, baby birds, butterflies, raindrops, new growth, cheerful renewal theme, detailed nature illustration',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Children coloring spring pages outdoors in blooming garden, surrounded by real flowers, Easter eggs, joyful spring activity',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'summer-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Summer coloring setup on beach blanket with ocean-themed pages, bright tropical colored pencils, seashells, sunglasses, lemonade, sunny beach atmosphere, vibrant summer vibes',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Beach scene coloring page with waves, palm trees, sandcastle, seashells, summer fun, vacation theme, detailed seaside illustration',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Ice cream and summer treats coloring page, watermelon, popsicles, sunshine, fun summer elements, cute and colorful design',
        style: 'illustration'
      }
    ]
  },
  {
    slug: 'fall-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Autumn coloring nook with fall foliage pages, warm orange brown red colored pencils, cozy blanket, pumpkin spice latte, maple leaves, acorns, hygge atmosphere, golden autumn light',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Autumn forest coloring page with falling leaves, woodland animals, oak trees, cozy cabin, harvest season, detailed fall landscape',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Person wrapped in blanket coloring fall pages by window with autumn view, cozy indoor activity, seasonal comfort',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'princess-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Magical princess coloring workspace with royal themed pages, sparkly gel pens, pastel colored pencils, tiara, wand, fairy tale books, enchanting princess atmosphere, dreamy soft lighting',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Beautiful princess in ball gown at castle coloring page, elaborate dress details, crown, magical kingdom background, fairy tale illustration',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Young girl dressed as princess coloring royal pages, imagination play, empowerment through creativity, magical childhood moment',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'cat-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Cat lover coloring setup with feline pages, real cat sleeping nearby, cat-themed colored pencils, paw prints, cozy cat cafe atmosphere, warm domestic scene',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Variety of cat breeds coloring page - Persian, Siamese, tabby, Maine Coon - different poses, cute and realistic, detailed fur textures',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Playful kittens with yarn coloring page, cute cat antics, whiskers, paws, adorable feline behavior, charming illustration',
        style: 'illustration'
      }
    ]
  },
  {
    slug: 'easter-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Easter coloring celebration with bunny and egg pages, pastel spring colored pencils, decorated eggs, chocolate bunnies, spring flowers, joyful Easter atmosphere, soft pastel lighting',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Easter bunny with basket of decorated eggs coloring page, spring flowers, baby chicks, cheerful Easter celebration, family-friendly design',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Children at Easter egg hunt coloring pages outdoors, spring garden, pastel colors, joyful spring holiday celebration',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'dinosaur-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Dinosaur coloring adventure with prehistoric pages, earth tone colored pencils, toy dinosaurs, fossil prints, jungle plants, educational museum-like atmosphere, natural history vibe',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'T-Rex and Triceratops in prehistoric landscape coloring page, volcanoes, ancient plants, detailed dinosaur features, educational and exciting',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Child fascinated while coloring dinosaur pages, learning through play, educational entertainment, curiosity and wonder',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'single-coloring-page-benefits',
    coverImage: {
      type: 'cover',
      prompt: 'Minimalist zen coloring setup with single perfect mandala page, few select colored pencils, simple clean workspace, mindful focus on one beautiful page, peaceful meditative atmosphere',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Hands carefully coloring single intricate mandala, showing focus and presence, mindfulness practice, meditation through art',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Single completed coloring page displayed as finished artwork, framed and appreciated, showing value of one perfect creation',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'free-printable-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Home printing station with computer showing coloring pages, printer outputting fresh pages, organized paper stack, colored pencils ready, accessible creativity setup, modern home office',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Variety of freshly printed coloring pages spread out - animals, flowers, patterns - free printables ready to color, diverse themes',
        style: 'photorealistic'
      },
      {
        type: 'content',
        prompt: 'Family downloading and printing coloring pages together, digital to physical creativity, accessible art for everyone',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'animal-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Wildlife coloring collection with diverse animal pages - safari, ocean, forest creatures, nature documentary books, wildlife colored pencils, explorer atmosphere, natural history museum vibe',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'African safari animals coloring page - elephant, giraffe, lion, zebra - wildlife habitat, educational nature illustration, detailed animal features',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Ocean animals coloring page with dolphin, sea turtle, colorful fish, coral reef, underwater wonder, marine life education',
        style: 'line art illustration'
      }
    ]
  },
  {
    slug: 'dog-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Dog lover coloring space with puppy pages, real dog relaxing nearby, dog treat jar, paw print stamps, cozy pet-friendly atmosphere, warm companionship vibe',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Different dog breeds coloring page - Golden Retriever, Poodle, German Shepherd, Corgi - playful poses, detailed fur textures, dog lover design',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Puppies playing coloring page, cute dog antics, tennis balls, bones, adorable puppy behavior, heartwarming illustration',
        style: 'illustration'
      }
    ]
  },
  {
    slug: 'butterfly-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Butterfly garden coloring setup with delicate wing pattern pages, iridescent colored pencils, real butterfly specimens under glass, flowers, nature journal, transformation theme, ethereal atmosphere',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Monarch butterfly with intricate wing patterns coloring page, surrounding flowers, detailed symmetrical design, nature beauty illustration',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Butterfly life cycle coloring page showing caterpillar to chrysalis to butterfly, educational transformation, metamorphosis stages',
        style: 'illustration'
      }
    ]
  },
  {
    slug: 'mandala-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Meditation space with sacred mandala coloring pages, spiritual atmosphere, incense, candles, cushions, fine-tip pens, zentangle tools, peaceful sanctuary setting, soft ambient lighting',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Intricate geometric mandala coloring page with sacred geometry, complex patterns radiating from center, spiritual meditation design, detailed symmetry',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Person in meditation pose coloring mandala, mindfulness practice, stress relief, therapeutic art activity, zen atmosphere',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'easy-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Beginner-friendly coloring setup with simple large-shape pages, big chunky crayons, encouraging atmosphere, success-oriented designs, accessible art for all ages, bright and welcoming',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Simple shapes coloring page - large circles, hearts, stars - perfect for beginners, clear bold outlines, confidence-building design',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Toddler successfully coloring easy page with big smile, achievement and pride, developmental milestone, joyful learning',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'simple-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Minimalist coloring workspace with clean simple design pages, limited color palette, zen simplicity, "less is more" aesthetic, peaceful uncluttered space, natural light',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Minimalist flower coloring page with clean lines, simple petals, elegant simplicity, modern aesthetic, beautiful in its restraint',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Person enjoying simple coloring page in peaceful moment, mindful simplicity, beauty in basics, calming activity',
        style: 'photorealistic'
      }
    ]
  },
  {
    slug: 'dragon-coloring-pages',
    coverImage: {
      type: 'cover',
      prompt: 'Epic fantasy coloring setup with dragon pages, metallic colored pencils, fantasy novels, crystal decorations, mystical atmosphere, medieval castle aesthetic, dramatic lighting',
      style: 'photorealistic',
      aspectRatio: '16:9'
    },
    contentImages: [
      {
        type: 'content',
        prompt: 'Majestic dragon with detailed scales breathing fire coloring page, castle background, treasure, fantasy epic illustration, powerful and mythical',
        style: 'line art illustration'
      },
      {
        type: 'content',
        prompt: 'Friendly dragon with knight coloring page, adventure theme, fantasy friendship, detailed medieval fantasy scene',
        style: 'illustration'
      }
    ]
  }
];

// 辅助函数：根据slug获取图片提示词
export function getImagePromptsBySlug(slug: string): ArticleImages | undefined {
  return blogImagePrompts.find(article => article.slug === slug);
}

// 辅助函数：获取封面图提示词
export function getCoverImagePrompt(slug: string): ImagePrompt | undefined {
  const article = getImagePromptsBySlug(slug);
  return article?.coverImage;
}

// 辅助函数：获取内容图提示词
export function getContentImagePrompts(slug: string): ImagePrompt[] {
  const article = getImagePromptsBySlug(slug);
  return article?.contentImages || [];
}

