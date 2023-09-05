<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import {
  CategoryDto,
  getCategoryPage,
  updateCategoryStatus,
  deleteCategory
} from "@/api/category";

import AddAndEditModal from "./AddAndEditModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "Category"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getCategoryPage(tempParams).then((data: any) => {
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
  userAuthId:"",
  name: "",
  hidden:null
});
const roles=ref<any>([])
const loginTypes = ref<any[]>([]);
const list = ref<CategoryDto[]>([]);
const findType = (name: string) => {
  for (let i = 0; i < loginTypes.value.length; i++) {
    if (loginTypes.value[i].name == name) {
      return loginTypes.value[i].label;
    }
  }
  return name;
};

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<CategoryDto>();
const show = (item: CategoryDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
const updateStatus = (item: CategoryDto) => {
  const form = {
    id: item.id,
    status: item.hidden
  };
  updateCategoryStatus(form)
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.hidden = item.hidden == 1 ? 0 : 1;
    });
};
const deleteR = (item: CategoryDto) => {
  ElMessageBox.confirm(`是否确认删除分类【${item.name}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCategory(item.id).then(() => {
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
          <span class="title">分类列表</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入分类ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>分类名称:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.name"
              placeholder="输入分类名称"
              size="default"
            />
          </div>
          <div class="op">
            <label>是否隐藏:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.hidden"
              placeholder="选择隐藏状态"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="显示" :value="0" />
              <el-option label="隐藏" :value="1" />
            </el-select>
          </div>

        </div>
        <div class="btn">
          <el-button size="default" type="primary" @click="show()"
            >添加</el-button
          >
        </div>
        <el-table border :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <el-table-column
            prop="name"
            :align="'center'"
            label="分类名称"
            width="150"
          />
          <el-table-column
            prop="count"
            :align="'center'"
            label="文章数量"
            width="150"
          />
          <el-table-column
            prop="description"
            :align="'center'"
            label="描述信息"
          />
          
          <el-table-column :align="'center'" label="是否隐藏" width="90">
            <template #default="{row}">
              <el-switch
                v-model="row.hidden"
                @click="updateStatus(row)"
                :active-value="1"
                :inactive-value="0"
              /> </template
          ></el-table-column>
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="180"
          />

          <el-table-column :align="'center'" label="操作" width="180">
            <template #default="scope">
              <el-button size="default" type="primary" @click="show(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="default"
                type="danger"
                @click="deleteR(scope.row)"
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
    <add-and-edit-modal
      ref="modifyRef"
      v-model:show="showDialog"
      :item="selected"
      @refresh="getData()"
    />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin: 15px 0;
}
</style>
