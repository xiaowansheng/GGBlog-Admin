<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { Contact } from "./contact.vue";
defineOptions({
  name: "MenuAddAndModifyModal"
});
const emits = defineEmits(["update:show", "updateData"]);
const props = defineProps({
  show: Boolean,
  item: null
});

const { show, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  resetForm();
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Contact>({
  name: "",
  label: "",
  value: "",
  show: 1
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("社交平台名称不能为空!"));
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
          callback(new Error("平台标题不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
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
  form.value = "http://";
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    title="添加菜单配置"
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
      <el-form-item label="社交标题" prop="label">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="社交名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="跳转链接" prop="value">
        <el-input v-model="form.value" />
      </el-form-item>
      <el-form-item label="是否展示" prop="value">
               <el-switch
        class="swich"
          v-model="form.show"
          inline-prompt
          active-text="show"
          inactive-text="hidden"
          :active-value="1"
          :inactive-value="0"
          size="large"
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

