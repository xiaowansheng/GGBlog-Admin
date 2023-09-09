<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { ReDialog } from "@/components/ReDialog";

/**
 * 加载cherryMarkdown相关插件
 */
// import Cherry from "cherry-markdown";
// import mermaid from 'mermaid';
//    async () => {
//     const [{ default: CherryMermaidPlugin }, /*mermaid*/] = await Promise.all([
//       import("cherry-markdown/src/addons/cherry-code-block-mermaid-plugin"),
//       // import("mermaid")
//     ]);
//     Cherry.usePlugin(CherryMermaidPlugin, {
//       mermaid, // 传入mermaid引用
//       // mermaidAPI: mermaid.mermaidAPI,
//     });
//   };

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === "zh" ? zhCn : en;
    }
  }
});
</script>
