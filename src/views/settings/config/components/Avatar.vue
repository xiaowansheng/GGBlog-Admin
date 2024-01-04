<script setup lang="ts">
import { getAvatarConfig, updateConfig } from "@/api/config";
import { ConfigJson } from "../../config";
import { onBeforeMount, ref } from "vue";
import { ElMessage } from "element-plus";
import SinglePictureUpload from '@/components/upload/SinglePicture/index.vue'
defineOptions({
  name: "Avatar"
});
export interface Contact {
  name: string;
  label: string;
  show: number;
}
onBeforeMount(() => {
  getData();
});
const config = ref<ConfigJson<Contact[]> | any>({
  // 防止没有数据时报错
  value: []
});
const getData = () => {
  getAvatarConfig().then((data: any) => {
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
      getData();
      ElMessage.success("修改成功！");
      show.value = false;
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
  <div class="avatar content">
    <div class="operation">
      <el-button class="button" @click="getData()">刷新数据</el-button>
    </div>
    <div class="information">
      <div class="part" v-for="item in config.value" :key="item.name">
        <label>{{ item.label }}（{{item.name}}）:</label>
        <!-- <el-input :disabled="!open" v-model="item.label" size="large" /> -->
        <SinglePictureUpload class="upload" :dir="'avatar'" v-model:value="item.url" :disable="!open" :height="'150px'" :width="'150px'"/>
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
.information {
  display: flex;
  flex-wrap: wrap !important;
  flex-flow: row;
  gap:15px;
  padding: 25px 10px;
  .part{
    // width: 180px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin: 10px;
    padding: 8px 15px;
    border: 3px rgb(176, 220, 241) solid;
    border-radius: 15px;
  .swich {
    margin-left: 10px;
  }
  }
}
.operation {
  margin: 0 25px 15px;
  text-align: right;
}
</style>
