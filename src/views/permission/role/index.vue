<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getAllRoles, updateRoleStatus, RoleDto, deleteRole } from "@/api/role";
import ModifyModal from "./modifyModal.vue";
import MenuAuthorizationModal from "./menuAuthorizationModal.vue";
import ResourceAuthorizationModal from "./resourceAuthorizationModal.vue";

import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "Role"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params
  };
  getAllRoles(tempParams).then((data: any) => {
    list.value = data;
    total.value=list.value.length
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 99
};
const list = ref<RoleDto[]>([
  {
    id: 0,
    name: "unknow",
    label: "未知",
    description: "aaa",
    disable: 0,
    createTime: "",
    updateTime: ""
  }
]);

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<RoleDto>();
const show = (item: RoleDto = null) => {

  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};

const menuAuthorizationShow = ref<boolean>(false);
const resourceAuthorizationShow = ref<boolean>(false);
const selectRoleId = ref<number>();
const updateR = (item: RoleDto) => {
  const form = {
    id: item.id,
    status: item.disable
  };
  updateRoleStatus(null, { data: form })
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.disable = item.disable == 1 ? 0 : 1;
    });
};
const deleteR = (item: RoleDto) => {
  ElMessageBox.confirm(`是否确认删除角色【${item.name}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRole(item.id).then(() => {
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
          <span class="title">角色信息</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <el-button size="default" type="primary" @click="show()"
          >添加</el-button
        >
        <el-table border :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <el-table-column
            prop="name"
            :align="'center'"
            label="名称"
            width="150"
          />
          <el-table-column
            prop="label"
            :align="'center'"
            label="标签"
            width="150"
          />
          <el-table-column
            prop="description"
            :align="'center'"
            label="描述信息"
          />
          <el-table-column :align="'center'" label="禁用" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.disable"
                @click="updateR(scope.row)"
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
          <el-table-column :align="'center'" label="权限设置" width="230">
            <template #default="scope">
              <el-button
                size="default"
                type="primary"
                @click="
                  selectRoleId = scope.row.id;
                  menuAuthorizationShow = true;
                "
                >菜单权限</el-button
              >
              <el-button
                size="default"
                type="primary"
                @click="
                  selectRoleId = scope.row.id;
                  resourceAuthorizationShow = true;
                "
                >资源权限</el-button
              >
            </template>
          </el-table-column>
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
          layout="total"
          :total="total"
        />
      </div>
    </el-card>
    <modify-modal
      ref="modifyRef"
      v-model:show="showDialog"
      :item="selected"
      @refresh="getData()"
    />
    <menu-authorization-modal
      v-model:show="menuAuthorizationShow"
      :roleId="selectRoleId"
    />
    <resource-authorization-modal
      v-model:show="resourceAuthorizationShow"
      :roleId="selectRoleId"
    />
  </div>
</template>

<style lang="scss" scoped>
.card-header {
}
</style>
