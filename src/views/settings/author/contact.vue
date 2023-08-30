<script setup lang="ts">
import { getContactConfig, updateConfig } from "@/api/config";
import { ConfigJson } from "../config";
import { onBeforeMount, ref } from "vue";
import { ElMessage } from "element-plus";
import AddModal from "./addModal.vue";
defineOptions({
  name: "AuthorContact"
});
export interface Contact {
  name: string;
  label: string;
  value: string;
  show: number;
}
onBeforeMount(() => {
  getData();
});
const config = ref<ConfigJson<Contact[]> | any>({
  // 防止没有数据时报错
  value:[]
});
const getData = () => {
  getContactConfig().then((data: any) => {
    data.value = JSON.parse(data.value);
    config.value = data;
  });
};
const open = ref<boolean>(false);
const updateData = (isAdd: boolean = false) => {
  const form: string = JSON.stringify(config.value);
  const newConfig: ConfigJson<any> = JSON.parse(form);
  newConfig.value = JSON.stringify(newConfig.value);
  updateConfig(null, { data: newConfig })
    .then(() => {
      open.value = false;
      getData()
      if (isAdd) {
        ElMessage.success("添加成功！");
      } else {
        ElMessage.success("修改成功！");
      }
      show.value=false
    })
    .catch(() => {
      if (isAdd) {
        config.value.pop();
      }
    });
};

const show = ref<boolean>(false);
const submitData = (item: Contact) => {
  config.value.value.push(item);
  updateData(true);
};
</script>

<template>
  <div class="contact content">
    <div class="operation">
      <el-button type="primary" class="button" @click="show=true">添加数据</el-button>
      <el-button class="button" @click="getData()">刷新数据</el-button>
    </div>
    <div class="information">
      <div class="config" v-for="item in config.value" :key="item.name">
        <label>{{ item.label }}:</label>
        <el-input :disabled="!open" v-model="item.value" size="large" />
        <el-switch
          class="swich"
          :disabled="!open"
          v-model="item.show"
          inline-prompt
          active-text="show"
          inactive-text="hidden"
          :active-value="1"
          :inactive-value="0"
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
    <add-modal v-model:show="show" @update-data="submitData" />
  </div>
</template>

<style lang="scss" scoped>
.information {
  padding: 0 10px;
  .swich {
    margin-left: 10px;
  }
}
.operation {
  margin: 0 25px 15px;
  text-align: right;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
