<script setup lang="ts">
import { MilkdownProvider } from "@milkdown/vue";

import Milkdown from "./MilkdownEditor.vue";
defineOptions({
  name: ""
});
</script>

<template>
  <MilkdownProvider>
    <Milkdown />
  </MilkdownProvider>
</template>

<style lang="scss" scoped></style>
