<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";

import Menu from "./menu";
import SinglePictureUpload from "@/components/upload/SinglePicture/index.vue";
defineOptions({
  name: "MenuAddAndModifyModal"
});
const emits = defineEmits(["update:show", "updateData"]);
const props = defineProps({
  show: Boolean,
  isAdd: Boolean,
  item: null
});

const { show, isAdd, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  // console.log(item?.value);

  if (!isAdd.value && item?.value) {
    form.name = item.value.name;
    form.label = item.value.label;
    form.cover = item.value.cover;
  } else {
    resetForm();
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Menu>({
  name: "",
  cover: "",
  label: ""
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("菜单名称不能为空!"));
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
          callback(new Error("菜单标签不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  cover: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("菜单封面不能为空!"));
        }
      },
      trigger: "blur"
    }
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // emit 交给父类修改提交
  formEl.validate(valid => {
    if (valid) {
      emits("updateData", form);
    }
  });
};

const resetForm = () => {
  form.label = "";
  form.name = "";
  form.cover = "";
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="isAdd ? '添加菜单配置' : '修改菜单配置'"
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
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单标签" prop="label">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="菜单封面" prop="cover">
        <!-- <el-input v-model="form.cover" /> -->
        <SinglePictureUpload v-model="form.cover" :dir="'cover'" />
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

