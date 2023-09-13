<script setup lang="ts">
import "cherry-markdown/dist/cherry-markdown.css";
import Cherry from "cherry-markdown";
import { onMounted, ref, toRefs, watch } from "vue";
import { onActivated } from "vue";
import { onDeactivated } from "vue";
import { onBeforeMount } from "vue";
import { onBeforeUnmount } from "vue";
import { getOss } from "@/api/upload";
import { reactive } from "vue";
import { buildUUID } from "@pureadmin/utils";

import { ElMessage } from "element-plus";
// 使用下面这个会有跨域的问题
// import { http } from "@/utils/http";
// 而这个不会
import axios from "axios";
// import mermaid from "mermaid";
// import * as echarts from "echarts";
// import katex from "katex";
// import Mathjax from "mathjax";
// import * as pinyin from "./scripts/pinyin/pinyin_dist.js";

defineOptions({
  name: "CherryMarkdown"
});

const ossUrl = import.meta.env.VITE_GLOB_OSS_URL;
const props = defineProps({
  id: {
    type: String,
    default: "cherryMarkdown",
    required: true
  },
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
const { id, value, height, dir } = toRefs(props);

// TODO 同步进行，获取数据后才开始加载页面
// const valueWatch = watch(value, () => {
//   // 获取并设置文章初始内容
//   // console.log("change value：\n", value.value);
//   // TODO BUG  设置初始值时,光标错乱

//   contentValue.value = value.value;
//   cherryInstance.value?.insertValue(value.value, false);

//   // console.log("cherryInstance.value?.getStatus()",cherryInstance.value?.getStatus());
//   // 监听一次,为了获取编辑时的文章内容
//   valueWatch();
// });
const contentValue = ref<string>(value.value);
const cherryInstance = ref<Cherry>();
const cherryDom = ref<HTMLDivElement>();

/**
 * 自定义一个语法
 */
const CustomHookA = Cherry.createSyntaxHook(
  "codeBlock",
  Cherry.constants.HOOKS_TYPE_LIST.PAR,
  {
    makeHtml(str) {
      console.warn("custom hook", "hello");
      return str;
    },
    rule(str) {
      const regex = {
        begin: "",
        content: "",
        end: "",
        reg: null
      };
      regex.reg = new RegExp(regex.begin + regex.content + regex.end, "g");
      return regex;
    }
  }
);
/**
 * 自定义一个自定义菜单
 * 点第一次时，把选中的文字变成同时加粗和斜体
 * 保持光标选区不变，点第二次时，把加粗斜体的文字变成普通文本
 */
const customMenuA = Cherry.createMenuHook("加粗斜体", {
  iconName: "font",
  onClick: function (selection) {
    // 获取用户选中的文字，调用getSelection方法后，如果用户没有选中任何文字，会尝试获取光标所在位置的单词或句子
    let $selection = this.getSelection(selection) || "同时加粗斜体";
    // 如果是单选，并且选中内容的开始结束内没有加粗语法，则扩大选中范围
    if (!this.isSelections && !/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
      this.getMoreSelection("***", "***", () => {
        const newSelection = this.editor.editor.getSelection();
        const isBoldItalic = /^\s*(\*\*\*)[\s\S]+(\1)/.test(newSelection);
        if (isBoldItalic) {
          $selection = newSelection;
        }
        return isBoldItalic;
      });
    }
    // 如果选中的文本中已经有加粗语法了，则去掉加粗语法
    if (/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
      return $selection.replace(
        /(^)(\s*)(\*\*\*)([^\n]+)(\3)(\s*)($)/gm,
        "$1$4$7"
      );
    }
    /**
     * 注册缩小选区的规则
     *    注册后，插入“***TEXT***”，选中状态会变成“***【TEXT】***”
     *    如果不注册，插入后效果为：“【***TEXT***】”
     */
    this.registerAfterClickCb(() => {
      this.setLessSelection("***", "***");
    });
    return $selection.replace(/(^)([^\n]+)($)/gm, "$1***$2***$3");
  }
});
/**
 * 定义一个空壳，用于自行规划cherry已有工具栏的层级结构
 */
const customMenuB = Cherry.createMenuHook("实验室", {
  iconName: ""
});

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
/**
 * 手动上传图片等文件
 * @param formData 
 */
function upload(formData: FormData): Promise<any> {
  return axios.post(ossUrl, formData);
  // return http.post(ossUrl, null, { data: formData });
}
const callbacks = {
  /**
   * 全局的URL处理器
   * @param {string} url 来源url
   * @param {'image'|'audio'|'video'|'autolink'|'link'} srcType 来源类型
   * @returns
   */
  urlProcessor: (
    url: string,
    srcType: "image" | "audio" | "video" | "autolink" | "link"
  ) => url,
  /**
   * 上传文件回调
   */
  fileUpload(
    file: File,
    callback: (path: string, arg: { [key: string]: any }) => void
  ) {
    console.log(file);
    // const fileUrl = URL.createObjectURL(file);
    // console.log("url", fileUrl);
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

      let formData = new FormData();
      for (let key in uploadForm) {
        formData.append(key, uploadForm[key]);
      }
      formData.append("file", file);
      upload(formData)
        .then((data: any) => {
          ElMessage.success(`图片[${info.url}]上传成功。`);
          callback(info.url, {
            name: `${file.name.replace(/\.[^.]+$/, "")}`,
            isShadow: true
          });
        })
        .catch(e => {
          ElMessage.error("图片上传失败！");
          return;
        });
    });
    if (/video/i.test(file.type)) {
      callback(info.url, {
        name: `${file.name.replace(/\.[^.]+$/, "")}`,
        poster: "/favicon.ico",
        isBorder: true,
        isShadow: true,
        isRadius: true,
        width: "300px",
        height: "auto"
      });
    } else {
      callback(info.url, {
        name: `${file.name.replace(/\.[^.]+$/, "")}`,
        isShadow: true
      });
    }
  },
  afterChange: (text: string, html: string) => {
    // 是否改变
    // console.log("text",text);
    // console.log("htmlStr",htmlStr);
    contentValue.value = text;
    emits("update:value", text);
    emits("change", text);
  },
  afterInit: (text: string, html: string) => {
    emits("get", cherryInstance);
  },
  beforeImageMounted: (srcProp: string, src: string) => ({ srcProp, src }),
  // 预览区域点击事件，previewer.enablePreviewerBubble = true 时生效
  onClickPreview: (event: Event) => {},
  // 复制代码块代码时的回调
  onCopyCode: (event: Event, code: string) => {
    // 阻止默认的粘贴事件
    // return false;
    // 对复制内容进行额外处理
    return code;
  },
  // 获取中文的拼音
  changeString2Pinyin: (string: string) => {
    /**
     * 推荐使用这个组件：https://github.com/liu11hao11/pinyin_js
     *
     * 可以在 ../scripts/pinyin/pinyin_dist.js 里直接引用
     */
    // return pinyin.pinyin(string, " ");
    return string;
  }
};

