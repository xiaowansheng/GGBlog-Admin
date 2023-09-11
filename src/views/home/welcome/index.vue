<script setup lang="ts">
import "@/assets/welcome/css/main.css";
import { http } from "@/utils/http";
import { onMounted } from "vue";
import { ref } from "vue";

import { getMenuConfig } from "@/api/config";
import Menu from "@/views/settings/mainpage/menu";

import { getWebsiteConfig } from "@/api/config";
import { WebInfo } from "@/views/settings/website/WebInfo";
//
defineOptions({
  name: "Welcome"
});
// 结果样例
const data = ref({
  id: 5317,
  uuid: "35ad705c-a85a-45c0-b017-a6280238d718",
  hitokoto: "就算没有意义，偶尔也会有好事发生。",
  type: "a",
  from: "终末少女旅行",
  from_who: "尤莉",
  creator: "yuuna",
  creator_uid: 5606,
  reviewer: 4756,
  commit_from: "web",
  created_at: "1585105300",
  length: 17
});
const home = ref<string>("https://wbxnl.com");
const github = ref<string>("https://github.com/xiaowansheng");
const sentence = ref<string>(data.value.hitokoto);
const cover = ref<string>("");
/**
 * 从一言获取好词好句
 * https://hitokoto.cn/
 */
const getData = () => {
  http
    .get<any, any>("https://v1.hitokoto.cn?min_length=10")
    .then((yiyan: any) => {
      data.value = yiyan;
      sentence.value = yiyan.hitokoto;
    });
  getMenuConfig().then((data: any) => {
    if (data) {
      data.value = JSON.parse(data.value);
      const name = "Welcome";
      if (Array.isArray(data.value)) {
        data.value.forEach((co: Menu) => {
          if (co.name == name) {
            cover.value = co.url;
          }
        });
        if (!cover.value) {
          console.error("欢迎页的封面图【" + name + "】未配置。");
        }
      }
    }
  });
  getWebsiteConfig().then((data: any) => {
    if (data) {
      const info: WebInfo = JSON.parse(data.value);
      home.value = info.website;
      github.value = info.github;
    }
  });
};
onMounted(getData);
</script>

<template>
  <div>
    <div class="site">
      <a class="sr-only skip-link" href="#main">Skip to content</a>

      <!-- Options headline effects: .rotate | .slide | .zoom | .push | .clip -->
      <section class="clearfix hero-section hero-section--image clip">
        <div class="hero-section__wrap">
          <div class="hero-section__option">
            <!-- 使用v-if指令根据条件切换图片 -->
            <img v-if="cover" :src="cover" alt="欢迎页封面" />
            <img
              v-else 
              src="@/assets/welcome/images/lanyangyang.jpg" alt="欢迎页封面" 
            />
          </div>
          <!-- .hero-section__option -->

          <div class="container">
            <div class="row">
              <div class="offset-lg-2 col-lg-8">
                <div class="text-center title-01 title-01--11">
                  <h2 class="title__heading">
                    <span>Welcome To </span>
                    <span> &ensp;</span>
                    <strong class="hero-section__words">
                      <span class="title__effect is-visible"> GGBlog </span>
                    </strong>
                  </h2>
                  <div class="title__description">
                    {{ sentence }}
                  </div>

                  <!-- Options btn color: .btn-success | .btn-info | .btn-warning | .btn-danger | .btn-primary -->
                  <div class="title__action">
                    <a :href="home" target="_blank" class="btn btn-success"
                      >GO TO HOME</a
                    >
                    <a :href="github" target="_blank" class="btn btn-success"
                      >GO TO GITHUB</a
                    >
                  </div>
                </div>
                <!-- .title-01 -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- <div class="button-group">
    <a href="index-color.html" class="btn btn-outline-success button-sm"
      >Color</a
    >
    <a href="index-slider.html" class="btn btn-outline-success button-sm"
      >Slider</a
    >
    <a href="index-video.html" class="btn btn-outline-success button-sm"
      >Video Background</a
    >
  </div> -->
  </div>
</template>
<style lang="scss" scoped>
.title__action {
  a {
    margin: 8px 5px;
  }
}
// img{
//    object-fit:cover;
//    object-position: center center;
// }
</style>