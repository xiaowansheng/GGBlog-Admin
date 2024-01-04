<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";
import { Picture, addPicture, addBatchPicture } from "@/api/picture";
import PicturesUpload from "@/components/upload/Pictures/index.vue";
defineOptions({
  name: "PictureEditModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  albumId: {
    String,
    default: null,
    required: true
  }
});
const { show, albumId } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const photos = ref<string[]>([]);
const getName = (url: string) => {
  if (url) {
    const arr = url.split("/");
    return arr[arr.length - 1];
  } else {
    return url;
  }
};
const submitForm = () => {
  if (photos.value.length > 0) {
    loading.value = true;
    const form: any = [];
    photos.value.forEach(photo => {
      form.push({
        albumId: albumId.value,
        url: photo,
        name: getName(photo)
      });
    });

    addBatchPicture(null, { data: form })
      .then(() => {
        emits("refresh");
        ElMessage.success("上传成功！");
        photos.value = [];
        visiable.value = false;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  }
};

// const resetForm = () => {
// };
</script>

<template>
  <el-dialog v-model="visiable" :title="'上传图片'" class="form" style="">
    <div class="content">
      <pictures-upload v-model:value="photos" :dir="'pictures'"/>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <!-- <el-button @click="resetForm()">重置</el-button> -->
        <el-button type="primary" v-loading="loading" :disabled="loading" @click="submitForm()"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
