<template>
  <div class="full-height" style="display: flex;">
    <div id="nav" style="height: 100vh;width: 300px;border-right: #000 5px solid;">
      <div style="width: 20px; display: inline-block"></div>
      <el-button @click="onClickSaveLayout" size="small" style="background-color: black;border: none;">保存当前布局</el-button>
      <div style="width: 20px; display: inline-block" ></div>
      <el-button @click="onClickLoadLayout" size="small" style="background-color: black;border: none;">加载保存的布局</el-button>
      <div style="width: 20px; display: inline-block"></div>
      <!-- 动态生成组件列表 -->
      <el-tree style="max-width: 600px" :data="componentList" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
    <GoldenLayoutContainer ref="GLayoutRoot" glc-path="../../views/" style="width: calc(100% - 300px); height: 100%">
    </GoldenLayoutContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { prefinedLayouts } from "./layoutConfig.js";
import GoldenLayoutContainer from '@/components/GoldenLayoutContainer/index.vue';

const GLayoutRoot = ref<null | HTMLElement>(null);
const componentList = ref(prefinedLayouts.miniRow);
const defaultProps = {
  children: 'children',
  label: 'name',
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
  if (!data.children) {
    console.log(data.type)
    if (!GLayoutRoot.value) return;
    GLayoutRoot.value.addGLComponent(data.component, data.name);
  }
}

const onClickSaveLayout = () => {
  if (!GLayoutRoot.value) return;
  const config = GLayoutRoot.value.getLayoutConfig();
  localStorage.setItem("gl_config", JSON.stringify(config));
};

const onClickLoadLayout = () => {
  const str = localStorage.getItem("gl_config");
  if (!str) return;
  if (!GLayoutRoot.value) return;
  const config = JSON.parse(str as string);
  GLayoutRoot.value.loadGLLayout(config);
};


</script>

<style>
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.full-height,
#app {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  text-align: center;
}

.el-tree-node__content{
  background-color:#242424 !important;
}

.el-tree-node:focus>.el-tree-node__content {
    background-color: #111 !important;
}

.lm_header .lm_tab.lm_active.lm_focused{
  background-color: #2f4206 !important;
}

</style>

<style src="golden-layout/dist/css/goldenlayout-base.css"></style>
<style src="golden-layout/dist/css/themes/goldenlayout-dark-theme.css"></style>
