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
  show: Boolean
});
const { show } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const photos=ref<string[]>([])
const submitForm = () => {
};

const resetForm = () => {
};
</script>

<template>
  <el-dialog v-model="visiable" :title="'上传图片'" class="form" style="">
    <div class="content">
      <pictures-upload v-model="photos"/>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <!-- <el-button @click="resetForm()">重置</el-button> -->
        <el-button type="primary" @click="submitForm()">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
