<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";

import { addCategory, updateCategory, Category } from "@/api/category";
defineOptions({
  name: "CategoryAddAndEditModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  item: null
});
const { show, item } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  if (item.value?.id) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.description = item.value.description;
    form.hidden = item.value.hidden;
  } else {
    form.id = null;
    resetForm();
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Category>({
  id: null,
  name: "",
  description: "",
  hidden: 0
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value || item.value) {
          callback();
        } else {
          callback(new Error("分类名不能为空!"));
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
        updateCategory(form)
          .then(() => {
            ElMessage({
              message: "修改成功！",
              type: "success"
            });
            emits("refresh");
            visiable.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      } else {
        addCategory(form)
          .then(() => {
            ElMessage({
              message: "保存成功！",
              type: "success"
            });
            emits("refresh");
            visiable.value = false;

            visiable.value = false;
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
  form.name = "";
  form.description = "";
  form.hidden = 0;
};
</script>

<template>
  <div>
    <el-dialog
      v-model="visiable"
      :title="form.id ? '编辑分类信息' : '新增分类信息'"
      class="form"
      style=""
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        status-icon
        onsubmit="return false"
      >
        <el-form-item v-if="form.id" label="ID:">
          <el-input :disabled="true" :value="item?.id" />
        </el-form-item>
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="form.name" placeholder="输入分类名称" />
        </el-form-item>
        <el-form-item label="描述信息:" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.description"
            placeholder="输入描述信息"
          />
        </el-form-item>
        <el-form-item label="是否隐藏:" prop="hidden">
          <el-switch
            v-model="form.hidden"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visiable = false">取消</el-button>
          <el-button v-if="!form.id" @click="resetForm()">重置</el-button>
          <el-button type="primary" v-loading="loading" :disabled="loading" @click="submitForm(formRef)">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
