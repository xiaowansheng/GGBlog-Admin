<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { TalkDto, getTalkPage,deletTalk } from "@/api/talk";
import PageParams from "@/api/constant/params";
import { useTags } from "@/layout/hooks/useTag"
import { ElMessageBox,ElMessage } from "element-plus";
const {router} =useTags()
defineOptions({
  name: "TalkList"
});
onBeforeMount(() => {
  getData();
});
const getData = () => {
  const params = {
    ...pageParams,
    ...talkParams
  };
  getTalkPage(params).then((data: any) => {
    total.value = data.total;
    list.value = data.list;
  });
};
const pageParams = reactive<PageParams>({
  page: 1,
  limit: 10
});
const talkParams = reactive<any>({});
const total = ref<number>(0);
const list = ref<TalkDto[]>([]);

const deleteR = (item: TalkDto) => {
  ElMessageBox.confirm(`是否确认删除说说【${item.content.split(0,10)}......】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
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
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <el-card class="item" v-for="item in list" :key="item.id">
          <template #header>
            <div class="item-header">
              <!-- TODO 从本地存储的用户名取 -->
              <div class="left">
                <div class="avatar">
                  <el-avatar :size="50" :src="''" />
                </div>
                <div class="info">
                  <div class="name">
                    {{ "小汍笙" }}
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
                      <el-dropdown-item @click="router.push({name:'TalkEdit',params:{id:item.id}})">
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
            <div class="text">
              {{ item.content }}
            </div>
            <div class="primacy">
              <div class="left">
                <el-tag>{{ item.status }}</el-tag>
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
      </div>
    </el-card>
  </div>
</template>

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
  .primacy {
    font-size: 14px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: space-around;
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
.item:not(:first-of-type) {
  margin-top: 25px;
}
</style>
