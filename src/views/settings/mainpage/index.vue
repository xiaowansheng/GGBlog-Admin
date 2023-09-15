<script setup lang="ts">
import { getMenuConfig, updateConfig } from "@/api/config";
import Menu from "./menu";
import { onBeforeMount, ref } from "vue";
import modifyModal from "./modifyModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ConfigJson } from "../config";

defineOptions({
  name: "MainPage"
});
onBeforeMount(() => {
  getData();
});
const config = ref<ConfigJson<Menu[]> | any>({
  // 防止没有数据时报错
  value: []
});
const getData = () => {
  getMenuConfig().then((data: any) => {
    data.value = JSON.parse(data.value);
    config.value = data;
    // console.log("menu config:", data.value);
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
  const newConfig: ConfigJson<Menu[]> | any = JSON.parse(
    JSON.stringify(config.value)
  );
  if (isAdd) {
    newConfig.value.push(item);
  } else {
    for (let i = 0; i < newConfig.value.length; i++) {
      const m = newConfig.value[i];
      if (m.name == item.name) {
        m.url = item.url;
        m.label = item.label;
        break;
      }
    }
  }
  newConfig.value = JSON.stringify(newConfig.value);
  // console.log(newConfig);
  updateConfig(null, { data: newConfig }).then(() => {
    getData();
    ElMessage.success(isAdd ? "添加成功！" : "修改成功！");
    show.value = false;
  });
};
const deleteR = (item: Menu) => {
  ElMessageBox.confirm(`是否确认封面【${item.label}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const newConfig: ConfigJson<Menu[]> | any = JSON.parse(
      JSON.stringify(config.value)
    );
    newConfig.value = newConfig.value.filter(item => item.name != item.name);
    newConfig.value = JSON.stringify(newConfig.value);
    updateConfig(null, { data: newConfig }).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
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
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-link type="primary">● ● ●</el-link>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showModal(false, item)">
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
          <div
            class="cover img"
            :style="'background-image: url(' + item.url + ')'"
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
<style lang="scss">
.menus{
  
.el-card__body{
  padding: 0;
}
}
</style>

<style lang="scss" scoped>

.menu-config {
  .operation {
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
        padding-bottom: 56.52%;
      }
      .img {
        // border-bottom-left-radius: 15px;
        // border-bottom-right-radius: 15px;
        background-size: cover;
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
      grid-row-gap: 15px;
    }
  }
}
</style>
