<script setup lang="ts">
import {  getMenuConfig, updateConfig } from "@/api/config";
import Menu from "./menu";
import { onBeforeMount, ref } from "vue";
import modifyModal from "./modifyModal.vue";
import { ElMessage } from "element-plus";
import {ConfigJson} from '../config'

defineOptions({
  name: "MainPage"
});
onBeforeMount(() => {
  getData();
});
const config = ref<ConfigJson<Menu[]> | any>({
  // 防止没有数据时报错
  value:[]
});
const getData = () => {
  getMenuConfig().then((data: any) => {
    data.value = JSON.parse(data.value);
    config.value = data;
    console.log("menu config:", data.value);
  });
};
const show = ref<boolean>(false);

const isAdd = ref<boolean>(false);
const item = ref<Menu>();
const showModal = (isAddMenu: boolean, menu?: Menu) => {
  isAdd.value = isAddMenu;
  if (!isAddMenu) {
    item.value = menu;
  }
  show.value = true;
};

const updateMenu = (isAdd: boolean, item: Menu) => {
  const newConfig: ConfigJson<Menu[]> | any = config.value;
  if (isAdd) {
    newConfig.value.push(item);
  } else {
    for (let i = 0; i < newConfig.value.length; i++) {
      const m = newConfig.value[i];
      if (m.name == item.name) {
        m.cover = item.cover;
        m.label = item.label;
        break;
      }
    }
  }
  updateConfig(null, { data: newConfig }).then(() => {
    ElMessage.success(isAdd ? "添加成功！" : "修改成功！");
  });
};
</script>

<template>
  <el-card class="box-card menu-config config">
    <template #header>
      <div class="card-header">
        <span class="title">主页菜单信息</span>
        <el-button class="button" @click="getData()">刷新数据</el-button>
      </div>
    </template>
    <div class="content">
      <div class="operation">
        <el-button type="primary" @click="showModal(true)">添加</el-button>
      </div>
      <div class="menus">
        <el-card
          class="box-card item"
          v-for="item in config?.value"
          :key="item.name"
        >
          <template #header>
            <div class="card-header">
              <span>{{ item.label }}</span>
              <el-button
                class="button"
                type="primary"
                @click="showModal(false, item)"
                >编辑</el-button
              >
            </div>
          </template>
          <div
            class="cover img"
            :style="'background-image: url(' + item.cover + ')'"
          >
            <!-- <el-image class="img" style="width: 100px; height: 100px" :src="item.cover" :fit="'cover'" /> -->
          </div>
        </el-card>
      </div>
      <modifyModal
        v-model:show="show"
        :is-add="isAdd"
        :item="item"
        @update-data="updateMenu"
      />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.menu-config {
  .operation{
    margin-bottom: 15px;
  }
  .menus {
    display: grid;
    .item {
      border-radius: 15px;
      // width: 23.5%;
      .cover {
        position: relative;
        width: 100%;
        padding-bottom: 60%;
        .img {
          // border-bottom-left-radius: 15px;
          // border-bottom-right-radius: 15px;
          background-size: cover;
        }
      }
    }
  }
}
@media screen and (min-width: 992px) {
  .menu-config {
    .menus {
      grid-template-columns: repeat(3, 1fr);

      grid-column-gap: 20px;
      grid-row-gap: 20px;
      .ant-card {
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .menu-config {
    .menus {
      grid-template-columns: repeat(2, 1fr);

      grid-column-gap: 20px;
      grid-row-gap: 20px;
      .ant-card {
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .menu-config {
    .menu {
      grid-template-columns: repeat(1, 1fr);

      // grid-column-gap:20px;
      grid-row-gap: 15px;
      .ant-card {
      }
    }
  }
}
</style>
