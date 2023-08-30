<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import { getOss } from "@/api/upload";
import { buildUUID } from "@pureadmin/utils";
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { genFileId } from 'element-plus'
const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
// console.log(ossUrl);

defineOptions({
  name: "SinglePictureUpload"
});
const props = defineProps({
  value: String,
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
const url = ref<string>("");
watch(value, () => {
  url.value = value!.value;
});
watch(url, () => {
  emits("update:value", url.value);
});
const uploadForm: any = reactive({
  policy: "",
  signature: "",
  ossaccessKeyId: "",
  key: "",
  dir: "",
  host: "",
  expire: 0
});
const fileList: any = ref([]);
const success = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
): void => {
  console.log("图片上传成功");
  // console.log(response,uploadFile,uploadFiles);
};
const error = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
): void => {
  console.error("图片上传失败");
};
const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log("UploadChangeParam", uploadFile, uploadFiles);
  // const status = info.status;
  // if (status !== "uploading") {
  //   console.log("info:",info, ",fileList:", uploadFiles);
  // }
  // if (status === "done") {
  //   info.file.thumbUrl =
  //     uploadForm.host +
  //     "/" +
  //     uploadForm.key.replace("${filename}", info.file.name);
  //   // value.value = info.file.thumbUrl;
  //   // value.value=info.file.thumbUrl;
  //   emits("update:value", info.file.thumbUrl);
  //   ElMessage.success(`${info.file.name} 文件上传成功！`);
  // } else if (status === "error") {
  //   ElMessage.error(`${info.file.name} 文件上传失败！！`);
  // }
};
const remove = () => {
  url.value = "";
  console.log("移除图片~~");
};
const beforeUpload = (rawFile: UploadRawFile): Promise<boolean> => {
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
const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
const progress = () => {
  console.log("on-progress");
  
}
</script>

<template>
  <el-upload
  ref="upload"
    class="single-upload"
    name="file"
    method="post"
    :action="ossUrl"
    :data="uploadForm"
    :drag="true"
    :on-remove="remove()"
    :multiple="false"
    :before-upload="beforeUpload"
    :on-chang="handleFileChange"
    :on-exceed="handleExceed"
    list-type="picture"
    :disabled="disable"
    :limit="1"
    :auto-upload="true"
    :show-file-list="true"
    :on-progress="progress"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<style lang="scss" scoped></style>
