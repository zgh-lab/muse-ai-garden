// Shared mock assets data
export const mockAssets = [
  { 
    id: 1, 
    type: "image", 
    name: "山景日落.png",
    url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400", 
    date: "2024-01-15", 
    software: "Midjourney", 
    prompt: "A serene mountain landscape at sunset",
    preview: "bg-gradient-to-br from-orange-500 to-pink-500"
  },
  { 
    id: 2, 
    type: "image", 
    name: "几何图案.png",
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400", 
    date: "2024-01-14", 
    software: "DALL-E", 
    prompt: "Abstract colorful geometric patterns",
    preview: "bg-gradient-to-br from-blue-500 to-cyan-500"
  },
  { 
    id: 3, 
    type: "image", 
    name: "未来城市.png",
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400", 
    date: "2024-01-13", 
    software: "Stable Diffusion", 
    prompt: "Futuristic city with neon lights",
    preview: "bg-gradient-to-br from-purple-500 to-pink-500"
  },
  { 
    id: 4, 
    type: "image", 
    name: "示例图片 3.png",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400", 
    date: "2024-01-11", 
    software: "Midjourney", 
    prompt: "Abstract art composition",
    preview: "bg-gradient-to-br from-green-500 to-emerald-500"
  },
  { 
    id: 5, 
    type: "image", 
    name: "示例图片 4.png",
    url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400", 
    date: "2024-01-10", 
    software: "DALL-E", 
    prompt: "Digital art landscape",
    preview: "bg-gradient-to-br from-indigo-500 to-purple-500"
  },
  { 
    id: 6, 
    type: "video", 
    name: "海浪动画.mp4",
    url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400", 
    date: "2024-01-12", 
    software: "Runway", 
    prompt: "Animated ocean waves",
    preview: "bg-gradient-to-br from-blue-500 to-teal-500"
  },
  { 
    id: 7, 
    type: "video", 
    name: "示例视频 1.mp4",
    url: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400", 
    date: "2024-01-09", 
    software: "Pika", 
    prompt: "Abstract motion graphics",
    preview: "bg-gradient-to-br from-red-500 to-orange-500"
  },
];

export type Asset = typeof mockAssets[0];
