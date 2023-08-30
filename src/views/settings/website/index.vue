<script setup lang="ts">
import { getWebsiteConfig, updateConfig } from "@/api/config";
import { ElMessage } from "element-plus";
import { onBeforeMount, ref } from "vue";
import { ConfigJson } from "../config";
defineOptions({
  name: "WebsiteInformation"
});
export interface Info {
  title: string;
  icon: string;
  homeTitle: string;
  website: string;
  introduction: string;
  createTime: string;
  recordNumber: string;
  notice: string;
}
onBeforeMount(() => {
  getData();
});
const config = ref<ConfigJson<Info> | any>({
  // 防止没有数据时报错
  value: {}
});
const getData = () => {
  getWebsiteConfig().then((data: any) => {
    data.value = JSON.parse(data.value);
    config.value = data;
  });
};
const open = ref<boolean>(false);
const updateData = () => {
  const form:string = JSON.stringify(config.value)
  const newConfig:ConfigJson<any> = JSON.parse(form)
  newConfig.value=JSON.stringify(newConfig.value)
  updateConfig(null, { data: newConfig }).then(() => {
    open.value=false
    ElMessage.success("修改成功！")
  })
}
</script>

<template>
  <div class="website">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">网站信息</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="information">
          <div class="config">
            <label>网站标题:</label>
            <el-input
              :disabled="!open"
              v-model="config.value.title"
              placeholder="输入网站标题~"
              size="large"
            />
          </div>
          <div class="config">
            <label>图标地址:</label>
            <el-input
              :disabled="!open"
              v-model="config.value.icon"
              placeholder="输入网站图标地址~"
              size="large"
            />
          </div>
          <div class="config">
            <label>网站链接:</label>
            <el-input
              :disabled="!open"
              v-model="config.value.website"
              placeholder="输入网站链接~"
              size="large"
            />
          </div>
          <div class="config">
            <label>网站介绍:</label>
            <el-input
              :disabled="!open"
              :autosize="{ minRows: 2, maxRows: 3 }"
              type="textarea"
              v-model="config.value.introduction"
              placeholder="输入网站介绍~"
              size="large"
            />
          </div>
          <div class="config">
            <label>主页标题:</label>
            <el-input
              :disabled="!open"
              v-model="config.value.homeTitle"
              placeholder="输入主页标题~"
              size="large"
            />
          </div>
          <div class="config">
            <label>创建时间:</label>
            <!-- <el-input
              v-model="config.value.createTime"
              placeholder=""
            /> -->
            <el-date-picker
              :disabled="!open"
              v-model="config.value.createTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm"
              placeholder="输入网站创建时间~"
              size="large"
            />
          </div>
          <div class="config">
            <label>备案信息:</label>
            <el-input
              :disabled="!open"
              v-model="config.value.recordNumber"
              placeholder="输入网站备案号~"
              size="large"
            />
          </div>
          <div class="config">
            <label>网站通知:</label>
            <el-input
              :disabled="!open"
              :autosize="{ minRows: 2, maxRows: 99 }"
              type="textarea"
              v-model="config.value.notice"
              placeholder="输入网站通知信息~"
              size="large"
            />
          </div>
        </div>
        <div class="update">
          <el-button type="warning" @click="open = !open">{{
            open ? "关闭修改" : "开启修改"
          }}</el-button>
          <el-button type="primary" :disabled="!open" @click="updateData()">提交修改</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
