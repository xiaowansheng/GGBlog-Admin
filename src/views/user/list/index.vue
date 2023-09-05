<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import {
  getUserPage,
  updateUser,
  UserAuthDto,
  geAlltLoginType,
  updateUserStatus
} from "@/api/user";

import { getAllSimpleRoles } from "@/api/role";
import AddAndEditModal from "./AddAndEditModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "UserList"
});
onBeforeMount(() => {
  geAlltLoginType().then((data: any) => {
    loginTypes.value = data;
  });
  getAllSimpleRoles().then((data:any) => {
    roles.value=data
  })
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getUserPage(tempParams).then((data: any) => {
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
  username: "",
  nickname:"",
  ipSourceSignup: "",
  disable: null,
  loginType: "",
  device: "",
  browser: "",
  roleId: "",
  email: "",
  qq:""
});
const roles=ref<any>([])
const loginTypes = ref<any[]>([]);
const list = ref<UserAuthDto[]>([]);
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
const selected = ref<UserAuthDto>();
const show = (item: UserAuthDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
const updateStatus = (item: UserAuthDto) => {
  const form = {
    id: item.id,
    status: item.disable
  };
  updateUserStatus(form)
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.disable = item.disable == 1 ? 0 : 1;
    });
};
// const deleteR = (item: UserAuthDto) => {
//   ElMessageBox.confirm(`是否确认删除友链【${item.username}】？`, "Warning", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//     type: "warning"
//   }).then(() => {
//     deleteUser(item.id).then(() => {
//       getData();
//       ElMessage.success("删除成功");
//     });
//   });
// };
</script>

<template>
  <div class="friend">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">用户列表</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>用户ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入用户ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>用户名:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.username"
              placeholder="输入用户名"
              size="default"
            />
          </div>
          <div class="op">
            <label>登录类型:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.loginType"
              placeholder="选择登录类型"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in loginTypes"
                :key="item.name"
                :label="item.label + '（' + item.name + '）'"
                :value="item.name"
              />
            </el-select>
          </div>
          <div class="op">
            <label>用户角色:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.roleId"
              placeholder="选择角色类型"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.label + '（' + item.name + '）'"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="op">
            <label>是否禁用:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.disable"
              placeholder="选择禁用状态"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="可用" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </div>
          <div class="op">
            <label>注册地:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.ipSource"
              placeholder="输入注册地"
              size="default"
            />
          </div>
          <div class="op">
            <label>电子邮箱:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.email"
              placeholder="输入邮箱链接"
              size="default"
            />
          </div>
          <div class="op">
            <label>昵称:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.nickname"
              placeholder="输入昵称"
              size="default"
            />
          </div>
          <div class="op">
            <label>QQ:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.qq"
              placeholder="输入qq"
              size="default"
            />
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
            prop="username"
            :align="'center'"
            label="用户名"
            width="150"
          />

          <el-table-column
            prop="loginType"
            :align="'center'"
            label="登录类型"
            width="150"
          >
            <template #default="{ row }">
              {{ findType(row.loginType) }}
            </template></el-table-column
          >
          <el-table-column
            prop="userInfoDto.nickname"
            :align="'center'"
            label="昵称"
            width="150"
          />
          <el-table-column
            :align="'center'"
            label="头像"
            width="80"
          >
        <template #default="{row}">
              <el-avatar shape="square" :size="50" :fit="'cover'" :src="row.userInfoDto.avatar" />

        </template>
        </el-table-column>
          <el-table-column
            prop="userInfoDto.email"
            :align="'center'"
            label="邮箱"
            width="150"
          />
          <el-table-column
            prop="userInfoDto.qq"
            :align="'center'"
            label="QQ"
            width="150"
          />
          <el-table-column
            prop="userInfoDto.signature"
            :align="'center'"
            label="签名"
            width="150"
          />
          <el-table-column
            prop="userInfoDto.introduction"
            :align="'center'"
            label="个人介绍"
            width="150"
          />
          <el-table-column :align="'center'" label="角色信息" width="100">
            <template #default="{ row }">
              <el-tag v-for="item in row.roleNames" :key="item">{{
                item
              }}</el-tag>
            </template></el-table-column
          >
          <el-table-column :align="'center'" label="网站链接" width="150">
            <template #default="scope">
              <el-link
                target="_blank"
                type="primary"
                :href="scope.row.userInfoDto.website"
                >{{ scope.row.userInfoDto.website }}</el-link
              >
            </template></el-table-column
          >
          <el-table-column :align="'center'" label="是否禁用" width="90">
            <template #default="scope">
              <el-switch
                v-model="scope.row.disable"
                @click="updateStatus(scope.row)"
                :active-value="1"
                :inactive-value="0"
              /> </template
          ></el-table-column>
          <el-table-column
            prop="ipSourceSignup"
            :align="'center'"
            label="注册地"
            width="150"
          />
          <el-table-column
            prop="userInfoDto.createTime"
            :align="'center'"
            label="创建时间"
            width="160"
          />

          <el-table-column :align="'center'" label="操作" width="180">
            <template #default="scope">
              <el-button size="default" type="primary" @click="show(scope.row)"
                >编辑</el-button
              >
              <!-- <el-button
                size="default"
                type="danger"
                @click="deleteR(scope.row)"
                >删除</el-button
              > -->
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
