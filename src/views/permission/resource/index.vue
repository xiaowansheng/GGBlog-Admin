,
<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import ModifyModal from "./modifyModal.vue";
import { ResourceDto, updateResourceStatus, getTree, deleteResource } from "@/api/resource";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "Resource"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getTree(tempParams).then((data: any) => {
    list.value = data;
    total.value = data.length;
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 99
};
const queryParams = reactive({});
const list = ref<ResourceDto[]>([]);
const updateStatus = (item: ResourceDto) => {
  updateResourceStatus(null, {
    data: {
      id: item.id,
      status: item.open
    }
  })
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.open = item.open == 1 ? 0 : 1;
    });
};

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
      parentId.value = 0;
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

const deleteR = (item: ResourceDto) => {
  ElMessageBox.confirm(`是否确认删除资源【${item.name}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteResource();
      ElMessage.success("删除成功");
    });
};
</script>

<template>
  <div class="role">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">资源信息</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="operation">
          <el-button size="default" type="primary" @click="show(true, false)"
            >添加</el-button
          >
        </div>
        <el-table
          border
          :data="list"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          style="width: 100%"
        >
          <!-- <el-table-column prop="id" :align="'center'" label="ID" width="80" /> -->
          <el-table-column
            prop="name"
            header-align="center"
            label="资源名称"
            width="180"
          />
          <el-table-column :align="'center'" label="请求方法" width="100">
            <template #default="scope">
              <el-tag>{{ scope.row.requestMethod }}</el-tag>
            </template></el-table-column
          >
          <el-table-column
            prop="path"
            :align="'center'"
            label="访问路径"
            width="180"
          />
          <el-table-column
            prop="description"
            :align="'center'"
            label="资源描述"
          />
          <el-table-column :align="'center'" label="是否开放" width="100">
            <template #default="{ row }">
              <el-switch
                v-if="row.parentId"
                @click="updateStatus(row)"
                v-model="row.open"
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
          <!-- <el-table-column
            prop="updateTime"
            :align="'center'"
            label="修改时间"
            width="200"
          /> -->
          <el-table-column :align="'center'" label="操作" width="250">
            <template #default="{row}">
              <el-button
                v-if="!row.parentId"
                size="default"
                type="primary"
                @click="show(true, true, row)"
                >添加</el-button
              >
              <el-button
                size="default"
                type="primary"
                @click="show(false, false, row)"
                >编辑</el-button
              >
              <el-button
                v-if="!row.children || row.children.length == 0"
                size="default"
                type="danger"
                @click="deleteR(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :hide-on-single-page="false"
          background
          layout="total"
          :total="total"
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
      @refresh="getData()"
    />
  </div>
</template>

<style lang="scss" scoped>
// 表格中的图标居中
.el-table {
  svg {
    display: inline-block;
  }
}
</style>
