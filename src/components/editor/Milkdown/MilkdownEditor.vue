<script setup lang="ts">
  // "@milkdown/core": "^7.3.0",
  //   "@milkdown/ctx": "^7.3.0",
  //   "@milkdown/plugin-clipboard": "^7.3.0",
  //   "@milkdown/plugin-cursor": "^7.3.0",
  //   "@milkdown/plugin-diagram": "^7.3.0",
  //   "@milkdown/plugin-emoji": "^7.3.0",
  //   "@milkdown/plugin-history": "^7.3.0",
  //   "@milkdown/plugin-indent": "^7.3.0",
  //   "@milkdown/plugin-math": "^7.3.0",
  //   "@milkdown/plugin-prism": "^7.3.0",
  //   "@milkdown/plugin-slash": "^7.3.0",
  //   "@milkdown/plugin-tooltip": "^7.3.0",
  //   "@milkdown/plugin-upload": "^7.3.0",
  //   "@milkdown/preset-commonmark": "^7.3.0",
  //   "@milkdown/prose": "^7.3.0",
  //   "@milkdown/theme-nord": "^7.3.0",
  //   "@milkdown/transformer": "^7.3.0",
  //   "@milkdown/vue": "^7.3.0",
  //   "@prosemirror-adapter/vue": "^0.2.6",

import { Milkdown, useEditor } from "@milkdown/vue";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark } from "@milkdown/preset-commonmark";
import "@milkdown/theme-nord/style.css";
// import { tooltip } from "@milkdown/plugin-tooltip";
// import { menu } from '@milkdown/plugin-menu';
import Tooltip from "./components/Tooltip.vue";
import { tooltipFactory } from "@milkdown/plugin-tooltip";
const tooltip = tooltipFactory("Text");
import Slash from "./components/Slash.vue";
// import { usePluginViewFactory } from '@prosemirror-adapter/vue';

// import { slash } from "@milkdown/plugin-slash";
import { history } from "@milkdown/plugin-history";
import { clipboard } from "@milkdown/plugin-clipboard";
import { cursor } from "@milkdown/plugin-cursor";
import { math } from "@milkdown/plugin-math";

// Don't forget to import the style of katex!
import "katex/dist/katex.min.css";
import { emoji } from "@milkdown/plugin-emoji";
import { diagram } from "@milkdown/plugin-diagram";
import { prism } from "@milkdown/plugin-prism";
// import 'prism-themes/themes/prism-nord.css'
import { indent } from "@milkdown/plugin-indent";
import { upload } from "@milkdown/plugin-upload";
import { ref } from "vue";
const markdown = `# Milkdown Vue Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.`;

// const pluginViewFactory = usePluginViewFactory();
const edirotRef = ref<HTMLDivElement>();
const temp=useEditor((root) => Editor.make()
  .config(nord)
  .config(ctx => {
    ctx.set(rootCtx,root);
    ctx.set(defaultValueCtx, markdown);
    //  ctx.set(tooltip.key, {
    //   view: pluginViewFactory({
    //     component: Slash
    //   }),
    //  })
    //       ctx.set(tooltip.key, {
    //   view: pluginViewFactory({
    //     component: Tooltip
    //   }),
    // })
  })
  // .use(menu)
  // .use(tooltip)
  // .use(slash)
  .use(history)
  .use(clipboard)
  .use(cursor)
  .use(math)
  .use(emoji)
  .use(diagram)
  .use(indent)
  .use(upload)
  .use(commonmark)
  )
// const editor = 
// console.log("temp:", temp);
</script>

<template>
  <!-- <div class="markdownDiv" ref="editorRef"></div> -->
    <Milkdown />
</template>

<style lang="scss" scoped>
// .markdownDiv {
//   height: 500px;
// }
</style>
