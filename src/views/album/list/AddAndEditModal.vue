<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";
import { Album, addAlbum, updateAlbum } from "@/api/album";
import SinglePictureUpload from "@/components/upload/SinglePicture/index.vue";
defineOptions({
  name: "AlbumAddAndModifyModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  status: null,
  item: null
});
const { show, item } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.cover = item.value.cover;
    form.description = item.value.description;
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
const form = reactive<Album>({
  id: null,
  name: "",
  cover: "",
  description: "",
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
          callback(new Error("相册名称不能为空!"));
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
          callback(new Error("相册封面不能为空!"));
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
          callback(new Error("相册状态不能为空!"));
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
      if (form.id) {
        updateAlbum(null, { data: form })
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
        addAlbum(null, { data: form })
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
  form.name = "";
  form.cover = "";
  form.description = "";
  form.status = "";
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="form.id ? '修改相册信息' : '新增相册信息'"
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
      <el-form-item v-if="form.id" label="相册ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="相册名称:" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="相册封面:" prop="cover">
        <single-picture-upload
          v-model:value="form.cover"
          :height="'160px'"
          :width="'320px'"
        />
        <el-input v-model="form.cover" />
      </el-form-item>
      <el-form-item label="相册描述:">
        <el-input
          v-model="form.description"
          :rows="2"
          type="textarea"
          placeholder="相册介绍"
        />
      </el-form-item>
      <el-form-item label="相册状态:" prop="status">
        <el-select v-model="form.status" placeholder="选择状态" size="default">
          <el-option
            v-for="item in status"
            :key="item.name"
            :label="item.label"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button v-loading="loading" :disabled="loading" type="primary" @click="submitForm(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
