<script setup lang="ts">
import {
  getPersonInformation,
  UserInfoVo,
  UserInfoDto,
  updateInformation
} from "@/api/user";
import { onBeforeMount, ref } from "vue";
import SinglePictureUpload from "@/components/upload/SinglePicture/index.vue";
import { ElMessage, FormRules } from "element-plus";
import { reactive } from "vue";
defineOptions({
  name: "Information"
});
onBeforeMount(() => {
  getData();
});
const information = reactive<UserInfoVo>({
  id: null,
  nickname: "",
  email: "",
  qq: "",
  avatar: "",
  signature: "",
  introduction: "",
  website: ""
});
const getData = () => {
  getPersonInformation().then((data: any) => {
    information.id = data.id;
    information.nickname = data.nickname;
    information.email = data.email;
    information.qq = data.qq;
    information.avatar = data.avatar;
    information.signature = data.signature;
    information.introduction = data.introduction;
    information.website = data.website;
  });
};
const rules = reactive<FormRules>({
  nickname: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("用户昵称不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],

  email: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("用户邮箱不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  avatar: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("请上传用户头像!"));
        }
      },
      trigger: "blur"
    }
  ]
});
const uploadRef = ref();
const open = ref<boolean>(false);
const loading = ref(false);
const updateData = () => {
  loading.value = true;
  uploadRef.value
    .uploadFile((data: any) => {
      information.avatar = data.link;
      updateInformation(information)
        .then(() => {
          open.value = false;
          ElMessage.success("修改成功！");
          loading.value = false;
        })
        .catch(() => {
          loading.value = false;
        });
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>

<template>
  <div class="person-center content">
    <div class="operation">
      <el-button class="button" @click="getData()">刷新数据</el-button>
    </div>
    <div class="information">
      <el-form
        ref="formRef"
        :model="information"
        :rules="rules"
        label-width="80px"
        label-position="left"
        status-icon
      >
        <el-form-item v-show="false" label="ID:">
          <el-input v-model="information.id" disabled />
        </el-form-item>
        <el-form-item label="昵称:" prop="nickname">
          <el-input :disabled="!open" v-model="information.nickname" />
        </el-form-item>
        <el-form-item label="头像:" prop="avatar">
          <!-- <el-input :disabled="!open" v-model="information.avatar" /> -->
          <SinglePictureUpload
            ref="uploadRef"
            :dir="'avatar'"
            v-model:value="information.avatar"
            :disable="!open"
            :height="'150px'"
            :width="'150px'"
          />
        </el-form-item>
        <el-form-item label="签名:" prop="signature">
          <el-input :disabled="!open" v-model="information.signature" />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input :disabled="!open" v-model="information.email" />
        </el-form-item>
        <el-form-item label="QQ:" prop="qq">
          <el-input :disabled="!open" v-model="information.qq" />
        </el-form-item>
        <el-form-item label="个人介绍:">
          <el-input
            :disabled="!open"
            v-model="information.introduction"
            :rows="3"
            type="textarea"
            placeholder="个人介绍信息~"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="update">
      <el-button type="warning" @click="open = !open">{{
        open ? "关闭修改" : "开启修改"
      }}</el-button>
      <el-button
        type="primary"
        v-loading="loading"
        :disabled="!open || loading"
        @click="updateData()"
        >提交修改</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-form {
  margin: 0 auto;
  max-width: 576px;
  min-width: 360px;
}
.operation {
  margin-right: 25px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
