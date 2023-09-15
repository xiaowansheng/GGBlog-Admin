<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { Config, ConfigDto, updateConfig, getAboutAuthor } from "@/api/config";
import { ElMessage } from "element-plus";
import CherryMarkdown from "@/components/editor/CherryMarkdown/index.vue"
defineOptions({
  name: "Comment"
});
onBeforeMount(() => {
  getData();
});
const editId=ref<number>(1)
const getData = () => {
  getAboutAuthor().then((data: any) => {
    about.id = data.id;
    about.name = data.name;
    about.label = data.label;
    about.value = data.value;
    about.description = data.description;
    editId.value=1
  }).catch(() => {
    editId.value=1
  })
};

const about = reactive<Config>({
  id: null,
  name: null,
  label: null,
  value: "",  
  description: null
});
const update = () => {
  updateConfig(null, { data: about }).then(() => {
    ElMessage.success("修改成功！");
  });
};
</script>

<template>
  <div class="about-author">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">关于作者</span>
          <!-- <el-button class="button" @click="getData()">刷新数据</el-button> -->
        </div>
      </template>
      <div class="content">
        <div class="btn">
          <el-button
            size="default"
            type="primary"
            @click="update()"
            >保存信息</el-button
          >
        </div>
        <div class="text">
          <CherryMarkdown v-if="editId==1" id="about-author" v-model:value="about.value"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin: 15px 0;
}
</style>
