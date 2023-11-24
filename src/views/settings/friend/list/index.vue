<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import {
  getFriendPage,
  updateFriendStatus,
  FriendDto,
  deleteFriend
} from "@/api/friend";
import AddAndModifyModal from "./addAndModifyModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { scrollToContent } from "@/utils/pageUtils";

defineOptions({
  name: "Friend"
});
onBeforeMount(() => {
  getData();
});
const contentRef = ref();

const getData = ():Promise<any> => {
  return new Promise((resolve, reject) => {
    const tempParams = {
    ...params,
    ...queryParams
  };
  getFriendPage(tempParams).then((data: any) => {
    list.value = data.list;
    total.value = data.total;
    resolve(null)
  }).catch(()=>reject(null))
})
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 10
};
const queryParams = reactive({
  id: null,
  name: "",
  author: "",
  url: "",
  introduction: "",
  hidden: null,
  review:null
  
})
const list = ref<FriendDto[]>([]);

const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<FriendDto>();
const show = (item: FriendDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
const updateStatus = (item: FriendDto) => {
  const form = {
    id: item.id,
    status: item.hidden
  };
  updateFriendStatus(null, { data: form })
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.hidden = item.hidden == 1 ? 0 : 1;
    });
};
const deleteR = (item: FriendDto) => {
  ElMessageBox.confirm(`是否确认删除友链【${item.name}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteFriend(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="friend">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">友链信息</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>友链ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入操作ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>网站名称:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.name"
              placeholder="输入网站名称"
              size="default"
            />
          </div>
          <div class="op">
            <label>作者昵称:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.author"
              placeholder="输入作者昵称"
              size="default"
            />
          </div>
          <div class="op">
            <label>链接地址:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.url"
              placeholder="输入链接地址"
              size="default"
            />
          </div>
          <div class="op">
            <label>是否隐藏:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.hidden"
              placeholder="选择隐藏状态"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="隐藏" :value="1" />
              <el-option label="显示" :value="0" />
            </el-select>
          </div>
          <div class="op">
            <label>审核状态:</label>
            <el-select
              @change="getData()"
              v-model="queryParams.review"
              placeholder="选择审核状态"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="通过" :value="1" />
              <el-option label="待审核" :value="0" />
              <el-option label="通过" :value="-1" />
            </el-select>
          </div>
        </div>
        <div class="btn">
          <el-button size="default" type="primary" @click="show()"
            >添加</el-button
          >
        </div>
        <span ref="contentRef"></span>
        <el-table border :data="list" style="width: 100%">
          <el-table-column prop="id" :align="'center'" label="ID" width="50" />
          <el-table-column
            prop="name"
            :align="'center'"
            label="网站名称"
            width="150"
          />
          <el-table-column
            prop="icon"
            :align="'center'"
            label="网站图标"
            width="100"
          >
            <template #default="{row}">
              <el-avatar
                shape="square"
                :size="50"
                :fit="'fill'"
                :src="row.icon"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            :align="'center'"
            label="网站作者"
            width="150"
          />
          <el-table-column :align="'center'" label="网站链接" width="150">
            <template #default="scope">
              <el-link target="_blank" type="primary" :href="scope.row.url">{{
                scope.row.url
              }}</el-link>
            </template></el-table-column
          >
          <el-table-column
            prop="introduction"
            :align="'center'"
            label="介绍信息"
          >
        <template #default="{ row }">
              <el-popover
                placement="top-start"
                title="网站介绍"
                :width="200"
                trigger="hover"
                :content="row.introduction"
              >
                <template #reference>
                  <span class="ellipsis-two">
                    {{ row.introduction }}
                  </span>
                </template>
              </el-popover>
            </template>
        </el-table-column>
          <el-table-column :align="'center'" label="是否隐藏" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.hidden"
                @click="updateStatus(scope.row)"
                :active-value="1"
                :inactive-value="0"
              /> </template
          ></el-table-column>
          <el-table-column :align="'center'" label="审核情况" width="100">
            <template #default="scope">
                <el-tag v-if="scope.row.review==1" type="success">通过</el-tag>
                <el-tag v-if="scope.row.review==-1" type="danger">未通过</el-tag>
                <el-tag v-if="scope.row.review==0" type="warning">待审核</el-tag>
              </template
          ></el-table-column>
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="200"
          />
          <!-- <el-table-column
            prop="updateTime"
            :align="'center'"
            label="修改时间"
            width="200"
          /> -->

          <el-table-column :align="'center'" label="操作" width="180">
            <template #default="scope">
              <el-button size="default" type="primary" @click="show(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="default"
                type="danger"
                @click="deleteR(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :hide-on-single-page="false"
          background
          v-model:current-page="params.page"
          v-model:page-size="params.limit"
          @update:current-page="scrollToContent(getData, contentRef)"
          @update:page-size="scrollToContent(getData, contentRef)"
          layout="total,prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[10, 15, 20, 30, 50]"
        />
      </div>
    </el-card>
    <add-and-modify-modal
      ref="modifyRef"
      v-model:show="showDialog"
      :item="selected"
      @refresh="getData()"
    />
  </div>
</template>

<style lang="scss" scoped>
.btn{
  margin: 15px 0;
}
</style>
