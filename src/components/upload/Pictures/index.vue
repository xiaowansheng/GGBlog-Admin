<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
// import { UploadFilled } from "@element-plus/icons-vue";
import { getOss } from "@/api/upload";
import { buildUUID } from "@pureadmin/utils";
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadRawFile
} from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
defineOptions({
  name: "PicturesUpload"
});
const props = defineProps({
  value: {
    type: Array<String>,
    default: []
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
const { value, dir, disable } = toRefs(props);
const fileList = ref<UploadUserFile[]>([]);
const getName = (url: string) => {
  if (url) {
    const arr = url.split("/");
    return arr[arr.length - 1];
  } else {
    return url;
  }
};
const valueOneChange=watch(value, () => {
  value.value.forEach((url: string) => {
    console.log("开始：");
    console.log(url);
    
    
    fileList.value.push({
      name: getName(url),
      status: 'success',
      url,
    });
    console.log("结束：");
    console.log(url);
  });
  console.log("value 改变", fileList.value);
  // 回显照片
  valueOneChange()
});
// watch(fileList, () => {
//   console.log("图片列表变化：", fileList.value);

//   emits("update:value", fileList.value);
// });
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log("文件移除", uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const uploadForm: any = reactive({
  policy: "",
  signature: "",
  ossaccessKeyId: ""
});
const info: any = reactive({
  dir: "",
  host: "",
  expire: 0
  // urls: []
});
watch(fileList, (newList, oldList) => {
  console.log("newList", newList);
  console.log("oldList", oldList);
  // return
  // console.log("文件列表改变：");
  if (fileList.value.length && newList.length > oldList.length) {
    const file = fileList.value[fileList.value.length - 1];
    getOss(dir.value).then((data: any) => {
      // 去除默认开头斜杠/
      data.dir = data.dir.replace(/^\//, "");
      console.log("oss:", data);

      // uploadForm.value = data;
      uploadForm.policy = data.policy;
      uploadForm.signature = data.signature;
      uploadForm.ossaccessKeyId = data.accessid;
      uploadForm.key = data.dir + "/" + buildUUID() + `_${file.name}`;
      //
      info.dir = data.dir;
      info.host = data.host;
      info.expire = data.expire;

      console.log("uploadForm", uploadForm);
      console.log("info", info);
      file.url = data.host + "/" + uploadForm.key;
      console.log("当前上传的图片地址：", file.url);

      uploadRef.value!.submit();
    });
  }
});
const success = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
): void => {
  // console.log("图片上传成功", response);
  ElMessage.success("图片上传成功！");
  const arr: string[] = [];
  fileList.value.forEach(imgInfo => {
    arr.push(imgInfo.url);
  });
  emits("update:value", arr);
  console.log("图片list", arr);
};
const error = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
): void => {
  // console.error("图片上传失败",error);
  ElMessage.error("图片上传失败！");
};
const uploadRef = ref();
// const beforeUpload:UploadProps["beforeUpload"] = (rawFile: UploadRawFile): Promise<boolean> => {
//   // TODO 上传时form为空
//   return new Promise((resolve, reject) => {

//     if (fileList.value.length) {
//       const file = fileList.value[0];
//       getOss(dir.value)
//       .then((data: any) => {
//       data.dir = data.dir.replace(/^\//, "");
//       console.log("oss:", data);

//       // uploadForm.value = data;
//       uploadForm.policy = data.policy;
//       uploadForm.signature = data.signature;
//       uploadForm.ossaccessKeyId = data.accessid;
//       uploadForm.key = data.dir + "/" + buildUUID() + `_${file.name}`;
//       //
//       info.dir = data.dir;
//       info.host = data.host;
//       info.expire = data.expire;

//       console.log("uploadForm", uploadForm);
//       console.log("info", info);
//       info.url = data.host + "/" + uploadForm.key;
//         resolve(true);
//       })
//       .catch(() => {
//         console.error("获取oss上传凭证失败。");
//         reject(false);
//       });
//     }

//   });
// };
</script>

<template>
  <div>
    <!-- :before-upload="beforeUpload" -->
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="ossUrl"
      :data="uploadForm"
      :auto-upload="false"
      :drag="true"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="success"
      :on-error="error"
      :disabled="disable"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>
