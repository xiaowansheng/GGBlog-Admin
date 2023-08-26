<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { Menu } from "@/api/menu";
defineOptions({
  name: "MenuAddAndModifyModal"
});
const emits = defineEmits(["update:show"]);
const props = defineProps({
  show: Boolean,
  isChildren: Boolean,
  parentId: Number,
  parentName:String,
  item: null
});

const { show, isChildren,parentId, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  // console.log(item?.value);
  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.label = item.value.label;
    form.icon = item.value.icon;
    form.redirect = item.value.redirect;
    form.path = item.value.path;
    form.component = item.value.component;
    form.parentId = item.value.parentId;
    form.hidden = item.value.hidden;
    form.sort = item.value.sort;
    form.description = item.value.description;
  } else {
    form.id = null;
    form.name = "";
    form.label = "";
    form.icon = "";
    form.redirect = "";
    form.path = "";
    form.component = "";
    form.parentId = parentId.value;
    form.hidden = 0;
    form.sort = 0;
    form.description = "";
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Menu>({
  id: null,
  name: "",
  label: "",
  icon: "",
  redirect: "",
  path: "",
  component: "",
  parentId: null,
  hidden: 0,
  sort: 0,
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
      <el-form-item v-if="!form.id" label="菜单类型">
        <el-input :value="isChildren ? '子目录菜单' : '根目录菜单'" disabled />
      </el-form-item>
      <el-form-item v-if="!form.id" label="父菜单名称">
        <el-input :value="parentName" disabled/>
      </el-form-item>
      <el-form-item v-if="form.id" label="菜单ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单标签" prop="label">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="label">
        <el-input v-model="form.icon" />
      </el-form-item>
      <el-form-item label="重定向" prop="label">
        <el-input v-model="form.redirect" />
      </el-form-item>
      <el-form-item label="访问路径" prop="label">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="组件地址" prop="label">
        <el-input v-model="form.component" />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-switch
          v-model="form.hidden"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      
      <el-form-item label="排序等级" prop="label">
        <el-input type="number" v-model="form.sort" />
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
