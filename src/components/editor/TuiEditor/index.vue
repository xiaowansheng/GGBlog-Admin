<script setup lang="ts">
import "@toast-ui/editor/dist/toastui-editor.css";
import { onBeforeMount, reactive, ref, toRefs, watch,onMounted } from "vue";
import Editor from "@toast-ui/editor";

defineOptions({
  name: "TuiEditor"
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
const valueWatch = watch(value, () => {
  editorText.value = value.value;
  // 监听一次,为了获取编辑时的文章内容
  valueWatch();
});
const editor = new Editor(defaultOptions);
onMounted(() => {
const defaultOptions = reactive({
  el: editorRef.value,
  height: height.value,
  initialEditType: "markdown",
  previewStyle: "vertical"
});
  editor.getMarkdown();
});
const editorText = ref(value.value);
const editorRef = ref();
const onEditorLoad = () => {
  emits("get", editorRef.value);
  // implement your code
};
const onEditorChange = () => {
  emits("change", editorText.value);
  emits("update:value", editorText.value);
  // implement your code
};
const onEditorCaretChange = () => {
  // implement your code
};
</script>

<template>
  <div ref="editorRef" />
</template>

<style lang="scss" scoped></style>
