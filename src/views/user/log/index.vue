<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { LoginLogDto,getLoginLogPage } from "@/api/loginlog";
defineOptions({
  name: "LoginLog"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getLoginLogPage(tempParams).then((data: any) => {
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
  userAuthId: null,
  device: "",
  browser: "",
  location: "",
  
});
const loginTypes = ref<any[]>([]);
const list = ref<LoginLogDto[]>([]);

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<LoginLogDto>();
</script>

<template>
  <div class="friend">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">登录日志</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>日志ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入日志ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>用户ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.userAuthId"
              placeholder="输入用户名"
              size="default"
            />
          </div>

          <div class="op">
            <label>登录地点:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.location"
              placeholder="输入位置信息"
              size="default"
            />
          </div>
          <div class="op">
            <label>使用设备:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.device"
              placeholder="输入设备信息"
              size="default"
            />
          </div>
          <div class="op">
            <label>浏览器:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.browser"
              placeholder="输入昵浏览器信息"
              size="default"
            />
          </div>
        </div>
        <el-table border :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <el-table-column
            prop="userAuthId"
            :align="'center'"
            label="用户ID"
            width="80"
          />


          <el-table-column
            prop="ipAddress"
            :align="'center'"
            label="IP地址"
            width="130"
          />
          <el-table-column
            prop="ipSource"
            :align="'center'"
            label="IP来源"
            width="220"
          >
                   <template #default="{ row }">
              <el-tooltip
                class="tooltip"
                effect="light"
                :content="row.ipSource"
                placement="top-start"
              >
                <span class="ellipsis">{{ row.ipSource }}</span>
              </el-tooltip>
            </template>
        </el-table-column>
          <el-table-column
            prop="device"
            :align="'center'"
            label="设备"
            width="150"
          />
          <el-table-column
            prop="browser"
            :align="'center'"
            label="浏览器"
            width="150"
          />
          <el-table-column
            prop="location"
            :align="'center'"
            label="位置"
            width="220"
          />
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="180"
          />

          <!-- <el-table-column :align="'center'" label="操作" width="180">
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
          </el-table-column> -->
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
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin: 15px 0;
}
</style>
