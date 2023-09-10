<script setup lang="ts">
import { getStatisticOfNumber, StatisticsOfNumberDto } from "@/api/analysis";
import { onBeforeMount } from "vue";
import { ref } from "vue";
defineOptions({
  name: "Overview"
});
onBeforeMount(() => {
  getData();
});

const getData = () => {
  getNumbers();
};
const counts = ref<StatisticsOfNumberDto | any>({});
const getNumbers = () => {
  getStatisticOfNumber().then((data: any) => {
    counts.value = data;
  });
};
</script>

<template>
  <div class="overview">
    <el-row :gutter="24" class="overview">
      <el-col :xs="24" :sm="12" :lg="6" class="item">
        <div class="panel panel-bkcolor">
          <div class="icon">
            <IconifyIconOnline
              icon="material-symbols:article"
              height="60px"
              width="60px"
            />
          </div>
          <div class="info">
            <span class="name">文章</span>
            <span class="count">{{ counts.article }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="item">
        <div class="panel panel-bkcolor">
          <div class="icon">
            <IconifyIconOnline
              icon="iconamoon:category-fill"
              height="60px"
              width="60px"
            />
          </div>
          <div class="info">
            <span class="name">分类</span>
            <span class="count">{{ counts.category }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="item">
        <div class="panel panel-bkcolor">
          <div class="icon">
            <IconifyIconOnline
              icon="solar:tag-bold"
              height="60px"
              width="60px"
            />
          </div>
          <div class="info">
            <span class="name">标签</span>
            <span class="count">{{ counts.tag }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="item">
        <div class="panel panel-bkcolor">
          <div class="icon">
            <IconifyIconOnline
              icon="game-icons:talk"
              height="60px"
              width="60px"
            />
          </div>
          <div class="info">
            <span class="name">说说</span>
            <span class="count">{{ counts.talk }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.overview {
  margin-bottom: 15px;
  .item {
    padding: 0 20px !important;
    margin: 0 0 10px 0;
  }
  .panel {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .name {
        font-size: 20px;
      }
      .count {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
