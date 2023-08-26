<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { Resource } from "@/api/resource";
defineOptions({
  name: "MenuAddAndModifyModal"
});
const emits = defineEmits(["update:show"]);
const props = defineProps({
  show: Boolean,
  isChildren: Boolean,
  parentId: Number,
  parentName: String,
  item: null
});

const { show, parentId,isChildren, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  // console.log(item?.value);
  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.requestMethod = item.value.requestMethod;
    form.path = item.value.path;
    form.parentId = item.value.parentId;
    form.open = item.value.open;
    form.description = item.value.description;
  } else {
    form.id = null;
    form.name = "";
    form.requestMethod = "";
    form.path = "";
    form.parentId = parentId.value;
    form.open = 0;
    form.description = "";
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Resource>({
  id: null,
  name: "",
  requestMethod: "",
  path: "",
  open: 0,
  parentId: null,
  description: ""
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
    :title="form.id ? '修改菜单信息' : '新增菜单信息'"
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
      <el-form-item v-if="!form.id" label="资源类型">
        <el-input :value="isChildren ? '接口' : '模块'" disabled />
      </el-form-item>
      <el-form-item v-if="isChildren" label="模块名称">
        <el-input :value="parentName" disabled />
      </el-form-item>
      <el-form-item v-if="form.id" label="资源ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item :label="isChildren ? '接口名称' : '模块名称'" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-if="form.parentId" label="请求方法" prop="label">
        <el-input v-model="form.requestMethod" />
      </el-form-item>
      <el-form-item v-if="form.parentId" label="请求地址" prop="label">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item v-if="form.parentId" label="是否开放">
        <el-switch
          v-model="form.open"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">Cancel</el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
