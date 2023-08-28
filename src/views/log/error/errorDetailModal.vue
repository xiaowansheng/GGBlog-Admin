<script setup lang="ts">
import {  ref, toRefs, watch } from "vue";
import { OperationDto } from "@/api/errorLog";
defineOptions({
  name: "ErrorDetailModal"
});
const emits = defineEmits(["update:show"]);
const props = defineProps({
  show: Boolean,
  item: null
});

const { show, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
</script>

<template>
  <el-dialog v-model="visiable" :title="'操作日志详情'" class="detail" style="">
    <el-descriptions :title="item.type" :column="1" border>
      <!-- <el-descriptions-item
        label="Username"
        label-align="left"
        align="center"
        label-class-name="my-label"
        class-name="my-content"
        width="150px"
        >kooriookami</el-descriptions-item
      > -->
      <el-descriptions-item label="ID" label-align="right" align="center">{{
        item.id
      }}</el-descriptions-item>
      <el-descriptions-item
        label="用户编号"
        label-align="right"
        align="center"
        >{{ item.userAuthId }}</el-descriptions-item
      >
      <el-descriptions-item
        label="用户名称"
        label-align="right"
        align="center"
        >{{ item.userName }}</el-descriptions-item
      >
      <el-descriptions-item
        label="系统版本"
        label-align="right"
        align="center"
        >{{ item.version }}</el-descriptions-item
      >
      <el-descriptions-item
        label="请求地址"
        label-align="right"
        align="center"
        >{{ item.requestUrl }}</el-descriptions-item
      >
      <el-descriptions-item
        label="访问模块"
        label-align="right"
        align="center"
        >{{ item.module }}</el-descriptions-item
      >
      <el-descriptions-item
        label="调用方法"
        label-align="right"
        align="center"
        >{{ item.callingMethod }}</el-descriptions-item
      >
      <el-descriptions-item
        label="操作类型"
        label-align="right"
        align="center"
        >{{ item.type }}</el-descriptions-item
      >
      <el-descriptions-item
        label="操作描述"
        label-align="right"
        align="center"
        >{{ item.description }}</el-descriptions-item
      >
      <el-descriptions-item
        label="请求方法"
        label-align="right"
        align="center"
        >{{ item.requestMethod }}</el-descriptions-item
      >
      <el-descriptions-item
        label="请求参数"
        label-align="right"
        align="center"
        >{{ item.requestParam }}</el-descriptions-item
      >
      <el-descriptions-item
        label="响应结果"
        label-align="right"
        align="center"
        >{{ item.responseData }}</el-descriptions-item
      >
      <el-descriptions-item label="耗时" label-align="right" align="center">{{
        item.elapsedTime
      }}</el-descriptions-item>
      <el-descriptions-item label="IP地址" label-align="right" align="center">{{
        item.ipAddress
      }}</el-descriptions-item>
      <el-descriptions-item label="IP来源" label-align="right" align="center">{{
        item.ipSource
      }}</el-descriptions-item>
      <el-descriptions-item
        label="设备名称"
        label-align="right"
        align="center"
        >{{ item.device }}</el-descriptions-item
      >
      <el-descriptions-item label="浏览器" label-align="right" align="center">{{
        item.browser
      }}</el-descriptions-item>
      <el-descriptions-item
        label="创建时间"
        label-align="right"
        align="center"
        >{{ item.createTime }}</el-descriptions-item
      >
      <!-- <el-descriptions-item label="Place" label-align="right" align="center"
        >Suzhou</el-descriptions-item
      >
      <el-descriptions-item label="Remarks" label-align="right" align="center">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Address" label-align="right" align="center"
        >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
        Province</el-descriptions-item
      > -->
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
