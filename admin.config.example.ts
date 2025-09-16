// 管理员配置示例文件
// 请复制此文件为 admin.config.ts 并修改为您的实际配置

export const adminConfig = {
  email: 'admin@365coloringpages.com',
  password: 'admin123456',
  name: '管理员',
  role: 'superadmin'
};

// JWT 密钥（生产环境请使用复杂的随机字符串）
export const jwtSecret = 'your-super-secret-jwt-key-change-this-in-production'; 