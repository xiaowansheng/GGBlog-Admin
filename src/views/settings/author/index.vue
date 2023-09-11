<script setup lang="ts">
import { ref } from "vue";
import Information from "./information.vue";
import Contact from "./contact.vue";

defineOptions({
  name: "Author"
});
const activeName = ref("info");
</script>

<template>
  <div class="author bkcolor">
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane label="作者信息" name="info">
        <Information />
      </el-tab-pane>
      <el-tab-pane label="社交方式" name="contact">
        <Contact />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
