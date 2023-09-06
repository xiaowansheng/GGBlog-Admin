<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import {
  ArticleDto,
  getArticlePage,
  deleteArticle,
  getAllArticleType,
  updateArticleTop
} from "@/api/article";
import { getAllCategory } from "@/api/category";
import { getAllTag } from "@/api/tag";
import { getContentStatus } from "@/api/common";
import EditModal from "./EditModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { useDetail } from "@/hooks/routerUtils";
const { router } = useDetail();
defineOptions({
  name: "ArticleList"
});
onBeforeMount(() => {
  getAllCategory().then((data: any) => {
    categorys.value = data;
  });
  getAllTag().then((data: any) => {
    tags.value = data;
  });
  getAllArticleType().then((data: any) => {
    articleTypes.value = data;
  });
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
  });
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getArticlePage(tempParams).then((data: any) => {
    list.value = data.list;
    total.value = data.total;
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 10
};
const queryParams = reactive({
  id: null,
  userAuthId: "",
  categoryId: null,
  tagId: null,
  title: "",
  type: null,
  note: "",
  top: null,
  status: null
  // beginDate: null,
  // endDate: null
});
const categorys = ref<any[]>([]);
const tags = ref<any[]>([]);
const articleTypes = ref<any[]>([]);
const contentStatus = ref<any[]>([]);
const list = ref<ArticleDto[]>([]);
const findType = (name: string) => {
  for (let i = 0; i < articleTypes.value.length; i++) {
    if (articleTypes.value[i].name == name) {
      return articleTypes.value[i].label;
    }
  }
  return name;
};
const findStatus = (name: string) => {
  for (let i = 0; i < contentStatus.value.length; i++) {
    if (contentStatus.value[i].name == name) {
      return contentStatus.value[i].label;
    }
  }
  return name;
};

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<ArticleDto>();
const show = (item: ArticleDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
const updateStatus = (item: ArticleDto) => {
  const form = {
    id: item.id,
    status: item.top
  };
  updateArticleTop(form)
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.top = item.top == 1 ? 0 : 1;
    });
};
const deleteR = (item: ArticleDto) => {
  ElMessageBox.confirm(`是否确认删除文章【${item.title}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteArticle(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="friend">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">文章列表</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>文章ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入文章ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>标题:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.title"
              placeholder="输入文章标题"
              size="default"
            />
          </div>
          <div class="op">
            <label>分类:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.categoryId"
              placeholder="选择文章类型"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="op">
            <label>标签:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.tagId"
              placeholder="选择标签类型"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="op">
            <label>文章类型:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.type"
              placeholder="选择文章类型"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in articleTypes"
                :key="item.name"
                :label="item.label + '（' + item.name + '）'"
                :value="item.name"
              />
            </el-select>
          </div>
          <div class="op">
            <label>文章状态:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.status"
              placeholder="选择文章状态"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in contentStatus"
                :key="item.name"
                :label="item.label + '（' + item.name + '）'"
                :value="item.name"
              />
            </el-select>
          </div>
          <div class="op">
            <label>是否置顶:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.top"
              placeholder="选择置顶状态"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="置顶" :value="1" />
              <el-option label="不置顶" :value="0" />
            </el-select>
          </div>
        </div>
        <!-- <div class="btn">
          <el-button size="default" type="primary" @click="show()"
            >添加</el-button
          >
        </div> -->
        <el-table border :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <el-table-column
            prop="title"
            :align="'center'"
            label="标题"
            width="150"
          />

          <el-table-column :align="'center'" label="封面" width="180">
            <template #default="{ row }">
              <!-- <el-avatar
                shape="square"
                :size="50"
                :fit="'cover'"
                :src="row.cover"
              /> -->
              <el-image
                style="width: 160px; height: 90px"
                :src="row.cover"
                :fit="'cover'"
                :hide-on-click-modal="true"
                :preview-teleported="true"
                :preview-src-list="[row.cover]"
              />
            </template>
          </el-table-column>

          <el-table-column :align="'center'" label="分类" width="100">
            <template #default="{ row }">
              <el-tag>{{ row.categoryDto?.name }}</el-tag>
            </template></el-table-column
          >
          <el-table-column :align="'center'" label="标签" width="180">
            <template #default="{ row }">
              <span v-if="row.tagDtos">
                <el-tag v-for="item in row.tagDtos" :key="item.id">{{
                  item.name
                }}</el-tag>
              </span>
            </template></el-table-column
          >
          <el-table-column :align="'center'" label="文章类型" width="110">
            <template #default="{ row }">
              {{ findType(row.type) }}
            </template></el-table-column
          >
          <el-table-column :align="'center'" label="文章状态" width="110">
            <template #default="{ row }">
              {{ findStatus(row.status) }}
            </template></el-table-column
          >
          <el-table-column :align="'center'" label="是否置顶" width="90">
            <template #default="{ row }">
              <el-switch
                v-model="row.top"
                @click="updateStatus(row)"
                :active-value="1"
                :inactive-value="0"
              /> </template
          ></el-table-column>
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="160"
          />
          <el-table-column :align="'center'" label="操作" width="250">
            <template #default="{ row }">
              <el-button size="default" type="primary" @click="show(row)"
                >修改</el-button
              >
              <el-button
                size="default"
                type="primary"
                @click="
                  router.push({ name: 'ArticleEdit', params: { id: row.id } })
                "
                >编辑</el-button
              >
              <el-button size="default" type="danger" @click="deleteR(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :hide-on-single-page="false"
          background
          v-model:current-page="params.page"
          v-model:page-size="params.limit"
          @update:current-page="getData()"
          @update:page-size="getData()"
          layout="total,prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[10, 15, 20, 30, 50]"
        />
      </div>
    </el-card>
    <edit-modal
      ref="modifyRef"
      v-model:show="showDialog"
      :item="selected"
      @refresh="getData()"
      :contentStatus="contentStatus"
      :articleTypes="articleTypes"
    />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin: 15px 0;
}
</style>
