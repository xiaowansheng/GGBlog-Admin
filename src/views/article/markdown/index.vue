<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { Article, addArticleDraft, getArticleById } from "@/api/article";
import { NameLabelDto, getContentStatus } from "@/api/common";
import { ElMessage } from "element-plus";
import AddAndEditModal from "./AddAndEditModal.vue";
import Vditor from "@/components/editor/Markdown/index.vue";
import CherryMarkdown from "@/components/editor/CherryMarkdown/index.vue";
import WangEditor from "@/components/editor/WangEditor/index.vue";
// import TuiEditor from "@/components/editor/TuiEditor/index.vue";
import { useDetail } from "@/hooks/routerUtils";
const { initToDetail, getParameter, closeToPage } = useDetail();
import { formatDate } from "@/utils/myUtils";
defineOptions({
  name: "ArticlePublish"
});
const editorId = ref<number>(0);
onBeforeMount(() => {
  if (getParameter?.id) {
    articleForm.id = Number.parseInt(getParameter.id.toString());
    console.log("talk-id：", articleForm.id);
    getData(articleForm.id);
  } else {
    editorId.value = 1;
  }
});
const getData = (id: number | string) => {
  if (id) {
    getArticleById(id.toString())
      .then((data: any) => {
        let tagTitle = data?.title;
        if (data?.title?.length > 8) {
          tagTitle = data.title.slice(0, 8) + "...";
        } else if (data?.title?.length <= 8) {
          tagTitle = data.title.slice(0, 8);
        } else {
          tagTitle = null;
        }
        initToDetail(tagTitle);
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
        articleForm.categoryVo.id = data.categoryDto?.id;
        articleForm.categoryVo.name = data.categoryDto?.name;
        console.log("data.tagDtos", data.tagDtos);
        const tagArr: [] = data.tagDtos ?? [];
        for (let i = 0; i < tagArr.length; i++) {
          const tag: any = tagArr[i];
          articleForm.tagVos.push({
            id: tag.id,
            name: tag.name
          });
          console.log("tagDtos", tag);
        }

        editorId.value = 1;
      })
      .catch(() => {
        initToDetail();

        editorId.value = 1;
      });
  }
};
const articleForm = reactive<Article>({
  id: null,
  title: formatDate(new Date()),
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
const check = (): boolean => {
  if (!articleForm.title) {
    ElMessage.warning("文章标题不能为空哦~");
    return false;
  }
  if (!articleForm.content) {
    ElMessage.warning("文章内容不能为空哦，请输入内容后再发布~");
    return false;
  }
  return true;
};
const saveDraft = () => {
  if (check) {
    addArticleDraft(articleForm).then((data: any) => {
      if (!articleForm.id) {
        // 如果是保存新的草稿，则记录id，下次再保存就是修改
        articleForm.id = data.id;
      }
      ElMessage.success("草稿保存成功！");
    });
  }
};
const show = ref<boolean>(false);
const showModal = () => {
  if (check()) {
    show.value = true;
  }
};

const close = () => {
  closeToPage("ArticleList");
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
          <div class="btn">
            <div class="left">
              <el-button type="primary" @click="saveDraft()"
                >保存草稿</el-button
              >
            </div>
            <div class="right">
              <el-select
                :width="100"
                v-model="editorId"
                placeholder="选择编辑器"
              >
                <el-option label="CherryMarkdown" :value="1" />
                <el-option label="VditorMarkdown" :value="2" />
                <el-option label="WangEditor" :value="3" />
                <!-- <el-option label="TuiEditor" :value="4" /> -->
              </el-select>
            </div>
          </div>
          <div class="submit">
            <el-input v-model="articleForm.title" placeholder="请输入文章标题~">
              <template> </template>
            </el-input>
            <el-button type="primary" class="submitBtn" @click="showModal()"
              >发布</el-button
            >
            <!-- <el-input v-model="" placeholder="" />
 -->
          </div>
        </div>
        <div class="text">
          <cherry-markdown
            v-if="editorId == 1"
            :id="`markdown${getParameter?.id}`"
            v-model:value="articleForm.content"
            :height="520"
          />
          <vditor v-if="editorId == 2" v-model:value="articleForm.content" />
          <wang-editor v-if="editorId == 3" v-model:value="articleForm.content" />
          <!-- <tui-editor v-if="editorId == 4" v-model:value="articleForm.content" /> -->
        </div>
      </div>
    </el-card>
    <add-and-edit-modal
      v-model:show="show"
      :item="articleForm"
      @close="close"
    />
  </div>
</template>

<style lang="scss" scoped>
.operation {
  .btn {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: center;
  }
  .submit {
    display: flex;
    flex-wrap: nowrap;
    $height: 40px;
    .el-input {
      font-size: 16px;
      height: $height;
    }
    .submitBtn {
      height: $height;
      width: 80px;
      font-size: 18px;
    }
  }
}
</style>
