<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { Talk, addTalk, updateTalk, getTalkById } from "@/api/talk";
import { NameLabelDto, getContentStatus } from "@/api/common";
import PicturesUpload from "@/components/upload/Pictures/index.vue";
import { ElMessage } from "element-plus";
import { useDetail } from "@/hooks/routerUtils";
const { initToDetail, getParameter, closeToPage } = useDetail();
defineOptions({
  name: "TalkPublish"
});
onBeforeMount(() => {
  if (getParameter?.id) {
    initToDetail();
    talkForm.id = Number.parseInt(getParameter.id.toString());
    // console.log("talk-id：", talkForm.id);
    getData(talkForm.id);
  }
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
    if (data && data.length && !getParameter.id) {
      talkForm.status = data[0].name;
    }
  });
});
const getData = (id: number) => {
  if (id) {
    getTalkById(id).then((data: any) => {
      talkForm.content = data.content;
      try {
        talkForm.images = JSON.parse(data.images);
      } catch (e) {}
      talkForm.status = data.status;
      talkForm.top = data.top;
    });
  }
};
const contentStatus = ref<NameLabelDto[]>([]);
const talkForm = reactive<Talk>({
  id: null,
  content: "",
  images: [],
  status: "",
  top: 0
});
const submit = () => {
  const newTalkStr = JSON.stringify(talkForm);
  const newTalk = JSON.parse(newTalkStr);
  newTalk.images = JSON.stringify(newTalk.images);

  if (!talkForm.content && !talkForm.images && talkForm.images.length == 0) {
    ElMessage.warning("内容不能为空哦，请输入内容后再发布~");
    return;
  }
  if (talkForm.id) {
    updateTalk(null, { data: newTalk }).then(() => {
      ElMessage.success("修改成功！");
      closeToPage("TalkList");
    });
  } else {
    addTalk(null, { data: newTalk }).then(() => {
      ElMessage.success("发布成功！");
      closeToPage("TalkList");
    });
  }
};
</script>

<template>
  <div class="talk-publish">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">{{ talkForm.id ? "编辑说说" : "发布说说" }}</span>
          <!-- <el-button class="button">刷新数据</el-button> -->
        </div>
      </template>
      <div class="content">
        <div class="text">
          <el-input
            v-model="talkForm.content"
            :rows="8"
            type="textarea"
            placeholder="记录下今天的状态和心情~~~"
          />
        </div>
        <div class="operation">
          <div class="left">表情 图片</div>
          <div class="form">
            <div class="op">
              <el-select
                v-model="talkForm.status"
                placeholder="状态"
                size="large"
              >
                <el-option
                  v-for="item in contentStatus"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                />
              </el-select>
            </div>
            <div class="op">
              <el-switch
                v-model="talkForm.top"
                active-text="已置顶"
                inactive-text="不置顶"
                :active-value="1"
                :inactive-value="0"
                inline-prompt
                size="large"
              />
            </div>
            <div class="op">
              <el-button type="primary" @click="submit()" size="large"
                >发布</el-button
              >
            </div>
          </div>
        </div>
        <div class="upload">
          <pictures-upload v-model="talkForm.images" dir="talk" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.operation {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .form {
    display: flex;
    flex-wrap: wrap;
    text-align: right;
    .op:not(:first-of-type) {
      margin-left: 15px;
    }
  }
}
.upload {
  margin-top: 15px;
  padding: 5px;
}
</style>
