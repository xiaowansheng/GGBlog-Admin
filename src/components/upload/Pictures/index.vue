<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { getOss } from "@/api/upload";
import { buildUUID } from "@pureadmin/utils";
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadRawFile
} from "element-plus";
import { genFileId } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { string } from "vue-types";

const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
defineOptions({
  name: "PicturesUpload"
});
const props = defineProps({
  value: {
    type: Array,
    default:[]
  },
  disable: {
    type: Boolean,
    default: false
  },
  dir: {
    type: String,
    default: "default"
  }
});
const emits = defineEmits(["update:value"]);
const { value, dir, disable }: any = toRefs(props);
const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  },
  {
    name: "plant-1.png",
    url: "/images/plant-1.png"
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  },
  {
    name: "plant-2.png",
    url: "/images/plant-2.png"
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  },
  {
    name: "figure-1.png",
    url: "/images/figure-1.png"
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  },
  {
    name: "figure-2.png",
    url: "/images/figure-2.png"
  }
]);
watch(
  fileList,
  () => {
    console.log("图片列表变化：",fileList.value);
    
    emits("update:value", fileList.value);
  },
  {
    deep: true
  }
);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const uploadForm: any = reactive({
  policy: "",
  signature: "",
  ossaccessKeyId: "",
  key: "",
  dir: "",
  host: "",
  expire: 0
});
const beforeUpload:UploadProps["beforeUpload"] = (rawFile: UploadRawFile): Promise<boolean> => {
  // TODO 上传时form为空
  return new Promise((resolve, reject) => {
    getOss(dir.value)
      .then((data: any) => {
        console.log("oss:", data);
        // uploadForm.value = data;
        uploadForm.policy = data.policy;
        uploadForm.signature = data.signature;
        uploadForm.ossaccessKeyId = data.accessid;
        //
        uploadForm.key = data.dir + "/" + buildUUID() + `_${rawFile.name}`;
        uploadForm.dir = data.dir;
        uploadForm.host = data.host;
        uploadForm.expire = data.expire;
        console.log("uploadForm", uploadForm);
        resolve(true);
      })
      .catch(() => {
        console.error("获取oss上传凭证失败。");
        reject(false);
      });
  });
};
</script>

<template>
  <div>
    <el-upload
    v-model:file-list="fileList"
    :action="ossUrl"
    :data="uploadForm"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  </div>
</template>
