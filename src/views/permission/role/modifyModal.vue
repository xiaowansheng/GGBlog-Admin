<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref, toRef, toRefs, watch } from "vue";
import { Role } from "./role";
defineOptions({
  name: "RoleAddAndModifyModal"
});
const emits = defineEmits(["update:show"]);
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
    form.name = "";
    form.label = "";
    form.description = "";
    form.disable = 0;
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
const rules = reactive<FormRules<typeof form>>({
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
    { validator: (rule: any, value: any, callback: any) => {callback();}, trigger: "blur" }
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("submit!");
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
  <el-dialog
    v-model="visiable"
    :title="form.id ? '修改角色信息' : '新增角色信息'"
    style="max-width: 576px;min-width: 360px;"
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
        <el-input v-model="form.description" />
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
        <el-button @click="visiable = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
