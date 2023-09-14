<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { AlbumDto, getAlbumPage, updateAlbum, deleteAlbum } from "@/api/album";

import { NameLabelDto, getContentStatus } from "@/api/common";
import AddAndEditModal from "./AddAndEditModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDetail } from "@/hooks/routerUtils";
const { router } = useDetail();
defineOptions({
  name: "AlbumList"
});
onBeforeMount(() => {
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
  });
  getData();
});

const getData = () => {
  const tempParams = {
    ...params,
    ...queryParams
  };
  getAlbumPage(tempParams).then((data: any) => {
    list.value = data.list;
    total.value = data.total;
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 10
};
const queryParams = reactive({
  id: null,
  userAuthId: ""
});
const contentStatus = ref<NameLabelDto[]>([]);
const list = ref<AlbumDto[]>([]);
const findStatus = (name: string) => {
  for (let i = 0; i < contentStatus.value.length; i++) {
    if (contentStatus.value[i].name == name) {
      return contentStatus.value[i].label;
    }
  }
  return name;
};

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<AlbumDto>();
const show = (item: AlbumDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
// const updateStatus = (item: AlbumDto) => {
//   const form = {
//     id: item.id,
//     status: item.disable
//   };
//   updateUserStatus(form)
//     .then(() => {
//       ElMessage.success("修改成功！");
//     })
//     .catch(() => {
//       item.disable = item.disable == 1 ? 0 : 1;
//     });
// };
const deleteR = (item: AlbumDto) => {
  ElMessageBox.confirm(`是否确认删除相册【${item.name}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAlbum(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="album">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">相册列表</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="operation">
          <el-button size="default" type="primary" @click="show()"
            >添加</el-button
          >
        </div>
        <div class="albums">
          <el-card class="box-card item" v-for="item in list" :key="item.name">
            <template #header>
              <div class="card-header">
                <span>{{ item.name }}</span>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-link type="primary">● ● ●</el-link>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="show(item)">
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
              :style="'background-image: url(' + item.cover + ')'"
              @click="
                router.push({
                  name: 'Pictures',
                  params: { id: item.id },
                  query: { name: item.name }
                })
              "
            >
              <!-- @click="router2.push('/pictures')" -->
              <!-- @click="router2.push('/menu/4')" -->
              <!-- <el-image class="img" style="width: 100px; height: 100px" :src="item.cover" :fit="'cover'" /> -->
            </div>
            <div class="status">
              <el-tag  size="small" v-if="item.status == 'public'">{{
                findStatus(item.status)
              }}</el-tag>
              <el-tag  size="small" v-else type="warning">{{
                findStatus(item.status)
              }}</el-tag>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
    <add-and-edit-modal
      v-model:show="showDialog"
      :item="selected"
      :status="contentStatus"
      @Refresh="getData()"
    />
  </div>
</template>

<style lang="scss" scoped>
.album {
  .operation {
    margin-bottom: 15px;
  }
  .albums {
    display: grid;
    .item {
      position: relative;
      border-radius: 15px;
      .el-dropdown-item {
        padding: 20px;
      }
      // width: 23.5%;
      .cover {
        position: relative;
        width: 100%;
        padding-bottom: 60%;
        background-size: cover;
      }
      .status {
        position: absolute;
        left: 15px;
        bottom: 15px;
      }
    }
  }
}
@media screen and (min-width: 992px) {
  .album {
    .albums {
      grid-template-columns: repeat(3, 1fr);

      grid-column-gap: 20px;
      grid-row-gap: 20px;
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .album {
    .albums {
      grid-template-columns: repeat(2, 1fr);

      grid-column-gap: 20px;
      grid-row-gap: 20px;
    }
  }
}
@media screen and (max-width: 768px) {
  .album {
    .albums {
      grid-template-columns: repeat(1, 1fr);

      // grid-column-gap:20px;
      grid-row-gap: 15px;
    }
  }
}
</style>
