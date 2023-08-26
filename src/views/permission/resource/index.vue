,
<script setup lang="ts">
import { onBeforeMount, ref, reactive } from "vue";
import ModifyModal from "./modifyModal.vue";
import { ResourceDto, getResourcePage } from "@/api/resource";
defineOptions({
  name: "Resource"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params
  };
  getResourcePage(tempParams).then((data: any) => {
    list.value = data;
  });
};

const total = ref<number>(0);
const params = reactive({
  page: 1,
  limit: 10
});
const list = ref<ResourceDto[]>([
  {
    id: 1,
    name: "string",
    requestMethod: "string",
    path: "string",
    parentId: 0,
    open: 0,
    description: "string",
    createTime: "string",
    updateTime: "string",
    children: [
      {
        id: 2,
        name: "string",
        requestMethod: "string",
        path: "string",
        parentId: 1,
        open: 0,
        description: "string",
        createTime: "string",
        updateTime: "string",
        children: []
      }
    ]
  }
]);

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<any>();
const parentId = ref<number>();
const parentName = ref<string>();
const isChildren = ref(false);
const show = (isAdd: boolean, isChild: boolean, item: any = null) => {
  console.log("11");
  if (isAdd) {
    if (item) {
      // 添加子菜单
      parentId.value = item.id;
      parentName.value = item.name;
      selected.value = null;
    } else {
      // 添加根菜单
      parentId.value = null;
      parentName.value = "";
      selected.value = null;
    }
  } else {
    // 编辑菜单
    parentId.value = null;
    parentName.value = "";
    selected.value = item;
  }
  isChildren.value = isChild;
  showDialog.value = true;
};
</script>

<template>
  <div class="role">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">菜单信息</span>
          <el-button class="button" @click="getResourcePage()"
            >刷新数据</el-button
          >
        </div>
      </template>
      <div class="content">
        <el-button size="default" type="primary" @click="show(true, false)"
          >添加</el-button
        >
        <el-table
          :data="list"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          style="width: 100%"
        >
          <!-- <el-table-column prop="id" :align="'center'" label="ID" width="80" /> -->
          <el-table-column
            prop="name"
            :align="'center'"
            label="名称"
            width="150"
          />
          <el-table-column
            prop="requestMethod"
            :align="'center'"
            label="请求方法"
            width="150"
          />
          <el-table-column
            prop="path"
            :align="'center'"
            label="访问路径"
            width="150"
          />
          <el-table-column
            prop="description"
            :align="'center'"
            label="描述信息"
          />
          <el-table-column :align="'center'" label="是否开放" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.open"
                :active-value="1"
                :inactive-value="0"
              /> </template
          ></el-table-column>
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="200"
          />
          <el-table-column
            prop="updateTime"
            :align="'center'"
            label="修改时间"
            width="200"
          />
          <el-table-column :align="'center'" label="操作" width="250">
            <template #default="scope">
              <el-button
                v-if="!scope.row.parentId"
                size="default"
                type="primary"
                @click="show(true, true, scope.row)"
                >添加</el-button
              >
              <el-button
                size="default"
                type="primary"
                @click="show(false, true, scope.row)"
                >编辑</el-button
              >
              <el-button size="default" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :hide-on-single-page="true"
          background
          layout="total,prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 40, 50]"
        />
      </div>
    </el-card>
    <modify-modal
      ref="modifyRef"
      v-model:show="showDialog"
      :isChildren="isChildren"
      :parentId="parentId"
      :parentName="parentName"
      :item="selected"
    />
  </div>
</template>

<style lang="scss" scoped>
.card-header {
}
</style>
