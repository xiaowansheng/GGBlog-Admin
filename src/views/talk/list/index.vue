<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { TalkDto, getTalkPage, deletTalk } from "@/api/talk";
import PageParams from "@/api/constant/params";
import { useTags } from "@/layout/hooks/useTag";
import { ElMessageBox, ElMessage } from "element-plus";

import { NameLabelDto, getContentStatus } from "@/api/common";
import { formatDate } from "@/utils/myUtils";

import { getAuthorConfig } from "@/api/config";
import { Author } from "@/views/settings/author/Author";
const { router } = useTags();
defineOptions({
  name: "TalkList"
});
onBeforeMount(() => {
  getAuthorConfig().then((data: any) => {
    if (data) {
      // console.log("author:", data);
      author.value = JSON.parse(data.value);
    }
  });
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
  });
  getData();
});
const author = ref<Author>({
  nickname: "小汍笙",
  avatar: "",
  introduction: ""
});
const getData = () => {
  const params = {
    ...pageParams,
    ...queryParams
  };
  getTalkPage(params).then((data: any) => {
    data.list.forEach(talk => {
      talk.images = JSON.parse(talk.images);
    });
    total.value = data.total;
    list.value = data.list;
  });
};
const pageParams = reactive<PageParams>({
  page: 1,
  limit: 10
});
const dateInterval = ref<any>();
const dateChange = (value: [Date, Date]) => {
  if (value[0] && value[1]) {
    queryParams.beginDate = formatDate(value[0]);
    queryParams.endDate = formatDate(value[1]);
    getData();
  }
  // 无效
  // else if (!value[0] && !value[1]) {
  //   queryParams.beginDate = null
  //   queryParams.endDate = null
  //   getData()
  // }
};
const queryParams = reactive<any>({
  id: null,
  content: "",
  status: "",
  top: null,
  ipSource: "",
  device: "",
  browser: ""
  // beginDate: null,
  // endDate: null
});
const contentStatus = ref<NameLabelDto[]>();
const findStatus = (name: string) => {
  for (let i = 0; i < contentStatus.value.length; i++) {
    const status = contentStatus.value[i];
    if (status.name == name) {
      return status.label;
    }
  }
  return name;
};
const total = ref<number>(0);
const list = ref<TalkDto[]>([]);

const deleteR = (item: TalkDto) => {
  ElMessageBox.confirm(
    `是否确认删除说说【${item.content.slice(0, 10)}......】？`,
    "Warning",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(() => {
    deletTalk(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="talk-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">说说列表</span>
          <el-button class="button" @click="getData">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>说说ID:</label>
            <el-input
              style="width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入说说ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>说说内容:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.content"
              placeholder="输入说说内容"
              size="default"
            />
          </div>
          <div class="op">
            <label>说说状态:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.status"
              placeholder="选择说说状态"
              size="default"
              style="width: 150px"
            >
              <el-option label="全部" :value="''" />
              <el-option
                v-for="item in contentStatus"
                :key="item.name"
                :label="item.label + '（' + item.name + '）'"
                :value="item.name"
              />
            </el-select>
          </div>

          <div class="op">
            <label>是否置顶:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.top"
              placeholder="选择置顶状态"
              size="default"
              style="width: 130px"
            >
              <el-option label="全部" value="" />
              <el-option label="置顶" :value="1" />
              <el-option label="不置顶" :value="0" />
            </el-select>
          </div>
          <div class="op">
            <label>日期筛选:</label>
            <el-date-picker
              v-model="dateInterval"
              @calendar-change="dateChange"
              type="daterange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="default"
            />
          </div>
        </div>
        <el-card class="item" v-for="item in list" :key="item.id">
          <template #header>
            <div class="item-header">
              <!-- 查询作者信息，取出头像和昵称 -->
              <div class="left">
                <div class="avatar">
                  <el-avatar
                    v-if="author.avatar"
                    :size="50"
                    :src="author.avatar"
                  />
                  <!-- 无效 -->
                  <!-- <el-avatar v-else :size="50" :src="'@/assets/login/avatar.png'" /> -->

                  <img
                    v-else
                    src="@/assets/login/avatar.png"
                    alt="logo"
                    width="50"
                    height="50"
                  />
                </div>
                <div class="info">
                  <div class="name">
                    {{ author.nickname }}
                  </div>
                  <div class="datetime">
                    {{ item.createTime }}
                  </div>
                </div>
              </div>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-link type="primary">● ● ●</el-link>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="
                        router.push({
                          name: 'TalkEdit',
                          params: { id: item.id }
                        })
                      "
                    >
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item
                      ><span :style="{ color: 'red' }" @click="deleteR(item)">
                        删除
                      </span></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div class="content">
            <!-- {{ item.content }} -->
            <div class="text" v-html="item.content"></div>
            <div class="images" v-if="item.images&&item.images.length>0">
              <el-image
                v-for="(picture,index) in item.images"
                style="width: 100%; height: 100%"
                :src="picture"
                :fit="'cover'"
                :initial-index="index"
                :preview-src-list="item.images"
              />
            </div>
            <div class="primacy">
              <div class="left">
                <el-tag v-if="item.status == 'public'" type="success">{{
                  findStatus(item.status)
                }}</el-tag>
                <el-tag v-else type="warning">{{
                  findStatus(item.status)
                }}</el-tag>
              </div>
              <div class="right">
                <div class="ipSource">
                  {{ item.ipSource }}
                </div>
                <div class="device">
                  {{ item.device + "-" + item.browser }}
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-pagination
          :hide-on-single-page="false"
          background
          v-model:current-page="pageParams.page"
          v-model:page-size="pageParams.limit"
          @update:current-page="getData()"
          @update:page-size="getData()"
          layout="total,prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[10, 15, 20, 30, 50]"
        />
      </div>
    </el-card>
  </div>
</template>
<style lang="scss">
.talk-list {
   .el-card__body{
    padding: 8px;
  }
  .content {
    .text {
      // display: flex;
      // align-items: center;
      font-size: 18px;
      img {
        display: inline-block;
        width: 30px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.item {
  border-radius: 15px;
  overflow: hidden;
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: space-around;
    .left {
      display: flex;
      .info {
        margin-left: 20px;
        .name {
          font-weight: bold;
        }
        .datetime {
          font-size: 14px;
        }
      }
    }
  }
  .images{
    margin-top: 15px;
  }
  .primacy {
    font-size: 14px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: space-around;
    .right {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
.item:not(:first-of-type) {
  margin-top: 25px;
}
@media screen and (min-width:1200px) {
  .item {
    .images {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-gap: 10px;
    }
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .item {
    .images {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-gap: 10px;
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .item {
    .images {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 8px;
    }
  }
}
@media screen and (max-width: 768px) {
  .item {
    .images {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 5px;
    
    }
    
  }
}
</style>
