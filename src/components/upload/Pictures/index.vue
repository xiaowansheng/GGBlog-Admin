<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { defineExpose, defineProps, defineEmits, defineOptions } from "vue";
import {
  ElMessage,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadRawFile
} from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";

import type{ FileDto} from "@/api/upload";
import { uploadFile as upload } from "@/api/upload";
defineOptions({
  name: "PicturesUpload"
});
const props = defineProps({
  value: {
    type: Array<String>,
    default: []
  },
  auto: {
    type: Boolean,
    default: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  dir: {
    type: String,
    default: "default"
  }
});
const emits = defineEmits(["update:value"]);
const { value, dir, disable, showFileList, auto } = toRefs(props);
const fileList = ref<UploadUserFile[] | any>([]);
const getName = (url: string) => {
  if (url) {
    const arr = url.split("/");
    return arr[arr.length - 1];
  } else {
    return url;
  }
};
// /**
//  * 查找第一个数组中在第二个数组里没有的数据加到第二个数组里
//  * @param firstArray
//  * @param secondArray
//  */
function addMissingData(firstArray: any[], secondArray: any[]): void {
  // 查找第一个数组中在第二个数组中没有的数据
  const newData = firstArray.filter(
    url =>
      !secondArray.some(item2 => {
        // console.log(item1,item2,item2.url == url);
        return item2.url == url;
      })
  );
  console.log("newData", newData);

  newData.forEach(url => {
    fileList.value.push({
      url,
      name: getName(url)
    });
  });
}
function deleteMoreData(firstArray: any[], secondArray: any[]): void {
  const urlSet = new Set(firstArray.map(item => item.url));

  // 查找第二个数组中多余的数据并删除
  for (let i = secondArray.length - 1; i >= 0; i--) {
    const item = secondArray[i];
    if (!urlSet.has(item.url)) {
      secondArray.splice(i, 1);
    }
  }
}
const valueOneChange = watch(value, (newValue, oldValue) => {
  console.log(newValue, oldValue);

  if (fileList.value.length == 0) {
    value.value.forEach((url: string) => {
      // console.log("开始：");
      console.log(url);
      const name = getName(url);
      fileList.value.push({
        name: name,
        status: "success",
        url: url,
        fileDto: {
          name,
          link: url
        } as FileDto
      });
    });
    // 回显照片
  } else if (newValue.length < fileList.value.length) {
    deleteMoreData(newValue, fileList.value);
  } else {
    addMissingData(newValue, fileList.value);
  }
  // valueOneChange();
});
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
/**
 * 当文件添加或删除时，调用该方法，反馈实时数据给父组件
 * @param uploadFiles
 */
const handleFileChange = (uploadFiles: any) => {
  const arr: string[] = [];
  fileList.value.forEach(imgInfo => {
    arr.push(imgInfo.url);
  });
  emits("update:value", arr);
  console.log("图片list", arr);
};
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log("文件移除", uploadFile, uploadFiles);
  handleFileChange(uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const uploadFile = (): Promise<FileDto[]> => {
  return new Promise((resolve, reject) => {
    // 批量上传所有文件
    // 把所有文件加入upload上传批量处理中
    const uploadPromises = [];

    for (let i = 0; i < fileList.value.length; i++) {
      const file = fileList.value[i];
      if (file.status === "success") {
        continue;
      }
      let form = new FormData();
      form.append("filePath", dir.value);
      form.append("file", file.raw);
      // Create a promise for each file upload
      const uploadPromise = upload(null, {
        data: form
      })
        .then((fileDto: any) => {
          ElMessage.success(`图片【${fileDto.name}】上传成功！`);
          file.url = fileDto.link;
          file.status = "success";
          file.fileDto = fileDto;

          return fileDto; // Return the result to be used later
        })
        .catch(() => {
          console.error("文件上传失败！");
          ElMessage.success(`图片【${file.name}】上传失败！`);
          file.status = "error";
          throw new Error("File upload failed");
        });

      uploadPromises.push(uploadPromise);
    }

    // Wait for all promises to settle
    Promise.all(uploadPromises)
      .then((results:FileDto[]) => {
        // Check if all uploads were successful
        if (fileList.value.every(item => item.status === "success")) {
          // Update links array
          const urls = fileList.value.map(item => item.url);
          emits("update:value", urls);
          // Resolve with all response results
          resolve(results);
        } else {
          reject(new Error("Some file uploads failed"));
        }
      })
      .catch(error => {
        console.error("Error during file uploads:", error);
        reject(error);
      });
  });
};

watch(fileList, (newList, oldList) => {
  if (fileList.value.length && newList.length > oldList.length) {
    if (auto.value) {
      uploadFile();
    } else {
      if (newList.length > oldList.length) {
        console.log(
          "等待上传的文件：",
          fileList.value[fileList.value.length - 1]
        );
      }
    }
  }
});

const uploadRef = ref();

defineExpose({
  uploadFile
});
</script>

<template>
  <div>
    <!-- :before-upload="beforeUpload" -->
    <el-upload
      class="pictures-uplaod"
      ref="uploadRef"
      v-model:file-list="fileList"
      :auto-upload="false"
      :drag="true"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :disabled="disable"
      :show-file-list="showFileList"
    >
      <!-- 默认触发文件选择框的内容 -->
      <slot name="default">
        <el-icon><Plus /></el-icon>
      </slot>
    </el-upload>

    <el-dialog v-if="showFileList" v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>
<style lang="scss">
.pictures-uplaod {
  // overflow: hidden;
  .el-upload-dragger {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
