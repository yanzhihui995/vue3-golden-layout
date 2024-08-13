<template>
  <div ref="layoutContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import { onMounted, ref, onBeforeUnmount, nextTick, createApp } from 'vue';
import { GoldenLayout } from 'golden-layout';
import MyComponent1 from './MyComponent1.vue';
import MyComponent2 from './MyComponent2.vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

export default {
  setup() {
    const layoutContainer = ref(null);
    let myLayout;

    onMounted(() => {
      const config = {
        content: [{
          type: 'row',
          content: [{
            type: 'component',
            componentName: 'myComponent1',
            title: 'Component 1',
            componentState: {
              instance: MyComponent1
            }
          }, {
            type: 'component',
            componentName: 'myComponent2',
            title: 'Component 2',
            componentState: {
              instance: MyComponent2
            }
          }]
        }]
      };
      myLayout = new GoldenLayout(config, layoutContainer.value);
      // 注册 Vue 组件到 Golden Layout
      config.content[0].content.forEach((item) => {
        myLayout.registerComponentFactoryFunction(item.componentName, (container, state) => {
          // 创建 Vue 实例并挂载到 Golden Layout 的容器中
          console.log(container);
          const app = createApp(item.componentState.instance);
          app.mount(container.getElement());
        });
      })
      myLayout.init();
    });

    onBeforeUnmount(() => {
      if (myLayout) {
        myLayout.destroy();
      }
    });

    return {
      layoutContainer
    };
  }
};
</script>
