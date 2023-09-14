<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from "vue";
import {
  PictureDto,
  getPicturePage,
  updatePicture,
  deletePicture
} from "@/api/picture";

import { NameLabelDto, getContentStatus, getPictureType } from "@/api/common";
import EditModal from "./EditModal.vue";
import AddModal from "./AddModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDetail } from "@/hooks/routerUtils";
import { onMounted } from "vue";
const { initToDetail, getParameter, getQuery, closeToPage } = useDetail();
defineOptions({
  name: "Pictures"
});
onBeforeMount(() => {
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
  });
  getPictureType().then((data: any) => {
    pictureType.value = data;
  });
  getData();
});
onMounted(() => {
  let title = getQuery?.name as string;
  // console.log(name);
  console.log(title);

  title = title?.length > 8 ? title?.slice(0, 8) + "..." : title;
  initToDetail(title);
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
  albumId: getParameter!.id
});
const contentStatus = ref<NameLabelDto[]>([]);
const pictureType = ref<NameLabelDto[]>([]);
const list = ref<PictureDto[]>([]);

watch(list, () => {
  photos.value = list.value.map(picture => picture.url);
});
const findStatus = (name: string) => {
  for (let i = 0; i < contentStatus.value.length; i++) {
    if (contentStatus.value[i].name == name) {
      return contentStatus.value[i].label;
    }
  }
  return name;
};
// 添加
const showAdd = ref<boolean>(false);

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
const photos = ref<string[]>([]);
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
          <el-button size="default" type="primary" @click="showAdd = true"
            >添加</el-button
          >
        </div>
        <el-empty v-show="total == 0" description="Empty" />
        <div class="pictures">
          <!-- <el-card class="box-card item" v-for="item in list" :key="item.name">
            <template #header>
              <div class="card-header">
                <el-popover
                  placement="top-start"
                  title="图片名称"
                  :width="200"
                  trigger="hover"
                  :content="item.name"
                >
                  <template #reference>
                    <span>{{ item.name.slice(0, 20) + "..." }}</span>
                  </template>
                </el-popover>
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
            >
                <el-image style="width: 100%;height: 100%;" :src="item.url" :fit="'cover'" />

          </div>
          </el-card> -->
          <div class="item" v-for="(item, index) in list" :key="item.name">
            <el-popover
              placement="top-start"
              title="图片名称"
              :width="200"
              trigger="hover"
              :content="item.name"
            >
              <template #reference>
                <el-image
                  style="width: 100%; height: 100%"
                  :src="item.url"
                  :fit="'cover'"
                  :initial-index="index"
                  :preview-src-list="photos"
                />
              </template>
            </el-popover>
            <div class="menu">
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
            <div class="status">
              <el-tag size="small" v-if="item.status == 'public'">{{
                findStatus(item.status)
              }}</el-tag>
              <el-tag  size="small" v-else type="warning">{{
                findStatus(item.status)
              }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <add-modal
      v-model:show="showAdd"
      :albumId="queryParams.albumId"
      @refresh="getData()"
    ></add-modal>
    <edit-modal
      v-model:show="showEdit"
      :item="selected"
      :status="contentStatus"
      :source="pictureType"
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
      position: relative;
      .menu {
        position: absolute;
        top: 5px;
        right: 5px;
        .el-dropdown-link {
          padding: 3px 6px;
        }
      }
      .status {
        position: absolute;
        left: 5px;
        bottom: 5px;
      }
    }
  }
}
@media screen and (min-width: 992px) {
  .picture {
    .pictures {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      grid-gap: 20px;
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .picture {
    .pictures {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      grid-gap: 15px;
    }
  }
}
@media screen and (max-width: 768px) {
  .picture {
    .pictures {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      grid-gap: 15px;
    }
  }
}
</style>
