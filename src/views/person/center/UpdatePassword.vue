<script setup lang="ts">
import { updatePassword } from "@/api/user";
import { onBeforeMount, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { reactive } from "vue";
defineOptions({
  name: "UpdatePassword"
});
const information = reactive<any>({
  newPassword: "",
  newPassword2: "",
  oldPassword: ""
});
const rules = reactive<FormRules>({
  oldPassword: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("请输入原密码!"));
        }
      },
      trigger: "blur"
    }
  ],

  newPassword: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("请输入新密码!"));
        }
      },
      trigger: "blur"
    }
  ],
  newPassword2: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          if (value == information.newPassword) {
            callback();
          } else {
            callback(new Error("两次密码输入不一致!"));
          }
        } else {
          callback(new Error("请再次输入新密码!"));
        }
      },
      trigger: "blur"
    }
  ]
});
const open = ref<boolean>(false);
const formRef = ref<FormInstance>();

const updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      updatePassword(information).then(() => {
        open.value = false;
        ElMessage.success("修改成功！");
        resetForm(formEl);
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <div class="person-center content">
    <div class="information">
      <el-form
        ref="formRef"
        :model="information"
        :rules="rules"
        label-width="80px"
        label-position="left"
        status-icon
      >
        <el-form-item label="旧密码:" prop="oldPassword">
          <el-input
            type="password"
            :disabled="!open"
            v-model="information.oldPassword"
            placeholder="输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input
            type="password"
            :disabled="!open"
            v-model="information.newPassword"
            placeholder="输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword2">
          <el-input
            type="password"
            :disabled="!open"
            v-model="information.newPassword2"
            placeholder="再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="update">
      <el-button type="warning" @click="open = !open">{{
        open ? "关闭修改" : "开启修改"
      }}</el-button>
      <el-button type="primary" :disabled="!open" @click="updateData(formRef)"
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
