import {
  ItemType,
  LayoutConfig,
} from "golden-layout";

/**
* 定义一个布局配置
*/
const miniRowConfig = {
  root: {
      type: ItemType.row,
      content: [
          {
              type: "component",
              title: "Title 1st",
              header: { show: "top" },
              isClosable: false,
              componentType: "MyComponent1",
              width: 10,
              componentState: undefined,
          },
          {
              type: "component",
              title: "I'm wide",
              header: { show: "top", popout: false },
              componentType: "MyComponent2",
              componentState: { abc: 123 },
          },
      ],
  },
};

// 导出预定义的布局配置
export const prefinedLayouts = {
  miniRow: miniRowConfig,
};
