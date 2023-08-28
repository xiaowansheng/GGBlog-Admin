<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { ErrorDto, getErrorPage } from "@/api/errorLog";
import ErrorDetailModal from "./errorDetailModal.vue";
defineOptions({
  name: "ErrorLog"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getErrorPage(tempParams).then((data: any) => {
    console.log(data);
    total.value = data.total;
    list.value = data.list;
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 8
};
const queryParams = reactive({
  id: "",
});
const list = ref<ErrorDto[]>([]);

// const detailRef = ref();
const showDialog = ref(false);
const selected = ref<ErrorDto>();
const show = (item: ErrorDto = null) => {
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
          <span class="title">错误日志信息</span>
          <el-button class="button">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <!-- <div class="table-operation">
          <div class="op">
            <label>错误ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入操作ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>请求方法:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.requestMethod"
              placeholder="选择请求方法"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
            </el-select>
          </div>

          <div class="op">
            <label>请求地址:</label>
            <el-input
              style="min-width: 200px"
              @change="getData()"
              v-model="queryParams.requestUrl"
              placeholder="输入请求地址"
              size="default"
            />
          </div>
          <div class="op">
            <label>操作模块:</label>
            <el-input
              style="min-width: 200px"
              @change="getData()"
              v-model="queryParams.module"
              placeholder="输入操作模块"
              size="default"
            />
          </div>
          <div class="op">
            <label>操作类型:</label>
            <el-input
              style="min-width: 200px"
              @change="getData()"
              v-model="queryParams.type"
              placeholder="输入操作类型"
              size="default"
            />
          </div>

        </div> -->
        <el-table border :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <!-- <el-table-column
            prop="userAuthId"
            :align="'center'"
            label="用户账号"
            width="150"
          /> -->
          <el-table-column
            prop="userName"
            :align="'center'"
            label="用户名称"
            width="130"
          />
          <el-table-column :align="'center'" label="请求方法" width="80">
            <template #default="scope">
              <el-tag>{{ scope.row.requestMethod }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="requestUrl"
            :align="'center'"
            label="请求地址"
            width="140"
          />
          <el-table-column
            prop="module"
            :align="'center'"
            label="访问模块"
            width="130"
          />
          <el-table-column
            prop="callingMethod"
            :align="'center'"
            label="调用方法"
            width="130"
          />
          <el-table-column
            prop="errorName"
            :align="'center'"
            label="错误名称"
            width="150"
          >
            <!-- <template #default="scope">
              <el-tag type="success">{{ scope.row.type }}</el-tag>
            </template> -->
          </el-table-column>
          <!-- <el-table-column
            prop="description"
            :align="'center'"
            label="操作类信息"
            width="160"
          /> -->
          <!-- <el-table-column
            prop="callingMethod"
            :align="'center'"
            label="调用方法"
          /> -->
          <!-- <el-table-column
            prop="requestParam"
            :align="'center'"
            label="请求参数"
            width="200"
          /> -->
          <!-- <el-table-column
            prop="responseData"
            :align="'center'"
            label="响应数据"
            width="200"
          /> -->
          <!-- <el-table-column
            prop="ipAddress"
            :align="'center'"
            label="IP 地址"
            width="160"
          /> -->
          <!-- <el-table-column
            prop="ipSource"
            :align="'center'"
            label="IP 位置"
            width="200"
          />
          <el-table-column
            prop="device"
            :align="'center'"
            label="设备信息"
            width="150"
          />
          <el-table-column
            prop="browser"
            :align="'center'"
            label="浏览器信息"
            width="150"
          /> -->
          <el-table-column prop="version" :align="'center'" label="版本信息" />
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="180"
          />
          <el-table-column
            fixed="right"
            :align="'center'"
            label="操作"
            width="115"
          >
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
          v-model:current-page="params.page"
          v-model:page-size="params.limit"
          @update:current-page="getData()"
          @update:page-size="getData()"
          layout="total,prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[8, 15, 20, 30, 50]"
        />
      </div>
    </el-card>
    <error-detail-modal v-model:show="showDialog" :item="selected" />
  </div>
</template>

<style lang="scss" scoped>
.card-header {
}
</style>
