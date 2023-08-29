<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";

import { Role, addRole, updateRole } from "@/api/role";
defineOptions({
  name: "RoleAddAndModifyModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  item: null
});

const { show, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  // console.log(item?.value);

  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.label = item.value.label;
    form.description = item.value.description;
    form.disable = item.value.disable;
  } else {
    form.id = null;
    resetForm()
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Role>({
  id: null,
  name: "",
  label: "",
  description: "",
  disable: 0
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("角色名称不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  label: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("角色标签不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  disable: [
    {
      validator: (rule: any, value: any, callback: any) => {
        callback();
      },
      trigger: "blur"
    }
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      if (form.id) {
        updateRole(null, { data: form }).then(() => {
          ElMessage({
            message: "修改成功！",
            type: "success"
          });
          emits("refresh");
          visiable.value = false;
        });
      } else {
        addRole(null, { data: form }).then(() => {
          ElMessage({
            message: "保存成功！",
            type: "success"
          });
          emits("refresh");
          visiable.value = false;
        });
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {

    form.name = "";
    form.label = "";
    form.description = "";
    form.disable = 0;
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="form.id ? '修改角色信息' : '新增角色信息'"
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
      <el-form-item v-if="form.id" label="角色ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色标签" prop="label">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          v-model="form.description"
          :rows="2"
          type="textarea"
          placeholder=""
        />
        <!-- <el-input v-model="form.description" /> -->
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch
          v-model="form.disable"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
