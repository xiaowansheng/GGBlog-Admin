<script setup lang="ts">
import { ref } from "vue";
import ThirdPartLogin from "./components/ThirdPartLogin.vue";
import SystemModule from './components/SystemModule.vue'
import Primacy from "./components/Primacy.vue";
import Notice from "./components/Notice.vue";
import Avatar from "./components/Avatar.vue";
import Reward from './components/Reward.vue'
defineOptions({
  name: "Config"
});
const activeName = ref("third");
</script>

<template>
  <div class="author">
    <el-tabs v-model="activeName" type="card" class="tabs">
      <el-tab-pane label="第三方登录" name="third">
        <third-part-login/>
      </el-tab-pane>
      <el-tab-pane label="系统模块" name="module">
        <system-module/>
      </el-tab-pane>
      <el-tab-pane label="隐私和安全" name="privacy">
        <primacy />
      </el-tab-pane>
      <el-tab-pane label="系统通知" name="notice">
        <notice/>
      </el-tab-pane>
      <el-tab-pane label="默认图片" name="avatar">
        <avatar/>
      </el-tab-pane>
      <el-tab-pane label="打赏配置" name="reward">
        <reward/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
</style>
