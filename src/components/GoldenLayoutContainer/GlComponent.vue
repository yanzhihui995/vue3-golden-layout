<template>
    <!-- 组件的根元素，设置为绝对定位以便动态调整位置和大小 -->
    <div ref="GLComponent" style="position: absolute; overflow: hidden">
        <!-- 插槽，用于插入组件的内容 -->
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

// 创建对根 DOM 元素的引用
const GLComponent = ref(null);

/**
 * 将数值转换为带有像素单位的字符串
 * @param {number} value - 数值
 * @returns {string} 带有像素单位的字符串
 */
const numberToPixels = (value) => {
    return value.toString(10) + "px";
};

/**
 * 设置组件的位置和大小
 * @param {number} left - 左边距
 * @param {number} top - 上边距
 * @param {number} width - 宽度
 * @param {number} height - 高度
 */
const setPosAndSize = (left, top, width, height) => {
    if (GLComponent.value) {
        const el = GLComponent.value;
        el.style.left = numberToPixels(left);
        el.style.top = numberToPixels(top);
        el.style.width = numberToPixels(width);
        el.style.height = numberToPixels(height);
    }
};

/**
 * 设置组件的可见性
 * @param {boolean} visible - 组件是否可见
 */
const setVisibility = (visible) => {
    if (GLComponent.value) {
        const el = GLComponent.value;
        if (visible) {
            el.style.display = ""; // 使组件可见
        } else {
            el.style.display = "none"; // 隐藏组件
        }
    }
};

/**
 * 设置组件的 z-index
 * @param {string} value - z-index 值
 */
const setZIndex = (value) => {
    if (GLComponent.value) {
        const el = GLComponent.value;
        el.style.zIndex = value;
    }
};

// 暴露方法，以便其他组件可以调用
defineExpose({
    setPosAndSize,
    setVisibility,
    setZIndex,
});
</script>
