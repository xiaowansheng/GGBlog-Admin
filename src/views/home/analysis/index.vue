<script setup lang="ts">
import { onBeforeMount } from "vue";
import OverView from "./Overview.vue";
import ArticleStatistics from "./ArticleStatistics.vue";
import CategoryAndTagStatistics from "./CategoryAndTagStatistics.vue";
defineOptions({
  name: "Analysis"
});
onBeforeMount(() => {});
</script>

<template>
  <div class="analysis">
    <OverView />
    <ArticleStatistics />
    <CategoryAndTagStatistics />
  </div>
</template>

<style lang="scss" scoped></style>
