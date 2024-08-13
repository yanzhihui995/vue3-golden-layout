<!-- ECharts.vue -->
<template>
    <div ref="chartRef" :style="{ width: '100%', height: '300px' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useWindowSize } from '@vueuse/core';

const props = defineProps({
    options: {
        type: Object,
        required: true
    }
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(props.options);
};

const { width, height } = useWindowSize();

onMounted(() => {
    initChart();
});

watch([width, height], () => {
    if (chartInstance) {
        chartInstance.resize();
    }

});

watch(() => props.options,
    (newOptions) => {
        if (chartInstance) {
            console.log("asdasdas")
            chartInstance.setOption(newOptions);
            setTimeout(() => {
                chartInstance.resize();
            }, 100);

        }
    },
    { deep: true }
);

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose();
    }
});
</script>

<style scoped></style>