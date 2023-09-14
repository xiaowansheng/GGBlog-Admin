<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { ErrorDto } from "@/api/errorLog";
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
  <el-dialog v-model="visiable" :title="'异常日志详情'" class="detail" style="">
    <el-descriptions
      v-if="visiable"
      :title="'异常：' + item.errorName"
      :column="1"
      border
    >
      <!-- <el-descriptions-item
        label="Username"
        label-align="left"
        align="center"
        label-class-name="my-label"
        class-name="my-content"
        width="150px"
        >kooriookami</el-descriptions-item
      > -->
      <el-descriptions-item
        label="记录 ID"
        label-align="center"
        align="center"
        >{{ item.id }}</el-descriptions-item
      >
      <el-descriptions-item
        label="用户编号"
        label-align="center"
        align="center"
        >{{ item.userAuthId }}</el-descriptions-item
      >
      <el-descriptions-item
        label="用户名称"
        label-align="center"
        align="center"
        >{{ item.userName }}</el-descriptions-item
      >
      <el-descriptions-item
        label="系统版本"
        label-align="center"
        align="center"
        >{{ item.version }}</el-descriptions-item
      >
      <el-descriptions-item
        label="请求地址"
        label-align="center"
        align="center"
        >{{ item.requestUrl }}</el-descriptions-item
      >
      <el-descriptions-item
        label="访问模块"
        label-align="center"
        align="center"
        >{{ item.module }}</el-descriptions-item
      >
      <el-descriptions-item
        label="调用方法"
        label-align="center"
        align="center"
      >
        <el-input
          resize="none"
          autosize
          :disabled="true"
          type="textarea"
          :value="item.callingMethod"
        />
      </el-descriptions-item>
      <el-descriptions-item
        label="错误名称"
        label-align="center"
        align="center"
      >
        <el-input
          resize="none"
          autosize
          :disabled="true"
          type="textarea"
          :value="item.errorName"
      /></el-descriptions-item>
      <el-descriptions-item
        label="错误信息"
        label-align="center"
        align="center"
      >
        <el-input
          resize="none"
          autosize
          :disabled="true"
          type="textarea"
          class="input"
          :value="item.errorMessage.replace(/<br\/>/g, '\n')"
      /></el-descriptions-item>

      <!-- <el-descriptions-item
        label="错误信息"
        label-align="center"
        align="left"
      >
      <div style="overflow-x: auto;" v-html="item.errorMessage" contenteditable="false">
      </div>
        </el-descriptions-item> -->
      <el-descriptions-item
        label="请求方法"
        label-align="center"
        align="center"
        >{{ item.requestMethod }}</el-descriptions-item
      >
      <el-descriptions-item
        label="请求参数"
        label-align="center"
        align="center"
      >
        <el-input
          autosize
          resize="none"
          :disabled="true"
          type="textarea"
          :value="JSON.stringify(JSON.parse(item.requestParam), null, '\t')"
      /></el-descriptions-item>
      <el-descriptions-item
        label="响应结果"
        label-align="center"
        align="center"
        >{{ item.responseData }}</el-descriptions-item
      >
      <el-descriptions-item label="耗时" label-align="center" align="center">{{
        item.elapsedTime
      }}</el-descriptions-item>
      <el-descriptions-item
        label="IP地址"
        label-align="center"
        align="center"
        >{{ item.ipAddress }}</el-descriptions-item
      >
      <el-descriptions-item
        label="IP来源"
        label-align="center"
        align="center"
        >{{ item.ipSource }}</el-descriptions-item
      >
      <el-descriptions-item
        label="设备名称"
        label-align="center"
        align="center"
        >{{ item.device }}</el-descriptions-item
      >
      <el-descriptions-item
        label="浏览器"
        label-align="center"
        align="center"
        >{{ item.browser }}</el-descriptions-item
      >
      <el-descriptions-item
        label="创建时间"
        label-align="center"
        align="center"
        >{{ item.createTime }}</el-descriptions-item
      >
      <!-- <el-descriptions-item label="Place" label-align="center" align="center"
        >Suzhou</el-descriptions-item
      >
      <el-descriptions-item label="Remarks" label-align="center" align="center">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Address" label-align="center" align="center"
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
