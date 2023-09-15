<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { Talk, addTalk, updateTalk, getTalkById } from "@/api/talk";
import { NameLabelDto, getContentStatus } from "@/api/common";
import PicturesUpload from "@/components/upload/Pictures/index.vue";
import { ElMessage } from "element-plus";
import Expression from "@/components/Expression/index.vue";
import { useDetail } from "@/hooks/routerUtils";
const { initToDetail, getParameter, closeToPage } = useDetail();
defineOptions({
  name: "TalkPublish"
});
onBeforeMount(() => {
  if (getParameter?.id) {
    initToDetail();
    talkForm.id = Number.parseInt(getParameter.id.toString());
    // console.log("talk-id：", talkForm.id);
    getData(talkForm.id);
  }
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
    if (data && data.length && !getParameter.id) {
      talkForm.status = data[0].name;
    }
  });
});
const getData = (id: number) => {
  if (id) {
    getTalkById(id).then((data: any) => {
      talkForm.content = data.content;
      try {
        talkForm.images = JSON.parse(data.images);
        //         const arr = JSON.parse(data.images);
        // arr.forEach(img => {

        // talkForm.images.push(img)
      } catch (e) {
        console.error("images不是数组");
        talkForm.images = [];
      }
      talkForm.status = data.status;
      talkForm.top = data.top;
    });
  }
};
const inputRef = ref<HTMLDivElement>();
const contentStatus = ref<NameLabelDto[]>([]);
const talkForm = reactive<Talk>({
  id: null,
  content: "",
  images: [],
  status: "",
  top: 0
});
const loading = ref(false);
const submit = () => {
  talkForm.content = inputRef.value.innerHTML;
  const newTalkStr = JSON.stringify(talkForm);
  const newTalk = JSON.parse(newTalkStr);
  newTalk.images = JSON.stringify(newTalk.images);

  if (!talkForm.content && (!talkForm.images || talkForm.images.length == 0)) {
    ElMessage.warning("内容不能为空哦，请输入内容后再发布~");
    return;
  }
  loading.value = true;
  if (talkForm.id) {
    updateTalk(null, { data: newTalk })
      .then(() => {
        ElMessage.success("修改成功！");
        closeToPage("TalkList");

        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  } else {
    addTalk(null, { data: newTalk })
      .then(() => {
        ElMessage.success("发布成功！");
        closeToPage("TalkList");

        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  }
};

/**
 * 保存最后一次的编辑框光标信息副本
 */
let lastRange = null;
/**
 * 获取输入框光标
 */
const setlastRange = () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  if (range) {
    const preSelectionRange = range.cloneRange();
    lastRange = preSelectionRange;
  } else {
    lastRange = null;
  }
};
const selectEmoji = (url: string) => {
  if (!inputRef.value) {
    return;
  }
  const img = document.createElement("img");
  img.src = url;

  const selection = window.getSelection();
  const editableDiv = inputRef.value;

  // 检查 editableDiv 是否为空
  if (editableDiv.childNodes.length === 0) {
    const textNode = document.createTextNode("");
    editableDiv.appendChild(textNode);
  }
  if (!lastRange) {
    lastRange = document.createRange();
    lastRange.setStartAfter(editableDiv.childNodes[0]);
    lastRange.setEndAfter(editableDiv.childNodes[0]);
    lastRange = lastRange;
  }

  console.log(editableDiv.childNodes);

  lastRange.insertNode(img); // 在光标位置前插入图片

  // 将光标位置调整到图片之后
  lastRange.setStartAfter(img);

  lastRange.setEndAfter(img);

  selection.removeAllRanges();
  selection.addRange(lastRange);
  // 打印插入图片后的 HTML 结构
  // console.log(inputRef.value.innerHTML);
};
</script>

<template>
  <div class="talk-publish">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">{{ talkForm.id ? "编辑说说" : "发布说说" }}</span>
          <!-- <el-button class="button">刷新数据</el-button> -->
        </div>
      </template>
      <div class="content">
        <div class="text">
          <!-- <el-input
            v-model="talkForm.content"
            :rows="8"
            type="textarea"
            placeholder="记录下今天的状态和心情~~~"
          /> -->
          <div
            ref="inputRef"
            @keyup="setlastRange"
            @click="setlastRange"
            class="input"
            contenteditable="true"
            v-html="talkForm.content"
          ></div>
        </div>
        <div class="operation">
          <div class="left">
            <div class="op">
              <Expression @select="selectEmoji">
                <template #default>
                  <svg
                    t="1694501355830"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2410"
                  >
                    <path
                      d="M512 989.866667a477.866667 477.866667 0 1 0 0-955.733334 477.866667 477.866667 0 0 0 0 955.733334z"
                      fill="#FFB92E"
                      p-id="2411"
                    ></path>
                    <path
                      d="M697.5488 642.594133a40.96 40.96 0 0 1 18.363733 54.954667 210.1248 210.1248 0 0 1-48.264533 60.074667c-40.7552 36.2496-92.842667 58.1632-155.648 58.1632-62.805333 0-114.8928-21.845333-155.648-58.1632a210.1248 210.1248 0 0 1-48.264533-60.074667 40.96 40.96 0 0 1 69.4272-42.871467l3.8912 6.280534c3.822933 7.645867 13.585067 21.435733 29.354666 35.498666 26.487467 23.483733 59.528533 37.410133 101.239467 37.410134 41.642667 0 74.752-13.9264 101.239467-37.410134 13.175467-11.741867 22.1184-23.210667 26.965333-31.197866l2.389333-4.3008a40.96 40.96 0 0 1 54.954667-18.363734zM679.253333 327.68a40.96 40.96 0 0 1 40.277334 33.5872l0.682666 7.3728v23.893333a40.96 40.96 0 0 1-81.237333 7.3728l-0.682667-7.3728V368.64a40.96 40.96 0 0 1 40.96-40.96z m-334.506666 0a40.96 40.96 0 0 1 40.277333 33.5872l0.682667 7.3728v23.893333a40.96 40.96 0 0 1-81.237334 7.3728l-0.682666-7.3728V368.64a40.96 40.96 0 0 1 40.96-40.96z"
                      fill="#FFFFFF"
                      p-id="2412"
                    ></path>
                  </svg>
                </template>
              </Expression>
            </div>
            <div class="op">
              <pictures-upload
                class="pictures"
                v-model:value="talkForm.images"
                dir="talk"
                :list-type="'text'"
                :show-file-list="false"
              >
                <template #default>
                  <svg
                    t="1694501476033"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4500"
                  >
                    <path
                      d="M821.8624 213.4016c-90.5216-0.1536-181.0944-0.0512-271.616-0.0512s-181.0944-0.1024-271.616 0.0512c-67.4816 0.1024-98.3552 30.5664-98.4064 97.4848-0.1536 162.0992-0.1536 324.1472 0 486.2464 0.0512 67.3792 30.5664 97.8432 98.3552 97.9456 181.0944 0.2048 362.1888 0.2048 543.2832 0 65.6896-0.1024 97.1776-31.744 97.2288-96.6656 0.0512-162.9184 0.0512-325.7856 0-488.704-0.0512-65.0752-31.3856-96.1536-97.2288-96.3072z m-496.9472 50.2272c46.1824 0 83.6096 37.4272 83.6096 83.6096s-37.4272 83.6096-83.6096 83.6096-83.6096-37.4272-83.6096-83.6096 37.4784-83.6096 83.6096-83.6096z m453.0688 483.6352H250.9312c-12.3904 0-19.4048-14.1312-11.9808-23.9616 30.5664-40.4992 91.4944-121.2928 116.8384-154.9312a14.94016 14.94016 0 0 1 23.4496-0.5632c20.2752 24.4224 60.9792 73.1136 81.1008 97.2288 6.0928 7.3216 17.408 7.168 23.2448-0.3584 27.2896-34.8672 96.1024-122.7776 123.7504-158.3104a14.9504 14.9504 0 0 1 23.7568 0.1536c32.4608 42.9056 121.344 165.12 159.0272 216.9856 7.168 9.8816 0.1024 23.7568-12.1344 23.7568z"
                      fill="#9bc6fc"
                      p-id="4501"
                    ></path>
                    <path
                      d="M835.6352 711.2704c-45.8752-61.4912-132.5056-175.6672-171.264-226.7136-10.4448-13.7728-30.976-11.264-37.7344-1.6896-30.8736 43.6736-105.0112 147.8144-135.5264 190.6688-6.5536 9.216-19.1488 9.4208-26.0096 0.4608-22.528-29.6448-45.3632-70.6048-68.0448-100.6592-6.912-9.1136-19.712-8.8064-26.2144 0.7168-28.2624 41.3184-96.4096 140.6976-130.56 190.5152-8.3456 12.1344-0.4096 29.4912 13.3632 29.4912h531.0976c75.776-0.0512 71.2192-58.88 50.8928-82.7904z"
                      fill="#FEC963"
                      p-id="4502"
                    ></path>
                    <path
                      d="M335.3088 357.9392m-95.6416 0a95.6416 95.6416 0 1 0 191.2832 0 95.6416 95.6416 0 1 0-191.2832 0Z"
                      fill="#FEC963"
                      p-id="4503"
                    ></path>
                    <path
                      d="M811.6736 122.7264c-69.5296-0.1024-139.0592-0.1024-208.64-0.0512H423.7312c-69.376 0-138.7008-0.0512-208.0768 0.0512-86.784 0.1536-130.8672 43.8784-130.9696 129.9456-0.2048 174.848-0.2048 354.304 0 533.4016 0.1024 86.4768 44.1344 130.3552 130.9184 130.4576a290862.36672 290862.36672 0 0 0 595.968 0c84.7872-0.1024 129.6384-44.7488 129.6384-129.0752 0.0512-178.688 0.0512-357.376 0-536.1152 0-83.968-44.8-128.4608-129.536-128.6144z m83.5072 664.7296c0 58.88-24.2688 82.944-83.6096 82.9952-194.6624 0.256-395.1616 0.256-595.8656 0-61.7984-0.0512-84.8384-22.9376-84.8896-84.4288-0.2048-179.0464-0.2048-358.5024 0-533.3504 0.0512-60.2624 23.8592-83.8144 84.9408-83.9168 39.5776-0.0512 79.1552-0.1024 118.784-0.1024h268.544c69.5296-0.0512 139.008-0.0512 208.5376 0.0512 59.3408 0.1024 83.5584 24.0128 83.6096 82.5856 0 178.7904 0 357.4784-0.0512 536.1664z"
                      fill="#474747"
                      p-id="4504"
                    ></path>
                    <path
                      d="M326.4 439.7568c51.6096 0 93.6448-41.984 93.6448-93.6448 0-51.6096-41.984-93.6448-93.6448-93.6448-51.6096 0-93.6448 41.984-93.6448 93.6448 0 51.6096 41.984 93.6448 93.6448 93.6448z m0-141.2096c26.2144 0 47.5648 21.3504 47.5648 47.5648s-21.3504 47.5648-47.5648 47.5648c-26.2144 0-47.5648-21.3504-47.5648-47.5648s21.2992-47.5648 47.5648-47.5648zM645.0176 499.2512a37.41696 37.41696 0 0 0-29.696-14.8992 37.34528 37.34528 0 0 0-29.9008 14.4896c-24.832 31.8976-83.9168 107.4176-113.5616 145.2544-20.8384-24.9344-54.272-65.024-71.936-86.2208a37.34016 37.34016 0 0 0-29.7984-13.568 37.26336 37.26336 0 0 0-29.0816 14.9504c-24.576 32.6144-83.712 111.0016-113.3568 150.272a37.30944 37.30944 0 0 0-3.6352 39.3728 37.38624 37.38624 0 0 0 33.6384 20.8384h511.4368a37.4784 37.4784 0 0 0 33.4848-20.5312 37.35552 37.35552 0 0 0-3.072-39.1168c-35.8912-49.408-122.88-168.96-154.5216-210.8416z m-380.5184 238.1312z m10.2912-13.6704c28.672-37.9904 72.3968-96 96.5632-128.1024 20.9408 25.1904 54.3744 65.1776 71.8336 86.0672a37.30944 37.30944 0 0 0 29.44 13.4656 37.51936 37.51936 0 0 0 28.9792-14.3872c24.4736-31.232 83.3024-106.3936 113.3056-144.896 32.512 43.4688 100.4032 136.704 137.5232 187.8016H274.7904z"
                      fill="#474747"
                      p-id="4505"
                    ></path>
                  </svg>
                </template>
              </pictures-upload>
            </div>
          </div>
          <div class="form">
            <div class="op">
              <el-select
                v-model="talkForm.status"
                placeholder="状态"
                size="default"
                style="width: 100px"
              >
                <el-option
                  v-for="item in contentStatus"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                />
              </el-select>
            </div>
            <div class="op">
              <el-switch
                v-model="talkForm.top"
                active-text="已置顶"
                inactive-text="不置顶"
                :active-value="1"
                :inactive-value="0"
                inline-prompt
                size="large"
              />
            </div>
            <div class="op">
              <el-button v-loading="loading" :disabled="loading" type="primary" @click="submit()" size="default"
                >发布</el-button
              >
            </div>
          </div>
        </div>
        <div v-show="talkForm.images.length > 0" class="upload">
          <pictures-upload v-model:value="talkForm.images" dir="talk" />
        </div>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss">
.text {
  .input {
    // line-height: 30px;
    // font-size: 20px;
    img {
      display: inline-block;
      width: 30px;
    }
  }
}
.pictures {
  .pictures-uplaod {
    // width: inherit;
    // height: inherit;
  }
  .show-file-list {
    display: none;
  }
  .el-upload {
    border: none;
    width: 40px;
    height: 40px !important;
    .el-upload-dragger {
      border: none;
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.text {
  .input {
    font-size: 22px;
    padding: 8px 15px;
    border-radius: 15px;
    border: 3px rgb(209, 229, 240) solid;
    width: 100%;
    height: 220px;
    overflow-y: auto;
    // display: flex;
    // align-items: center;
    // line-height: 1.5;
  }
  .input:focus {
    border-color: rgb(156, 208, 238);
  }
}
.operation {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .left {
    display: flex;
    flex-wrap: nowrap;
  }
  .form {
    text-align: right;
  }
}
.upload {
  margin-top: 15px;
  padding: 5px;
}
@media screen and (min-width: 576px) {
  .left {
    width: 90px;
    .op {
      .icon {
        width: 40px;
        height: 40px;
      }
    }
    .op:not(:last-of-type) {
      margin-right: 15px;
    }
  }
  .form {
    text-align: right;
    .op:not(:first-of-type) {
      margin-left: 15px;
    }
  }
}
@media screen and (max-width: 576px) {
  .left {
    width: 80px;
    .op {
      .icon {
        width: 35px;
        height: 35px;
      }
    }
    .op:not(:last-of-type) {
      margin-right: 5px;
    }
  }
  .form {
    text-align: right;
    .op:not(:first-of-type) {
      margin-left: 8px;
    }
  }
}
</style>
