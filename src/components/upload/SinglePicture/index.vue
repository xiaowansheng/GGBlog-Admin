<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import { getOss } from "@/api/upload";
import { buildUUID } from "@pureadmin/utils";
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadInstance,
} from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
defineOptions({
  name: "SinglePictureUpload"
});
const props = defineProps({
  value: {
    type: String,
    default:""
  },
  disable: {
    type: Boolean,
    default: false
  },
  dir: {
    type: String,
    default: "default"
  },
  height: {
    type: String,
    default: "250px"
  },
  width: {
    type: String,
    default: "250px"
  },
});
const emits = defineEmits(["update:value"]);

const { value, dir, disable }: any = toRefs(props);
const url = ref<string>(value.value);
const valueOneChange=watch(value, () => {
  console.log(("image-value更新"));

  url.value = value!.value;
  // 解决照片回显问题
  valueOneChange()
})

// const setUrl=(val:string)=>{
// url.value=val
// }
// watch(url, () => {
//   emits("update:value", url.value);
// });
const uploadForm: any = reactive({
  policy: "",
  signature: "",
  ossaccessKeyId: ""
});
const info: any = reactive({
  dir: "",
  host: "",
  expire: 0,
  url: ""
});
const fileList: any = ref([]);
watch(fileList, () => {
  // console.log("文件列表改变：");
  if (fileList.value.length) {
    const file = fileList.value[0];
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
      info.url = data.host + "/" + uploadForm.key;
      uploadRef.value?.submit();
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
  url.value = info.url;
  emits("update:value", url.value);
  console.log("图片链接：", info.url);
};
const error = (
  error: Error,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
): void => {
  // console.error("图片上传失败",error);
  ElMessage.error("图片上传失败！");
};
// const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
//   console.log("UploadChangeParam123", uploadFile, uploadFiles);
//   // const status = info.status;
//   // if (status !== "uploading") {
//   //   console.log("info:",info, ",fileList:", uploadFiles);
//   // }
//   // if (status === "done") {
//   //   info.file.thumbUrl =
//   //     uploadForm.host +
//   //     "/" +
//   //     uploadForm.key.replace("${filename}", info.file.name);
//   //   // value.value = info.file.thumbUrl;
//   //   // value.value=info.file.thumbUrl;
//   //   emits("update:value", info.file.thumbUrl);
//   //   ElMessage.success(`${info.file.name} 文件上传成功！`);
//   // } else if (status === "error") {
//   //   ElMessage.error(`${info.file.name} 文件上传失败！！`);
//   // }
// };
const remove = () => {
  url.value = "";
  console.log("移除图片~~");
};
// async function beforeUpload(rawFile: UploadRawFile) {
//   try {
//     const data: any = await getOss(dir.value);
//     console.log("oss:", data);
//     // uploadForm.value = data;
//     uploadForm.policy = data.policy;
//     uploadForm.signature = data.signature;
//     uploadForm.ossaccessKeyId = data.accessid;
//     //
//     uploadForm.key = data.dir + "/" + buildUUID() + `_${rawFile.name}`;
//     uploadForm.dir = data.dir;
//     uploadForm.host = data.host;
//     uploadForm.expire = data.expire;
//     console.log("uploadForm", uploadForm);
//     return true;
//   } catch (e) {
//     console.error("获取oss上传凭证失败。");
//     return false;
//   }

//   // TODO 上传时form为空
//   // return new Promise((resolve, reject) => {
//   //   getOss(dir.value)
//   //     .then((data: any) => {
//   //       console.log("oss:", data);
//   //       // uploadForm.value = data;
//   //       uploadForm.policy = data.policy;
//   //       uploadForm.signature = data.signature;
//   //       uploadForm.ossaccessKeyId = data.accessid;
//   //       //
//   //       uploadForm.key = data.dir + "/" + buildUUID() + `_${rawFile.name}`;
//   //       uploadForm.dir = data.dir;
//   //       uploadForm.host = data.host;
//   //       uploadForm.expire = data.expire;
//   //       console.log("uploadForm", uploadForm);
//   //       resolve(true);
//   //     })
//   //     .catch(() => {
//   //       console.error("获取oss上传凭证失败。");
//   //       reject(false);
//   //     });
//   // });
// }
const uploadRef = ref<UploadInstance>();
</script>

<template>
  <!-- :before-upload="beforeUpload" -->
    <!-- :on-change="handleFileChange" -->
  <el-upload
    ref="uploadRef"
    class="single-upload"
    name="file"
    method="post"
    v-model:file-list="fileList"
    :action="ossUrl"
    :data="uploadForm"
    :drag="true"
    :on-remove="remove"
    :on-error="error"
    :on-success="success"
    :multiple="false"
    list-type="picture"
    :disabled="disable"
    :limit="1"
    :auto-upload="false"
    :show-file-list="false"
  >
  <div v-if="!url" class="no-img" :style="`width: ${width}; height:${height}`">
    
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖拽上传 或 <em>点击上传</em></div>
  </div>
    <div v-if="url" class="img" :style="`width: ${width}; height:${height}`">
      <el-image style="width: 100%; height: 100%" :src="url" :fit="'cover'" />
    </div>
    <!-- <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template> -->
  </el-upload>
</template>
<style lang="scss">
.single-upload{
  .el-upload-dragger{
    padding: 10px;
    .no-img{
      padding-top: 10px;
    }
  }
}
</style>
