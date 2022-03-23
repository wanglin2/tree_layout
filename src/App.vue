<template>
  <div class="container">
    <el-radio-group v-model="type" style="margin-bottom: 10px">
      <el-radio-button label="思维导图" />
      <el-radio-button label="算法1" />
      <el-radio-button label="算法2" />
      <el-radio-button label="算法3" />
      <el-radio-button label="算法4" />
      <el-radio-button label="复刻版" />
      <el-radio-button label="原版" />
    </el-radio-group>
    <div class="drawBox" ref="drawBox"></div>
    
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { init } from "./render";
import useAlgorithm1 from "./algorithm1";
import useAlgorithm2 from "./algorithm2";
import useAlgorithm3 from "./algorithm3";
import useAlgorithm4 from "./algorithm4";
import useAlgorithm5 from "./algorithm5";
import useAlgorithm5Copy from "./algorithm5 copy";
import useMind from "./mind";
import { clear } from './render'

const drawBox = ref(null);
const type = ref('思维导图')
watch(type, () => {
  clear()
  switch (type.value) {
    case '思维导图':
      useMind();
      break;
    case '算法1':
      useAlgorithm1();
      break;
    case '算法2':
      useAlgorithm2();
      break;
    case '算法3':
      useAlgorithm3();
      break;
    case '算法4':
      useAlgorithm4();
      break;
    case '复刻版':
      useAlgorithm5();
      break;
    case '原版':
      useAlgorithm5Copy();
      break;
    default:
      break;
  }
})
onMounted(() => {
  init(drawBox);
  useMind();
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawBox {
  border: 1px solid #000;
  width: 800px;
  height: 800px;
}
</style>
