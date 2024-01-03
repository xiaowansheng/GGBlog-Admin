<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onDeactivated,
  unref,
  watch,
  nextTick,
  toRefs,
  reactive
} from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
// import "vditor/dist/js/lute/lute.min.js"
import { buildUUID } from "@pureadmin/utils";
import { getOss } from "@/api/upload";
import axios from "axios";
import { shallowRef } from "vue";
import { ElMessage } from "element-plus";
import emoji from "./emoji.ts";
const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
const props = defineProps({
  value: {
    type: String,
    default: "",
    required: true
  },
  height: { type: Number, default: 360 },
  dir: {
    type: String,
    default: "default"
  }
});
const emits = defineEmits(["change", "get", "update:value", "save"]);
/**
 * 使用节流函数
 */
const saveDraft = () => {
  emits("save", valueRef.value);
}
const { value, height, dir } = toRefs(props);
// markdown实例
const vditor = shallowRef<Vditor | null>(null);
// div元素引用
const contentRef = ref();
// 保存markdown文本
const valueRef = ref<string>(value.value);
// 内容太长时，会有问题
// watch(
//   () => props.value,
//   v => {
//     if (v !== valueRef.value) {
//       instance.getVditor()?.setValue(v);
//     }
//     valueRef.value = v;
//   }
// );
// 是否在初始化
const initedRef = ref(false);
function beforeUpload(file: File) {
  const uploadForm: any = {
    policy: "",
    signature: "",
    ossaccessKeyId: ""
  };
  const info = {
    dir: "",
    host: "",
    expire: 0,
    url: ""
  };
  return new Promise((resolve, reject) => {
    getOss(dir.value)
      .then((data: any) => {
        // console.log("oss:", data);
        // 去除默认开头斜杠/
        data.dir = data.dir.replace(/^\//, "");
        // console.log("oss:", data);
        uploadForm.policy = data.policy;
        uploadForm.signature = data.signature;
        uploadForm.ossaccessKeyId = data.accessid;
        uploadForm.key = data.dir + "/" + buildUUID() + `_${file.name}`;
        //
        info.dir = data.dir;
        info.host = data.host;
        info.expire = data.expire;
        info.url = data.host + "/" + uploadForm.key;
        // console.log(" data.host", data.host);
        // console.log("info.url",info.url);

        resolve({ uploadForm, info });
      })
      .catch(error => {
        reject(error);
      });
  });
}
function upload(formData: FormData): Promise<any> {
  return axios({
    method: "post",
    url: ossUrl,
    data: formData
  });
}

function endsWithAnyIgnoreCase(
  mainString: string,
  suffixes: string[]
): boolean {
  const lowerMainString = mainString.toLowerCase();

  return suffixes.some(suffix =>
    lowerMainString.endsWith(suffix.toLowerCase())
  );
}
const init = () => {
  const contentElement = unref(contentRef) as HTMLElement;
  // contentElement.style.height=height.value+"px"
  console.log("init markdown");
  console.log("vditor", vditor);
  console.log("valueRef", valueRef);

  if (!contentElement) return;
  // console.log("contentElement",contentElement);
  let toolbar = [];
  if (window.innerWidth < 768 || window.innerWidth >= 768) {
    toolbar = [
      {
        hotkey: "⌘S",
        name: "save",
        tipPosition: "s",
        tip: "点击保存",
        className: "vditor-save-icon",
        icon: '<svg t="1701353725483" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1822" width="64" height="64"><path d="M885.44 1024H138.688a139.072 139.072 0 0 1-138.688-138.624V138.688C0.064 62.4 62.528 0 138.752 0h746.688c76.224 0 138.624 62.4 138.624 138.688v746.688A139.072 139.072 0 0 1 885.44 1024zM138.688 64A74.88 74.88 0 0 0 64.064 138.688v746.688A74.88 74.88 0 0 0 138.752 960h746.688a74.88 74.88 0 0 0 74.624-74.624V138.688A74.88 74.88 0 0 0 885.44 64H138.688z" fill="#666666" p-id="1823"></path><path d="M752.064 497.088h-480c-46.912 0-85.312-38.4-85.312-85.312V38.4c0-17.6 14.4-32 32-32h586.688c17.6 0 32 14.4 32 32v373.376c0 46.912-38.4 85.312-85.376 85.312zM250.752 70.4v341.376c0 11.712 9.6 21.312 21.312 21.312h480c11.776 0 21.376-9.6 21.376-21.312V70.4H250.688z" fill="#666666" p-id="1824"></path><path d="M652.352 378.688a32.128 32.128 0 0 1-32-32V197.312c0-17.536 14.4-32 32-32s32 14.464 32 32v149.376c0 17.6-13.888 32-32 32z" fill="#666666" p-id="1825"></path></svg>',
        click() {
          ElMessage.info("正在保存！");
          saveDraft();
        }
      },
      "|",
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "link",
      "|",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "|",
      "quote",
      "line",
      "code",
      "inline-code",
      "insert-before",
      "insert-after",
      "|",
      "upload",
      "record",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "fullscreen",
      "edit-mode",
      {
        name: "more",
        toolbar: [
          "both",
          "code-theme",
          "content-theme",
          "export",
          "outline",
          "preview",
          "devtools",
          "info",
          "help"
        ]
      }
    ];
  }
  vditor.value = new Vditor(contentElement, {
    toolbar,
    toolbarConfig: {
      pin: true
    },
    height: height.value,
    // theme: getDarkMode.value === 'dark' ? 'dark' : 'classic',
    // 设置外观主题
    // theme:"",
    // lang: "",
    mode: "ir",
    fullscreen: {
      index: 999999
    },
    counter: {
      enable: true
    },
    comment: {
      enable: false
    },
    cache: {
      enable: false
      // id: 'markdown',
      // after(html: string): string {
      //   console.log('markdown缓存成功', html);
      //   return html;
      // },
    },
    preview: {
      // theme: {
      //   // 设置内容主题
      // },
      actions: [],
      hljs: {
        lineNumber: true
        // 设置代码块主题
      },
      markdown: {
        paragraphBeginningSpace: false,
        mark: true,
        sanitize: false,
        listStyle: true
        // "toc": true,
      }
    },
    hint: {
      emoji
    },
    upload: {
      accept: "image/*,.mp3,.mp4, .wav",
      multiple: true,
      handler(files: File[]): Promise<string | null> {
        // 上传时编辑器禁用
        vditor.value.disabled();
        // 使用Promise.all简化代码
        Promise.all(
          files.map(async file => {
            try {
              const { uploadForm, info } = await beforeUpload(file);
              const formData = new FormData();
              for (let key in uploadForm) {
                formData.append(key, uploadForm[key]);
              }
              formData.append("file", file);

              const data = await upload(formData);

              vditor.value.disabled();
              let str = "";

              if (
                endsWithAnyIgnoreCase(file.name, [
                  ".mp3",
                  ".wav",
                  ".aac",
                  ".flac",
                  ".ogg",
                  ".m4a",
                  ".aiff",
                  ".aif",
                  ".wma",
                  ".midi",
                  ".mid"
                  // Add other formats as needed
                ])
              ) {
                str = `<audio controls="controls" src="${info.url}"></audio>`;
              } else if (
                endsWithAnyIgnoreCase(file.name, [
                  ".mp4",
                  ".mkv",
                  ".avi",
                  ".mov",
                  ".wmv",
                  ".flv",
                  ".webm",
                  ".m4v",
                  ".3gp",
                  ".mpeg",
                  ".mpg",
                  ".ts"
                  // Add other formats as needed
                ])
              ) {
                str = `<video src="${info.url}"></video>`;
              } else if (
                endsWithAnyIgnoreCase(file.name, [
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".gif",
                  ".bmp",
                  ".tiff",
                  ".tif",
                  ".webp",
                  ".svg"
                  // Add other formats as needed
                ])
              ) {
                str = `![${file.name}](${info.url})`;
              } else {
                str = `![${file.name}](${info.url})`;
                ElMessage.warning(`未知类型素材${file.name}！`);
              }

              vditor.value.insertValue(str);

              if (
                vditor.value.vditor.options.upload &&
                vditor.value.vditor.options.upload.format &&
                vditor.value.vditor.options.upload.filename &&
                contentElement
              ) {
                // 添加相关处理逻辑
              }

              ElMessage.success(`素材${file.name}上传成功。`);
              console.log("链接", info.url);
            } catch (error) {
              ElMessage.error(`素材${file.name}上传失败！`);
              throw error; // 将错误继续抛出，使整个上传过程中断
            }
          })
        )
          .then((data: any) => {
            // 所有文件上传完成后启用编辑器
            vditor.value.enable();
            return Promise.resolve(null); // 成功时返回 null
          })
          .catch(error => {
            // 所有文件上传结束后启用编辑器
            console.error(error);

            vditor.value.enable();
            return Promise.resolve(null); // 成功时返回 null
          });
      }
    },
    outline: {
      enable: true,
      position: "left"
    },
    input: v => {
      valueRef.value = v;
      emits("update:value", v);
      emits("change", v);
    },
    after: () => {
      nextTick(() => {
        console.log("执行完初始化");

        vditor.value.setValue(valueRef.value);
        initedRef.value = true;
        emits("get", instance);
      });
    },
    blur: () => {
      // unref(vditorRef)?.setValue(props.value);
    }
  });
};

const instance = {
  getVditor: (): Vditor | any => vditor.value!
};

function destroy() {
  const vditorInstance = unref(vditor);
  if (!vditorInstance) return;
  try {
    vditorInstance?.destroy?.();
  } catch (error) {}
  vditor.value = null;
  initedRef.value = false;
}
onMounted(init);
// onActivated(init)
onBeforeUnmount(destroy);
onDeactivated(destroy);
</script>

<template>
  <div ref="contentRef"></div>
</template>
