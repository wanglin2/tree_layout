<template>
  <div class="container">
    <div class="drawBox" ref="drawBox"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { init } from "./render";
import useAlgorithm1 from "./algorithm1";
import useAlgorithm2 from "./algorithm2";
import useAlgorithm3 from "./algorithm3";
import useAlgorithm4 from "./algorithm4";

const drawBox = ref(null);
onMounted(() => {
  init(drawBox);
  // useAlgorithm1();
  // useAlgorithm2();
  useAlgorithm3();
  // useAlgorithm4();
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
  justify-content: center;
  align-items: center;
}

.drawBox {
  border: 1px solid #000;
  width: 800px;
  height: 800px;
}
</style>
