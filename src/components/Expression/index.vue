<script setup lang="ts">
import { watch } from "vue";
import { toRefs, ref } from "vue";
// import * as fs from "fs";
defineOptions({
  name: "Expression"
});

const emits = defineEmits(["select","update:visiable"]);
const emojis = [
  [
    "/emoji/one/daxiao.svg",
    "/emoji/one/daku.svg",
    "/emoji/one/shengqi.svg",
    "/emoji/one/yyds.svg",
    "/emoji/one/bizui.svg",
    "/emoji/one/tiaopi.svg",
    "/emoji/one/kelian.svg",
    "/emoji/one/guzhang.svg",

    "/emoji/one/xiaoku.svg",
    "/emoji/one/gandaoyali.svg",
    "/emoji/one/fashao.svg",
    "/emoji/one/koushui.svg",
    "/emoji/one/ku.svg",
    "/emoji/one/baiyan.svg",
    "/emoji/one/ganga.svg",
    "/emoji/one/zhouma.svg",

    "/emoji/one/weixiao.svg",
    "/emoji/one/qinqin.svg",
    "/emoji/one/yun.svg",
    "/emoji/one/fadai.svg",
    "/emoji/one/tu.svg",
    "/emoji/one/chigua.svg",
    "/emoji/one/yiwen.svg",
    "/emoji/one/jingya.svg",

    "/emoji/one/ningmengjing.svg",
    "/emoji/one/shuijiao.svg",
    "/emoji/one/sikao.svg",
    "/emoji/one/fendou.svg",
    "/emoji/one/heilian.svg",
    "/emoji/one/kouzhao.svg",
    "/emoji/one/haixiu.svg",
    "/emoji/one/tanqi.svg",

    "/emoji/one/qingzhu.svg",
    "/emoji/one/fenlie.svg",
    "/emoji/one/shihua.svg",
    "/emoji/one/bianbian.svg",
    "/emoji/one/kulou.svg",
    "/emoji/one/caihongma.svg",
    "/emoji/one/zhadan.svg",
    "/emoji/one/anzhongguancha.svg"
  ],
];
/**
 * 获取图片名称
 * @param url 
 */
const getName = (url: string) => {
  if (!url) {
    return ""
  }
  const path = url.split("/")
  const name = path[path.length - 1]
  return name
}

const show =ref<boolean>()
</script>

<template>
    <!-- title="表情" -->
  <el-popover
  v-model:visible="show"
    placement="bottom"
    trigger="click"
    :width="360"
    popper-class="emoji-popover"
  >
    <div class="emoji-content">
      <!-- <h1>表情包</h1> -->
      <el-tabs value="one" type="border-card" class="emoji-tabs">
        <el-tab-pane v-for="(item) in emojis">
          <template #label>
            <img class="tag-name" :src="item[0]" alt="" />
          </template>
          <div class="images">
            <img @click="emits('select',url);show=false" v-for="url in item" :src="url" alt="" />
          </div>
        </el-tab-pane>

      </el-tabs>
      <div></div>
    </div>
    <template #reference>
      <slot name="default"></slot>
    </template>
  </el-popover>
</template>
<style lang="scss">
.emoji-popover {
  // width: 520px;
}
</style>
<style lang="scss" scoped>
.el-popover {
  .emoji-content {
    .tag-name {
      width: 30px;
      height: 30px;
    }

    .emoji-tabs {
      .images {
        height: 190px;
        overflow-y: auto;
        display: grid;
        gap: 5px;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

        img:hover {
          background-color: rgb(218, 228, 230);
        }
        img:active {
          background-color: rgb(171, 222, 229);
        }
      }
        .images::-webkit-scrollbar {
          width: 0px;
        }
    }
  }
}
</style>
