<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import {
  Article,
  addArticle,
  updateArticle,
  addArticleDraft,
  getArticleById
} from "@/api/article";
import { NameLabelDto, getContentStatus } from "@/api/common";
import { ElMessage } from "element-plus";
// import Markdown from "@/components/editor/Markdown/index.vue";
import CherryMarkdown from "@/components/editor/CherryMarkdown/index.vue";
import { useDetail } from "@/hooks/routerUtils";
const { initToDetail, getParameter, closeToPage } = useDetail();
defineOptions({
  name: "ArticlePublish"
});
onBeforeMount(() => {
  if (getParameter?.id) {
    initToDetail();
    articleForm.id = Number.parseInt(getParameter.id.toString());
    console.log("talk-id：", articleForm.id);
    getData(articleForm.id);
  }
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
    if (data && data.length && !getParameter.id) {
      articleForm.status = data[0].name;
    }
  });
});
const getData = (id: number | string) => {
  if (id) {
    getArticleById(id.toString()).then((data: any) => {
      articleForm.content = data.content;
      articleForm.title = data.title;
      articleForm.cover = data.cover;
      articleForm.type = data.type;
      articleForm.originalAuthor = data.originalAuthor;
      articleForm.originalTitle = data.originalTitle;
      articleForm.originalUrl = data.originalUrl;
      articleForm.note = data.note;
      articleForm.top = data.top;
      articleForm.status = data.status;
      articleForm.categoryVo.id = data.categoryVo.id;
      articleForm.categoryVo.name = data.categoryVo.name;
      data.tagDtos?.foreach(tag => {
        articleForm.tagVos.push({
          id: tag.id,
          name: tag.name
        });
      });
    });
  }
};
const contentStatus = ref<NameLabelDto[]>([]);
const articleForm = reactive<Article>({
  id: null,
  title: "",
  cover: "",
  content: "",
  type: "",
  originalAuthor: "",
  originalTitle: "",
  originalUrl: "",
  note: "",
  top: 0,
  status: "",
  categoryVo: {
    id: null,
    name: ""
  },
  tagVos: []
});
const submit = (isDraft: boolean = false) => {
  if (articleForm.title) {
    ElMessage.warning("文章标题不能为空哦~");
    return;
  }
  if (articleForm.content) {
    ElMessage.warning("文章内容不能为空哦，请输入内容后再发布~");
    return;
  }
  if (isDraft) {
    addArticleDraft(articleForm).then((data: any) => {
      if (!articleForm.id) {
        // 如果是保存新的草稿，则记录id，下次再保存就是修改
        articleForm.id = data;
      }
      ElMessage.success("草稿保存成功！");
    });
  } else {
    if (articleForm.id) {
      updateArticle(articleForm).then(() => {
        ElMessage.success("修改成功！");
        closeToPage("ArticleList");
      });
    } else {
      addArticle(articleForm).then(() => {
        ElMessage.success("发布成功！");
        closeToPage("ArticleList");
      });
    }
  }
};
</script>

<template>
  <div class="talk-publish">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">{{
            articleForm.id ? "编辑博客" : "发布博客"
          }}</span>
          <!-- <el-button class="button">刷新数据</el-button> -->
        </div>
      </template>
      <div class="content">
        <div class="operation">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题~">
            <template #append>
              <el-button class="submit">发布</el-button>
            </template>
          </el-input>
          <!-- <el-input v-model="" placeholder="" />
 -->
        </div>
        <div class="text">
          <!-- <Markdown v-model:value="articleForm.content" /> -->
          <cherry-markdown v-model:value="articleForm.content" :height="576"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.operation {
  .el-input{
    font-size: 16px;
    height: 40px;
  }
  .submit{
    font-size: 18px;
    padding: 0 15px;
  }
}
</style>
