module.exports = {
  title: 'Kalengo Nest',
  base: '/nest_doc/',
  description: 'Just playing around',
  themeConfig: {
    displayAllHeaders: true,
    nav: [
      {text: '首页', link: '/'},
      {text: '快速开始', link: '/quickstart'},
      {text: 'Github', link: 'https://github.com/kaolalicai/klg-nest-starter'},
    ],
    sidebar: [
      '/',
      ['/quickstart', '快速开始'],
      ['/web', 'Web生命周期'],
      ['/test', '测试'],
      ['/config', '应用配置'],
      ['/mongoose', 'Mongodb'],
      ['/code-style', '代码风格'],
      ['/klg', '工具集'],
      ['/extend', '其他技术'],
      ['/contribut', '如何贡献'],
    ]
  }
}
