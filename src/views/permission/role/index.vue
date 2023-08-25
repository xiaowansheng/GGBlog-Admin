<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getAllRoles } from "@api/Role.ts";
import { RoleDto } from "./role";
import ModifyModal from "./modifyModal.vue";
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
  getAllRoles(tempParams).then(data => {
    list.value = data;
  });
};

let total: number = 0;
const params = {
  page: 1,
  limit: 10
};
const list = ref<RoleDto[]>();

const modifyRef=ref()
const showDialog = ref(false);
const selected = ref<RoleDto>();
const show = (item: RoleDto = null) => {
  console.log("11");
  
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
</script>

<template>
  <div class="role">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">角色信息</span>
          <el-button class="button" @click="getAllRoles()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <el-button size="default" type="primary" @click="show()"
          >添加</el-button
        >
        <el-table :data="list" style="width: 100%">
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
                active-value="1"
                inactive-value="0"
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
              <el-button size="default" type="primary">权限</el-button>
              <el-button size="default" type="primary" @click="show(scope.row)"
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
      :item="selected"
    ></modify-modal>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
}
</style>
