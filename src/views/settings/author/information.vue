<script setup lang="ts">
import { getAuthorConfig, updateConfig } from "@/api/config";
import { ConfigJson } from "../config";
import { onBeforeMount, ref } from "vue";
import SinglePictureUpload from "@/components/upload/SinglePicture/index.vue";
import { ElMessage } from "element-plus";
import { Author } from "./Author";
defineOptions({
  name: "AuthorInformation"
});

onBeforeMount(() => {
  getData();
});
const config = ref<ConfigJson<Author> | any>({
  // 防止没有数据时报错
  value: {}
});
const getData = () => {
  getAuthorConfig().then((data: any) => {
    data.value = JSON.parse(data.value);
    config.value = data;

    // uploadRef.value.setUrl(data.value.avatar)
  });
};
const open = ref<boolean>(false);
const updateData = () => {
  const form: string = JSON.stringify(config.value);
  const newConfig: ConfigJson<any> = JSON.parse(form);
  newConfig.value = JSON.stringify(newConfig.value);
  updateConfig(null, { data: newConfig }).then(() => {
    open.value = false;
    ElMessage.success("修改成功！");
  });
};
const uploadRef = ref();
</script>

<template>
  <div class="author content">
    <div class="operation">
      <el-button class="button" @click="getData()">刷新数据</el-button>
    </div>
    <div class="information">
      <div class="config">
        <label>作者昵称:</label>
        <el-input
          :disabled="!open"
          v-model="config.value.nickname"
          placeholder="输入昵称~"
          size="large"
        />
      </div>
      <div class="config">
        <label>头像地址:</label>
        <!-- <el-input
              :disabled="!open"
              v-model="config.value.avatar"
              placeholder="输入头像地址~"
              size="large"
            /> -->
        <single-picture-upload
          ref="uploadRef"
          v-model:value="config.value.avatar"
          :dir="'avatar'"
          :width="'150px'"
          :height="'150px'"
          :disable="!open"
        />
      </div>
      <div class="config">
        <label>作者介绍:</label>
        <el-input
          :disabled="!open"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          v-model="config.value.introduction"
          placeholder="输入作者介绍~"
          size="large"
        />
      </div>
    </div>
    <div class="update">
      <el-button type="warning" @click="open = !open">{{
        open ? "关闭修改" : "开启修改"
      }}</el-button>
      <el-button type="primary" :disabled="!open" @click="updateData()"
        >提交修改</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.operation {
  margin-right: 25px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
