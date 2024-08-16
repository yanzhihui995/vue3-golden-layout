/**
* 定义一个布局配置
*/

const miniRowConfig = [
  {
    name: '文件夹1',
    children: [
      {
        name: '文件夹2',
        children: [
          {
            name: '组件1',
            component:"MyComponent1",
          },
          {
            name: '组件2',
            component:"MyComponent2",
          },
          {
            name: '组件3',
            component:"MyComponent3",
          },
        ],
      },
    ],
  }
]

// 导出预定义的布局配置
export const prefinedLayouts = {
  miniRow: miniRowConfig,
};
