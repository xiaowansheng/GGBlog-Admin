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
const emits = defineEmits(["change", "get", "update:value"]);
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
      index: 520
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

              if (file.name.indexOf(".wav") > 0) {
                str = `<audio controls="controls" src="${info.url}"></audio>`;
              } else if (file.name.indexOf(".mp4") > 0) {
                str = `<video src="${info.url}"></video>`;
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
.catch(error => { ElMessage.error("图片上传失败！"); vditor.value.enable();
reject(error); }); }) .catch(error => { vditor.value.enable(); reject(error);
}); }); }); vditor.value.enable(); reject(error); }); }) .catch(error => {
vditor.value.enable(); reject(error); }); }); }); } catch (error) { //
处理整个上传过程的错误 vditor.value.enable(); return Promise.reject(error); //
返回一个 rejected 的 Promise } }, } catch (error) { // 处理整个上传过程的错误
vditor.value.enable(); return Promise.reject(error); // 返回一个 rejected 的
Promise } }, } }, } catch (error) { // 处理整个上传过程的错误
vditor.value.enable(); return Promise.reject(error); // 返回一个 rejected 的
Promise } }, } }, } catch (error) { // 处理整个上传过程的错误
vditor.value.enable(); return Promise.reject(error); // 返回一个 rejected 的
Promise } },
