<script setup lang='ts'>
// import Account from './Account.vue';
import Information from './Information.vue';
import UpdatePassword from './UpdatePassword.vue';

defineOptions({
  name: ''
})
</script>

<template>
  <div class="person-center">
      <el-tabs :tab-position="'top'" style="height: 200px" class="demo-tabs">
      <el-tab-pane label="个人信息">
        <Information/>
      </el-tab-pane>
      <!-- TODO 暂不展示个人账户信息页 -->
      <!-- <el-tab-pane label="账号信息">
        <Account/>
      </el-tab-pane> -->
      <el-tab-pane label="修改密码">
        <UpdatePassword/>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<style lang='scss' scoped>

</style>
