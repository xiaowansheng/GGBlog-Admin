<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { PictureDto, getPicturePage, updatePicture, deletePicture } from "@/api/picture";

import { NameLabelDto, getContentStatus } from "@/api/common";
import EditModal from "./EditModal.vue";
import AddModal from './AddModal.vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useDetail } from "@/hooks/routerUtils";
const { initToDetail, getParameter,getQuery, closeToPage } = useDetail();
defineOptions({
  name: "Pictures"
});
onBeforeMount(() => {
  let title = getQuery?.name as string
  title=title?.length>8?title?.slice(0,8)+"...":title
  initToDetail(title)
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
  getPicturePage(tempParams).then((data: any) => {
    list.value = data.list;
    total.value = data.total;
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 30
};
const queryParams = reactive({
  id: getParameter?.id,
});
const contentStatus = ref<NameLabelDto[]>([]);
const list = ref<PictureDto[]>([]);
const findStatus = (name: string) => {
  for (let i = 0; i < contentStatus.value.length; i++) {
    if (contentStatus.value[i].name == name) {
      return contentStatus.value[i].label;
    }
  }
  return name;
};
// 添加
const showAdd=ref<boolean>(false)

// 编辑
const modifyRef = ref();
const showEdit = ref(false);
const selected = ref<PictureDto>();
const show = (item: PictureDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showEdit.value = true;
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
const deleteR = (item: PictureDto) => {
  ElMessageBox.confirm(`是否确认删除照片【${item.name}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deletePicture(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="picture">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">照片列表</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="operation">
          <el-button size="default" type="primary" @click="showAdd=true"
            >添加</el-button
          >
        </div>
            <el-empty v-show="total==0" description="Empty" />
        <div class="pictures">

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
              :style="'background-image: url(' + item.url + ')'"
            >
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
    <add-modal v-model:show="showAdd"></add-modal>
    <edit-modal
      v-model:show="showEdit"
      :item="selected"
      :status="contentStatus"
      @Refresh="getData()"
    />
  </div>
</template>

<style lang="scss" scoped>
.picture {
  .operation {
    margin-bottom: 15px;
  }
  .pictures {
    display: grid;
    .item {
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
    }
  }
}
@media screen and (min-width: 992px) {
  .picture {
    .pictures {
      grid-template-columns: repeat(3, 1fr);

      grid-column-gap: 20px;
      grid-row-gap: 20px;
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .picture {
    .pictures {
      grid-template-columns: repeat(2, 1fr);

      grid-column-gap: 20px;
      grid-row-gap: 20px;
    }
  }
}
@media screen and (max-width: 768px) {
  .picture {
    .pictures {
      grid-template-columns: repeat(1, 1fr);

      // grid-column-gap:20px;
      grid-row-gap: 15px;
    
    }
  }
}
</style>
