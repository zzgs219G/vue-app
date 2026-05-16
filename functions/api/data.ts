export const onRequestGet = async (context) => {
  try {
    // 1. 先从 KV 里面把分类拿出来（分类一般固定，适合放 KV）
    const categoriesData = await context.env.KV.get('categories_list');
    const categories = JSON.parse(categoriesData || '[]');

    // 2. ⚡️ 核心：实时去爬你的蓝奏云接口 ⚡️
    // 请把下面这个 URL 换成你实际上用来爬取数据的那个真实蓝奏云接口地址
    const lanzouApiUrl = 'https://你的蓝奏云爬虫接口地址.com/api/list'; 
    
    const response = await fetch(lanzouApiUrl, {
      method: 'GET', // 如果你的接口需要 POST，这里可以改成 POST
      headers: {
        'User-Agent': 'Cloudflare-Edge-Fetch',
        // 如果你的接口需要 Token 或密码，可以在这里加 Header
      }
    });

    if (!response.ok) {
      throw new Error('请求蓝奏云接口失败');
    }

    // 3. 解析蓝奏云接口返回的原始数据
    const rawData = await response.json();

    // 4. 【关键步骤】把蓝奏云的数据，转换成你 Vue 前端需要的格式
    // 假设你的蓝奏云接口返回的是一个数组，我们用 .map 把它变成前端需要的样子
    const resources = rawData.map((item: any) => {
      return {
        id: item.id || item.file_id,                     // 蓝奏云的文件ID
        title: item.name || item.file_name,               // 文件名
        description: item.desc || `大小：${item.size}`,     // 文件描述或大小
        categoryId: item.category || 'software',          // 分类，可以根据逻辑动态判断
        lanzaoUrl: item.url || `https://yxlzy.lanzoue.com/${item.id}`, // 蓝奏云下载链接
        password: item.pwd || '',                        // 提取码
        createdAt: item.time || new Date().toISOString()  // 上传时间
      };
    });

    // 5. 打包一起倒给前端
    return Response.json({
      categories: categories,
      resources: resources
    });

  } catch (err: any) {
    return new Response(`后端报错了: ${err.message}`, { status: 500 });
  }
}
