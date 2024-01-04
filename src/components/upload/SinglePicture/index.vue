<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadInstance,
UploadUserFile
} from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { uploadFile as upload } from "@/api/upload";
import type{ FileDto} from "@/api/upload";

defineOptions({
  name: "SinglePictureUpload"
});
const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  disable: {
    type: Boolean,
    default: false
  },
  auto: {
    type: Boolean,
    default: true
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
  }
});
const emits = defineEmits(["update:value"]);

const uploadFile = (): Promise<FileDto> => {
  return new Promise((resolve, reject) => {
    if (uploaded.value) {
      resolve({
        link: url.value
      } as FileDto);
    } else {
      const file:UploadUserFile = fileList.value[0];
      // 处理图片上传
      let form = new FormData();
      form.append("filePath", dir.value);
      form.append("file", file.raw);
      upload(null, {
        data: form
      })
        .then((fileDto: any) => {
          ElMessage.success("图片上传成功！");
          url.value = fileDto.link;
          resolve(fileDto);
        })
        .catch(() => {
          console.error("文件上传失败！");
          reject();
        });
    }
  });
};

const { value, dir, disable,auto }: any = toRefs(props);
const url = ref<string>(value.value);
/**
 * 标记是否已经上传过
 */
const uploaded = ref<boolean>(false);
const valueOneChange = watch(value, () => {
  // 解决照片回显问题
  console.log("image-value更新");
  if (value.value != url.value) {
    url.value = value!.value;
    fileList.value.splice(0);
    uploaded.value = true;
  }
  // valueOneChange()
});

const fileList = ref<UploadUserFile[]>([]);
watch(fileList, () => {
  if (fileList.value.length) {
    // 有文件以后需要重新上传
    uploaded.value = false;
    if (auto.value) {
      uploadFile()
    } else {
      url.value = fileList.value[fileList.value.length-1].url
      console.log("等待上传的文件：",fileList.value[fileList.value.length-1])
    }
  }
});
const remove = () => {
  url.value = "";
  console.log("移除图片~~");
};
const uploadRef = ref<UploadInstance>();

defineExpose({
  uploadFile
});
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
    :drag="true"
    :on-remove="remove"
    :multiple="false"
    :disabled="disable"
    :limit="1"
    :auto-upload="false"
    list-type="picture"
    :show-file-list="false"
  >
    <div
      v-if="!url"
      class="no-img"
      :style="`width: ${width}; height:${height}`"
    >
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
.single-upload {
  .el-upload-dragger {
    padding: 10px;
    .no-img {
      padding-top: 10px;
    }
  }
}
</style>
