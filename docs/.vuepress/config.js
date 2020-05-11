module.exports = {
  title: 'Kalengo Nest',
  base: '/nest_doc/',
  description: 'Just playing around',
  themeConfig: {
    // displayAllHeaders: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/quickstart' },
      { text: 'Github', link: 'https://github.com/kaolalicai/klg-nest-starter' }
    ],
    sidebar: [
      {
        title: '从 Web 开始', // 必要的
        path: '/quickstart', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          ['/quickstart', '快速开始'],
          ['/web', 'Web生命周期'],
          ['/test', '测试']
        ]
      },
      ['/database/mongoose', 'Database'],
      ['/config', '应用配置'],
      {
        title: '其他技术',
        path: '/extend/redis',
        collapsable: false,
        children: [
          ['/extend/redis', 'Redis'],
          ['/extend/rabbitmq', 'RabbitMQ'],
          ['/extend/keycloak', 'Keycloak SSO 认证和授权'],
          ['/extend/logger', '日志 Logger'],
          ['/extend/event', '事件处理 Event'],
          ['/extend/crud', 'CRUD'],
          ['/extend/workflow', '工作流/微服务编排'],
          ['/extend/decorator', '自定义注解']
        ]
      },
      ['/code-style', '代码风格'],
      ['/utils', '常用工具'],
      ['/contribut', '如何贡献']
    ]
  }
}
