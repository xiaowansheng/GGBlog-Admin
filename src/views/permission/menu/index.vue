,
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import ModifyModal from "./modifyModal.vue";
import { MenuDto, getAllMenus, deleteMenu, updateMenuStatus } from "@/api/menu";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "Menu"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params
  };
  getAllMenus(tempParams).then((data: any) => {
    list.value = data;
    total.value = list.value.length;
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 99
};
const list = ref<MenuDto[]>([]);

const updateStatus = (item: MenuDto) => {
  updateMenuStatus(null, {
    data: {
      id: item.id,
      status: item.hidden
    }
  })
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.hidden = item.hidden == 1 ? 0 : 1;
    });
};

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<any>();
const parentId = ref<number>();
const parentName = ref<string>("");
const isChildren = ref(false);
const show = (isAdd: boolean, isChild: boolean, item: any = null) => {
  if (isAdd) {
    if (isChild) {
      // 添加子菜单
      parentId.value = item.id;
      parentName.value = item.title;
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

const deleteR = (item: MenuDto) => {
  ElMessageBox.confirm(`是否确认删除菜单【${item.title}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteMenu(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="role">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">菜单信息</span>
          <el-button class="button" @click="getAllMenus()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <el-button size="default" type="primary" @click="show(true, false)"
          >添加</el-button
        >
        <el-table
          border
          :data="list"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          style="width: 100%"
        >
          <!-- <el-table-column prop="id" :align="'center'" label="ID" width="80" /> -->
          <el-table-column
            prop="title"
            header-align="center"
            label="标题"
            width="180"
          />
          <el-table-column
            prop="name"
            :align="'center'"
            label="名称"
            width="130"
          />
          <el-table-column :align="'center'" label="图标" width="80">
            <template #default="scope">
              <IconifyIconOnline
                :icon="scope.row.icon"
                width="20px"
                height="20px"
              />
              <!-- <IconifyIconOffline icon="homeFilled" /> -->
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="redirect"
            :align="'center'"
            label="重定向"
            width="140"
          /> -->
          <el-table-column
            prop="path"
            :align="'center'"
            label="访问地址"
            width="180"
          />
          <el-table-column
            prop="component"
            :align="'center'"
            label="组件路径"
          />
          <!-- <el-table-column
            prop="description"
            :align="'center'"
            label="描述信息"
            width="160"
          /> -->
          <el-table-column :align="'center'" label="是否隐藏" width="90">
            <template #default="scope">
              <el-switch
                @click="updateStatus(scope.row)"
                v-model="scope.row.hidden"
                :active-value="1"
                :inactive-value="0"
              /> </template
          ></el-table-column>
          <el-table-column prop="sort" :align="'center'" label="排序"  width="60"/>
          <!-- <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="200"
          /> -->
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
