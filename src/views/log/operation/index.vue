<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { OperationDto } from "@/api/operationLog";
import DetailModal from "./detailModal.vue";
defineOptions({
  name: "OperationLog"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params
  };
  // getOperationPage(tempParams).then((data: any) => {
  //   list.value = data;
  // });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 10
};
const list = ref<OperationDto[]>([
  {
    id: 1,
    userAuthId: 1,
    userName: "string",
    version: "string",
    requestUrl: "string",
    module: "string",
    callingMethod: "string",
    type: "string",
    description: "string",
    requestMethod: "string",
    requestParam: "string",
    responseData: "string",
    elapsedTime: 781,
    ipAddress: "string",
    ipSource: "string",
    device: "string",
    browser: "string",
    createTime: "string",
    updateTime: "string"
  }
]);

// const detailRef = ref();
const showDialog = ref(false);
const selected = ref<OperationDto>();
const show = (item: OperationDto = null) => {
  console.log("11");
  selected.value = item;
  showDialog.value = true;
};
</script>

<template>
  <div class="role">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">操作日志信息</span>
          <el-button class="button">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <el-table :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <el-table-column
            prop="id"
            :align="'center'"
            label="ID"
            width="150"
          />
          <el-table-column
            prop="userAuthId"
            :align="'center'"
            label="用户账号"
            width="150"
          />
          <el-table-column
            prop="userName"
            :align="'center'"
            label="用户名称"
          />
          <el-table-column
            prop="version"
            :align="'center'"
            label="版本信息"
          />
          <el-table-column
            prop="requestUrl"
            :align="'center'"
            label="请求地址"
          />
          <el-table-column
            prop="module"
            :align="'center'"
            label="访问模块"
          />
          <el-table-column
            prop="callingMethod"
            :align="'center'"
            label="调用方法"
          />
          <el-table-column
            prop="type"
            :align="'center'"
            label="操作类型"
            width="200"
          />
          <el-table-column
            prop="description"
            :align="'center'"
            label="操作类信息"
            width="200"
          />
          <el-table-column
            prop="requestMethod"
            :align="'center'"
            label="请求方法"
            width="200"
          />
          <el-table-column
            prop="requestParam"
            :align="'center'"
            label="请求参数"
            width="200"
          />
          <el-table-column
            prop="responseData"
            :align="'center'"
            label="响应数据"
            width="200"
          />
          <el-table-column
            prop="ipAddress"
            :align="'center'"
            label="IP 地址"
            width="200"
          />
          <el-table-column
            prop="ipSource"
            :align="'center'"
            label="IP 位置"
            width="200"
          />
          <el-table-column
            prop="device"
            :align="'center'"
            label="设备信息"
            width="200"
          />
          <el-table-column
            prop="browser"
            :align="'center'"
            label="浏览器信息"
            width="200"
          />
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="200"
          />
          <el-table-column :align="'center'" label="操作" width="180">
            <template #default="scope">
              <el-button size="default" type="primary" @click="show(scope.row)"
                >查看详情</el-button
              >
              <!-- <el-button size="default" type="danger">删除</el-button> -->
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
    <detail-modal v-model:show="showDialog" :item="selected" />
  </div>
</template>

<style lang="scss" scoped>
.card-header {
}
</style>
