<template>
    <!-- 主容器，使用相对定位 -->
    <div style="position: relative">
      <!-- Golden Layout 管理器的根 DOM，使用绝对定位 -->
      <div ref="GLRoot" style="position: absolute; width: 100%; height: 100%">
        <!-- Root dom for Golden-Layout manager -->
      </div>
      <!-- 容纳所有组件的容器，使用绝对定位 -->
      <div style="position: absolute; width: 100%; height: 100%">
        <!-- 遍历所有组件并渲染 -->
        <gl-component
          v-for="pair in AllComponents"
          :key="pair[0]"
          :ref="GlcKeyPrefix + pair[0]"
        >
          <!-- 动态组件，根据类型加载相应的 Vue 组件 -->
          <component :is="pair[1]"></component>
        </gl-component>
      </div>
    </div>
  </template>
  
  <script setup>
  import {
    onMounted,
    ref,
    markRaw,
    readonly,
    defineExpose,
    defineAsyncComponent,
    defineProps,
    nextTick,
    getCurrentInstance
  } from "vue";
  import {
    ComponentContainer,
    LayoutConfig,
    RowOrColumnItemConfig,
    StackItemConfig,
    ComponentItemConfig,
    ResolvedComponentItemConfig,
    LogicalZIndex,
    VirtualLayout,
    ResolvedLayoutConfig
  } from "golden-layout";
  import GlComponent from "@/components/GoldenLayoutContainer/GlComponent.vue";
  
  /*******************
  * Prop
  *******************/
  /** 接收父组件传递的 `glcPath`，用于动态导入组件路径 */
  const props = defineProps({
    glcPath: String
  });
  
  /*******************
  * Data
  *******************/
  /** Golden Layout 的根 DOM 元素 */
  const GLRoot = ref(null);
  /** Golden Layout 实例 */
  let GLayout;
  /** 组件引用的前缀 */
  const GlcKeyPrefix = readonly(ref("glc_"));
  
  /** 映射 Golden Layout 容器与 Vue 组件实例的 Map */
  const MapComponents = new Map();
  
  /** 保存所有当前激活的组件 */
  const AllComponents = ref(new Map());
  /** 未使用的组件索引，用于复用 */
  const UnusedIndexes = [];
  /** 当前索引计数器 */
  let CurIndex = 0;
  /** Golden Layout 容器的边界矩形，用于计算布局 */
  let GlBoundingClientRect;
  
  /** 获取当前 Vue 实例 */
  const instance = getCurrentInstance();
  
  /*******************
  * Method
  *******************/
  /** @internal 
  * 添加组件到 AllComponents 中，并返回该组件的索引
  */
  const addComponent = (componentType, title) => {
    // 动态导入组件，并使用 markRaw 确保 Vue 不进行响应式处理
    const glc = markRaw(
      defineAsyncComponent(
        () => import(`${props.glcPath}${componentType}.vue`)
      )
    );
  
    // 从未使用索引中取出一个，或者使用新的索引
    let index = CurIndex;
    if (UnusedIndexes.length > 0) index = UnusedIndexes.pop();
    else CurIndex++;
  
    // 将组件添加到 AllComponents 中
    AllComponents.value.set(index, glc);
  
    return index;
  };
  
  /** 添加 Golden Layout 组件，并将其与 Vue 组件关联 */
  const addGLComponent = async (componentType, title) => {
    if (componentType.length === 0)
      throw new Error("addGLComponent: Component's type is empty");
  
    const index = addComponent(componentType, title);
  
    await nextTick(); // 等待 1 tick 以确保 Vue 已经添加 DOM
  
    GLayout.addComponent(componentType, { refId: index }, title);
  };
  
  /** 加载 Golden Layout 配置，并创建对应的 Vue 组件 */
  const loadGLLayout = async (layoutConfig) => {
    // 清空当前布局和组件
    GLayout.clear();
    AllComponents.value.clear();
  
    // 解析配置，如果是已解析的配置，需先转换
    const config = (
      layoutConfig.resolved
        ? LayoutConfig.fromResolved(layoutConfig)
        : layoutConfig
    );
  
    // 遍历布局配置中的所有内容，并添加组件
    let contents = [config.root.content];
    let index = 0;
    while (contents.length > 0) {
      const content = contents.shift();
      for (let itemConfig of content) {
        if (itemConfig.type === "component") {
          index = addComponent(itemConfig.componentType, itemConfig.title);
          if (typeof itemConfig.componentState === "object")
            itemConfig.componentState.refId = index;
          else itemConfig.componentState = { refId: index };
        } else if (itemConfig.content.length > 0) {
          contents.push(itemConfig.content);
        }
      }
    }
  
    await nextTick(); // 等待 1 tick 以确保 Vue 已经添加 DOM
  
    GLayout.loadLayout(config);
  };
  
  /** 获取当前的 Golden Layout 配置 */
  const getLayoutConfig = () => {
    return GLayout.saveLayout();
  };
  
  /*******************
  * Mount
  *******************/
  onMounted(() => {
    // 如果 GLRoot 未初始化，则抛出错误
    if (GLRoot.value == null)
      throw new Error("Golden Layout can't find the root DOM!");
  
    /** 当窗口大小变化时，调整布局大小 */
    const onResize = () => {
      const dom = GLRoot.value;
      let width = dom ? dom.offsetWidth : 0;
      let height = dom ? dom.offsetHeight : 0;
      GLayout.setSize(width, height);
    };
  
    window.addEventListener("resize", onResize, { passive: true });
  
    /** 在虚拟布局之前获取根容器的边界矩形 */
    const handleBeforeVirtualRectingEvent = (count) => {
      GlBoundingClientRect = GLRoot.value.getBoundingClientRect();
    };
  
    /** 处理容器的虚拟布局事件 */
    const handleContainerVirtualRectingRequiredEvent = (container, width, height) => {
      const component = MapComponents.get(container);
      if (!component || !component.glc) {
        throw new Error("handleContainerVirtualRectingRequiredEvent: Component not found");
      }
  
      // 计算容器相对于根容器的位置，并更新组件的位置和大小
      const containerBoundingClientRect = container.element.getBoundingClientRect();
      const left = containerBoundingClientRect.left - GlBoundingClientRect.left;
      const top = containerBoundingClientRect.top - GlBoundingClientRect.top;
      component.glc.setPosAndSize(left, top, width, height);
    };
  
    /** 处理容器的可见性变化事件 */
    const handleContainerVirtualVisibilityChangeRequiredEvent = (container, visible) => {
      const component = MapComponents.get(container);
      if (!component || !component.glc) {
        throw new Error("handleContainerVirtualVisibilityChangeRequiredEvent: Component not found");
      }
      component.glc.setVisibility(visible);
    };
  
    /** 处理容器的 z-index 变化事件 */
    const handleContainerVirtualZIndexChangeRequiredEvent = (container, logicalZIndex, defaultZIndex) => {
      const component = MapComponents.get(container);
      if (!component || !component.glc) {
        throw new Error("handleContainerVirtualZIndexChangeRequiredEvent: Component not found");
      }
  
      component.glc.setZIndex(defaultZIndex);
    };
  
    /** 绑定组件事件监听器 */
    const bindComponentEventListener = (container, itemConfig) => {
      let refId = -1;
      if (itemConfig && itemConfig.componentState) {
        refId = itemConfig.componentState.refId;
      } else {
        throw new Error("bindComponentEventListener: component's ref id is required");
      }
  
      // 根据 refId 获取组件的 Vue 实例
      const ref = GlcKeyPrefix.value + refId;
      const component = instance.refs[ref][0]; // 取数组的第一个元素
  
      // 将组件和容器绑定到 Map 中
      MapComponents.set(container, { refId: refId, glc: component });
  
      // 绑定容器的虚拟布局、可见性和 z-index 事件
      container.virtualRectingRequiredEvent = (container, width, height) =>
        handleContainerVirtualRectingRequiredEvent(container, width, height);
  
      container.virtualVisibilityChangeRequiredEvent = (container, visible) =>
        handleContainerVirtualVisibilityChangeRequiredEvent(container, visible);
  
      container.virtualZIndexChangeRequiredEvent = (container, logicalZIndex, defaultZIndex) =>
        handleContainerVirtualZIndexChangeRequiredEvent(container, logicalZIndex, defaultZIndex);
  
      return {
        component,
        virtual: true
      };
    };
  
    /** 解绑组件事件监听器 */
    const unbindComponentEventListener = (container) => {
      const component = MapComponents.get(container);
      if (!component || !component.glc) {
        throw new Error("handleUnbindComponentEvent: Component not found");
      }
  
      // 从 Map 中移除组件，并将索引加入未使用列表中
      MapComponents.delete(container);
      AllComponents.value.delete(component.refId);
      UnusedIndexes.push(component.refId);
    };
  
    // 初始化 Golden Layout 实例，并绑定相关事件
    GLayout = new VirtualLayout(
      GLRoot.value,
      bindComponentEventListener,
      unbindComponentEventListener
    );
  
    GLayout.beforeVirtualRectingEvent = handleBeforeVirtualRectingEvent;
  });
  
  /*******************
  * Expose
  *******************/
  /** 将方法暴露给父组件使用 */
  defineExpose({
    addGLComponent,
    loadGLLayout,
    getLayoutConfig
  });
  </script>
  