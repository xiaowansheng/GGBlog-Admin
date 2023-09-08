<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  toRefs,
  watch
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
defineOptions({
  name: "WangEditor"
});
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
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref(value.value);
const valueWatch = watch(value, () => {
  valueHtml.value = value.value;
  editorRef.value?.setValue(value.value, false);
  // 监听一次,为了获取编辑时的文章内容
  valueWatch();
});
const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  emits("get", editor);
};

const mode = ref<string>("default"); // 或 'simple'

const change = () => {
  emits("change", valueHtml.value);
  emits("update:value", valueHtml.value);
};
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="change"
    />
  </div>
</template>

<style lang="scss" scoped></style>
