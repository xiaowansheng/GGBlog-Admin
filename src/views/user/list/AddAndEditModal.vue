<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";

import { addUser, updateUser } from "@/api/user";
import { getAllSimpleRoles } from "@/api/role";
defineOptions({
  name: "UserAddAndModifyModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  item: null
});
const roles = ref<any>([]);
onBeforeMount(() => {
  getAllSimpleRoles().then((data: any) => {
    roles.value = data;
  });
});
const { show, item } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  if (item.value) {
    form.id = item.value.id;
    form.username = item.value.username;
    form.userInfoVo.id = item.value.userInfoDto.id;
    form.userInfoVo.nickname = item.value.userInfoDto.nickname;
    roles.value.forEach(element => {
      if (item.value.roleNames[0] == element.name) {
        form.roleIds = [element.id];
      }
    });
  } else {
    form.id = null;
    form.userInfoVo.id = null;
    resetForm();
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<any>({
  id: null,
  username: "",
  passsword: "",
  password2: "",
  disable: 0,
  userInfoVo: {
    id: null,
    nickname: ""
  },
  roleIds: []
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  username: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value || item.value) {
          callback();
        } else {
          callback(new Error("用户名不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  password: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value || item.value) {
          callback();
        } else {
          callback(new Error("用户密码不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  password2: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          if (form.password != form.password2 || item.value) {
            callback(new Error("两次密码不一致!"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请再次输入密码!"));
        }
      },
      trigger: "blur"
    }
  ],
  nickname: [
    {
      validator: (rule: any, value: any, callback: any) => {
        console.log(value);

        if (form.userInfoVo.nickname || item.value) {
          callback();
        } else {
          callback(new Error("用户昵称不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  roles: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.roleIds[0]) {
          callback();
        } else {
          callback(new Error("用户角色不能为空!"));
        }
      },
      trigger: "blur"
    }
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      if (item.value?.id) {
        updateUser(form)
          .then(() => {
            ElMessage({
              message: "修改成功！",
              type: "success"
            });
            emits("refresh");
            visiable.value = false;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      } else {
        addUser(form)
          .then(() => {
            ElMessage({
              message: "保存成功！",
              type: "success"
            });
            emits("refresh");
            visiable.value = false;

            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.username = "";
  form.passsword = "";
  form.password2 = "";
  form.userInfoVo.nickname = "";
  form.roleIds = [];
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="form.id ? '授予角色信息' : '新增用户信息'"
    class="form"
    style=""
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
      status-icon
    >
      <el-form-item v-if="form.id" label="用户名：">
        <el-input :disabled="true" :value="item?.username" />
      </el-form-item>
      <el-form-item v-if="form.id" label="用户昵称：">
        <el-input :disabled="true" :value="item?.userInfoDto.nickname" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="用户名：" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="用户昵称：" prop="nickname">
        <el-input
          v-model="form.userInfoVo.nickname"
          placeholder="请输入用户昵称"
        />
      </el-form-item>
      <el-form-item v-if="!form.id" label="密码：" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="密码：" prop="password2">
        <el-input v-model="form.password2" placeholder="请再次输入密码" />
      </el-form-item>
      <el-form-item label="是否禁用：" prop="disable">
        <el-switch
          v-model="form.disable"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="用户角色：" prop="roles">
        <el-radio-group v-model="form.roleIds[0]">
          <el-radio
            v-for="item in roles"
            :key="item.id"
            :label="item.id"
            size="large"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <el-button v-if="!form.id" @click="resetForm()">重置</el-button>
        <el-button type="primary" v-loading="loading" :disabled="laoding" @click="submitForm(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