const config = {
  id: id.value,
  value: contentValue.value,
  editor: {
    height: height.value + "px",
    id: "code",
    name: "code",
    autoSave2Textarea: true,
    // defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
    // edit&preview: 双栏编辑预览模式
    // editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
    // previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
    defaultModel: "edit&preview",

    convertWhenPaste: true,

    codemirror: {
      // 是否自动focus 默认为true
      autofocus: true
    }
  },
  // externals: {
  //   echarts: echarts,
  //   katex: katex
  //   // MathJax: MathJax TODO
  // },
  isPreviewOnly: false,
  fileTypeLimitMap: {
    video: "video/*",
    audio: "audio/*",
    image: "image/*",
    word: ".doc,.docx",
    pdf: ".pdf",
    file: "*"
  },
  previewer: {
    dom: false,
    className: "cherry-markdown",
    enablePreviewerBubble: true,
    /**
     * 配置图片懒加载的逻辑
     * - 如果不希望图片懒加载，可配置成 lazyLoadImg = {noLoadImgNum: -1}
     * - 如果希望所有图片都无脑懒加载，可配置成 lazyLoadImg = {noLoadImgNum: 0, autoLoadImgNum: -1}
     * - 如果一共有15张图片，希望：
     *    1、前5张图片（1~5）直接加载；
     *    2、后5张图片（6~10）不论在不在视区内，都无脑懒加载；
     *    3、其他图片（11~15）在视区内时，进行懒加载；
     *    则配置应该为：lazyLoadImg = {noLoadImgNum: 5, autoLoadImgNum: 5}
     */
    lazyLoadImg: {
      // 加载图片时如果需要展示loading图，则配置loading图的地址
      loadingImgPath: "",
      maxNumPerTime: 2,
      // 不进行懒加载处理的图片数量，如果为0，即所有图片都进行懒加载处理， 如果设置为-1，则所有图片都不进行懒加载处理
      noLoadImgNum: 5,
      autoLoadImgNum: 5,
      maxTryTimesPerSrc: 2,
      // 加载一张图片之前的回调函数，函数return false 会终止加载操作
      beforeLoadOneImgCallback: (img: HTMLImageElement) => true,
      // 加载一张图片失败之后的回调函数
      failLoadOneImgCallback: (img: HTMLImageElement) => {},
      // 加载一张图片之后的回调函数，如果图片加载失败，则不会回调该函数
      afterLoadOneImgCallback: (img: HTMLImageElement) => {},
      // 加载完所有图片后调用的回调函数
      afterLoadAllImgCallback: () => {}
    }
  },
  engine: {
    // 全局配置
    global: {
      // 是否启用经典换行逻辑
      // true：一个换行会被忽略，两个以上连续换行会分割成段落，
      // false： 一个换行会转成<br>，两个连续换行会分割成段落，三个以上连续换行会转成<br>并分割段落
      classicBr: false,
      /**
       * 全局的URL处理器
       * @param {string} url 来源url
       * @param {'image'|'audio'|'video'|'autolink'|'link'} srcType 来源类型
       * @returns
       */
      urlProcessor: (url, srcType) => {
        console.log(`url-processor`, url, srcType);
        return url;
      },
      /**
       * 额外允许渲染的html标签
       * 标签以英文竖线分隔，如：htmlWhiteList: 'iframe|script|style'
       * 默认为空，默认允许渲染的html见src/utils/sanitize.js whiteList 属性
       * 需要注意：
       *    - 启用iframe、script等标签后，会产生xss注入，请根据实际场景判断是否需要启用
       *    - 一般编辑权限可控的场景（如api文档系统）可以允许iframe、script等标签
       */
      htmlWhiteList: ""
    },
    // 内置语法配置
    syntax: {
      // 语法开关
      // 'hookName': false,
      // 语法配置
      // 'hookName': {
      //
      // }
      codeBlock: {
        theme: "default",
        // 超出长度是否换行，false则显示滚动条
        wrap: false,
        lineNumber: true,
        // 是否显示“复制”按钮
        copyCode: true
      },
      list: {
        listNested: false,
        // 同级列表类型转换后变为子级
        indentSpace: 2 // 默认2个空格缩进
      },
      table: {
        enableChart: false
        // chartEngine: Engine Class
      },
      fontEmphasis: {
        /**
         * 是否允许首尾空格
         * 首尾、前后的定义： 语法前**语法首+内容+语法尾**语法后
         * 例：
         *    true:
         *           __ hello __  ====>   <strong> hello </strong>
         *           __hello__    ====>   <strong>hello</strong>
         *    false:
         *           __ hello __  ====>   <em>_ hello _</em>
         *           __hello__    ====>   <strong>hello</strong>
         */
        allowWhitespace: false // 是否允许首尾空格
      },
      strikethrough: {
        /**
         * 是否必须有前后空格
         * 首尾、前后的定义： 语法前**语法首+内容+语法尾**语法后
         * 例：
         *    true:
         *            hello wor~~l~~d     ====>   hello wor~~l~~d
         *            hello wor ~~l~~ d   ====>   hello wor <del>l</del> d
         *    false:
         *            hello wor~~l~~d     ====>   hello wor<del>l</del>d
         *            hello wor ~~l~~ d     ====>   hello wor <del>l</del> d
         */
        needWhitespace: false // 是否必须有前后空格
      },
      mathBlock: {
        engine: "MathJax", // katex或MathJax
        src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js", // 如果使用MathJax plugins，则需要使用该url通过script标签引入
        plugins: true // 默认加载插件
      },
      inlineMath: {
        engine: "MathJax" // katex或MathJax
      },
      emoji: {
        useUnicode: false,
        customResourceURL:
          "https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8",
        upperCase: true
      },
      toc: {
        tocStyle: "nested",
        /** 默认只渲染一个目录 */
        allowMultiToc: false
      },
      // 'header': {
      //   strict: false
      // },
      header: {
        /**
         * 标题的样式：
         *  - default       默认样式，标题前面有锚点
         *  - autonumber    标题前面有自增序号锚点
         *  - none          标题没有锚点
         */
        anchorStyle: "default"
      }
    },
    customSyntax: {
      // SyntaxHookClass
      CustomHook: {
        syntaxClass: CustomHookA,
        force: false,
        after: "br"
      }
    }
  },
  toolbars: {
    toolbar: [
      "bold",
      "italic",
      {
        strikethrough: [
          "strikethrough",
          "underline",
          "sub",
          "sup",
          "ruby",
          "customMenuAName"
        ]
      },
      "size",
      "|",
      "color",
      "header",
      "|",
      "drawIo",
      "|",
      "ol",
      "ul",
      "checklist",
      "panel",
      "justify",
      "detail",
      "|",
      "formula",
      {
        insert: [
          "image",
          "audio",
          "video",
          "link",
          "hr",
          "br",
          "code",
          "formula",
          "toc",
          "table",
          "pdf",
          "word",
          "ruby"
        ]
      },
      "graph",
      "togglePreview",
      "settings",
      "codeTheme",
      "export",
      {
        customMenuBName: ["ruby", "audio", "video", "customMenuAName"]
      },
      "theme"
    ],
    toolbarRight: ["fullScreen", "|"],
    bubble: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "sub",
      "sup",
      "quote",
      "ruby",
      "|",
      "size",
      "color"
    ], // array or false
    sidebar: ["mobilePreview", "copy", "theme"],
    customMenu: {
      customMenuAName: customMenuA,
      customMenuBName: customMenuB
    }
  },
  drawioIframeUrl: window.location.origin + "/cherry/drawio_demo.html",

  autoScrollByCursor: true,
  forceAppend: false,
  locale: "zh_CN",
  keydown: [],
  //extensions: [],
  callback: {
    afterChange: callbacks.afterChange,
    afterInit: callbacks.afterInit,
    beforeImageMounted: callbacks.beforeImageMounted,
    onClickPreview: callbacks.onClickPreview,
    onCopyCode: callbacks.onCopyCode,
    changeString2Pinyin: callbacks.changeString2Pinyin
    // beforeImageMounted: callbacks.beforeImageMounted
  },
  fileUpload: callbacks.fileUpload
};
const init = () => {
  console.log("Cherry Markdown 初始化");

  // const registerPlugin = async () => {
  //   const [{ default: CherryMermaidPlugin } /*mermaid*/] = await Promise.all([
  //     import("cherry-markdown/src/addons/cherry-code-block-mermaid-plugin")
  //     // import("mermaid")
  //   ]);
  //   Cherry.usePlugin(CherryMermaidPlugin, {
  //     mermaid // 传入mermaid引用
  //     // mermaidAPI: mermaid.mermaidAPI,
  //   });
  // };

  cherryInstance.value = new Cherry(config);
};
const destroy = () => {};
// init()
// onActivated(init)
onMounted(init);
// onActivated(init);
onBeforeUnmount(destroy);
// onDeactivated(destroy);
</script>

<template>
  <div class="markdown" :id="id" ref="cherryDom"></div>
</template>

<style lang="scss">
.markdown {
  // 不加这个会穿模
  overflow-y: auto;
  width: 100%;
  overflow-x: hidden;
  img {
    max-width: 100%;
  }
}
</style>
<style lang="scss">
// draw.io样式修改，不能加scoped否则不生效
iframe.cherry-dialog-iframe {
  width: 100%;
  height: 100%;
}
// .cherry-dialog {
//   z-index: 9999 !important;
//   .cherry-dialog-iframe {
//     width: 100%;
//     height: 100%;
//   }
// }
</style>
​
