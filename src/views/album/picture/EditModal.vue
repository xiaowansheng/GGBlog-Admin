<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";
import { Picture, updatePicture } from "@/api/picture";
defineOptions({
  name: "PictureEditModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  status: null,
  source:null,
  item: null
});
const { show, item,status,source } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.url = item.value.url;
    form.description = item.value.description;
    form.source = item.value.source;
    form.status = item.value.status;
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
const form = reactive<Picture>({
  id: null,
  albumId:null,
  name: "",
  url:null,
  description: "",
  source: "",
  status: ""
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("照片名称不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  source: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("照片来源不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  status: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("照片状态不能为空!"));
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
        updatePicture(null, { data: form }).then(() => {
          ElMessage({
            message: "修改成功！",
            type: "success"
          });
          emits("refresh");
          visiable.value = false;
        });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.name = "";
  form.description = "";
  form.source = "";
  form.status = "";
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="'编辑照片信息'"
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
    >
      <el-form-item v-if="form.id" label="照片ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="照片名称:" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="照片描述:">
        <el-input
          v-model="form.description"
          :rows="2"
          type="textarea"
          placeholder="照片介绍"
        />
      </el-form-item>
      <el-form-item label="照片来源:" prop="source">
        <el-select v-model="form.source" placeholder="选择状态" size="default">
          <el-option
            v-for="item in source"
            :key="item.name"
            :label="`${item.label}（${item.name}）`"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="照片状态:" prop="status">
        <el-select v-model="form.status" placeholder="选择状态" size="default">
          <el-option
            v-for="item in status"
            :key="item.name"
            :label="`${item.label}（${item.name}）`"
            :value="item.name"
          />
        </el-select>
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
