<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import {
  getLeaveWordPage,
  updateLeaveWord,
  GuestbookDto,
  deleteBatchLeaveWord,
  deleteLeaveWord
} from "@/api/guestbook";
import { getUserType } from "@/api/common";
import ModifyModal from "./ModifyModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { scrollToContent } from "@/utils/pageUtils";
defineOptions({
  name: "Guestbook"
});
onBeforeMount(() => {
  // 获取所有用户类型
  getUserType().then((data: any) => {
    userTypes.value = data;
  });
  getData();
});
const contentRef = ref();

const getData = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const tempParams = {
      ...params,
      ...queryParams
    };
    getLeaveWordPage(tempParams)
      .then((data: any) => {
        list.value = data.list;
        total.value = data.total;
        resolve(null);
      })
      .catch(() => reject(null));
  });
};

const total = ref<number>(0);
const params = {
  page: 1,
  limit: 10
};
const queryParams = reactive({
  id: null,
  userAuthId: null,
  content: "",
  ipSource: "",
  device: "",
  browser: "",
  location: "",
  type: null,
  nickname: "",
  email: "",
  qq: "",
  hidden: null,
  review: null
});
const topicTypes = ref<any>([]);
const userTypes = ref<any>([]);
const list = ref<GuestbookDto[]>([]);
const findCommontType = (name: string): string => {
  for (let i = 0; i < userTypes.value.length; i++) {
    const type = userTypes.value[i];
    if (type.name == name) {
      return type.label;
    }
  }
  return name;
};
const modifyRef = ref();
const showDialog = ref(false);
const selected = ref<GuestbookDto>();
const show = (item: GuestbookDto = null) => {
  if (item != null) {
    selected.value = item;
  } else {
    selected.value = null;
  }
  showDialog.value = true;
};
const updateStatus = (item: GuestbookDto) => {
  const form = {
    id: item.id,
    status: item.hidden
  };
  updateLeaveWord(form)
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch(() => {
      item.hidden = item.hidden == 1 ? 0 : 1;
    });
};
const deleteR = (item: GuestbookDto) => {
  ElMessageBox.confirm(`是否确认删除留言【${item.content}】？`, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteLeaveWord(item.id).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};

const selectBatch = ref<GuestbookDto[]>([]);
const selectChange = (selection: GuestbookDto[]) => {
  // console.log(selection);
  selectBatch.value = selection;
};

const deleteBatch = () => {
  if (!selectBatch.value.length) {
    return;
  }
  const ids = selectBatch.value.map(item => item.id);
  const commonts = selectBatch.value.map(
    item => "【" + item.content.slice(0, 6) + "...】"
  );
  ElMessageBox.confirm(
    `是否确认批量删除评论${commonts.join(",")}？`,
    "Warning",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(() => {
    deleteBatchLeaveWord(ids).then(() => {
      getData();
      ElMessage.success("删除成功");
    });
  });
};
</script>

<template>
  <div class="comment content">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">评论信息</span>
          <el-button class="button" @click="getData()">刷新数据</el-button>
        </div>
      </template>
      <div class="content">
        <div class="table-operation">
          <div class="op">
            <label>评论ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.id"
              placeholder="输入评论ID"
              size="default"
            />
          </div>
          <div class="op">
            <label>用户ID:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.userAuthId"
              placeholder="输入用户id"
              size="default"
            />
          </div>
          <div class="op">
            <label>留言内容:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.content"
              placeholder="输入留言内容"
              size="default"
            />
          </div>
          <div class="op">
            <label>IP来源:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.ipSource"
              placeholder="输入ip来源"
              size="default"
            />
          </div>
          <div class="op">
            <label>使用设备:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.device"
              placeholder="输入设备"
              size="default"
            />
          </div>
          <div class="op">
            <label>浏览器信息:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.browser"
              placeholder="输入使用浏览器"
              size="default"
            />
          </div>
          <div class="op">
            <label>用户类型:</label>

            <el-select
              @change="getData()"
              v-model="queryParams.type"
              placeholder="选择用户类型"
              size="default"
              style="min-width: 150px"
            >
              <el-option label="全部（all）" value="" />
              <el-option
                v-for="item in userTypes"
                :key="item.name"
                :label="item.label + '（' + item.name + '）'"
                :value="item.name"
              />
            </el-select>
          </div>
          <div class="op">
            <label>游客昵称:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.nickname"
              placeholder="输入游客昵称"
              size="default"
            />
          </div>
          <div class="op">
            <label>游客邮箱:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.email"
              placeholder="输入游客邮箱"
              size="default"
            />
          </div>
          <div class="op">
            <label>游客QQ:</label>
            <el-input
              style="min-width: 100px"
              @change="getData()"
              v-model="queryParams.email"
              placeholder="输入游客QQ"
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
              <el-option label="显示" :value="0" />
              <el-option label="隐藏" :value="1" />
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
          <el-button
            size="default"
            :disabled="!selectBatch.length"
            type="danger"
            @click="deleteBatch()"
            >批量删除</el-button
          >
        </div>
        <span ref="contentRef"></span>
        <el-table
          border
          :data="list"
          style="width: 100%"
          @selection-change="selectChange"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column
            prop="id"
            :align="'center'"
            label="评论ID"
            width="80"
          />
          <el-table-column
            prop="userAuthId"
            :align="'center'"
            label="用户ID"
            width="100"
          />
          <el-table-column
            :header-align="'center'"
            label="留言内容"
            width="280"
          >
            <template #default="{ row }">
              <el-tooltip
                class="tooltip"
                effect="light"
                :content="row.content"
                placement="top-start"
              >
                <span class="ellipsis-two">{{ row.content }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="parentId"
            :align="'center'"
            label="回复的ID"
            width="100"
          />
          <el-table-column :align="'center'" label="评论来源" width="100">
            <template #default="{ row }">
              {{ findCommontType(row.type) }}
            </template></el-table-column
          >
          <el-table-column
            prop="nickname"
            :align="'center'"
            label="昵称"
            width="150"
          />
          <el-table-column
            prop="email"
            :align="'center'"
            label="邮箱"
            width="180"
          />
          <el-table-column prop="qq" :align="'center'" label="QQ" width="100" />
          <el-table-column
            prop="ipSource"
            :align="'center'"
            label="IP来源"
            width="180"
          >
            <template #default="{ row }">
              <el-tooltip
                class="tooltip"
                effect="light"
                :content="row.ipSource"
                placement="top-start"
              >
                <span class="ellipsis-two">{{ row.ipSource }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="device"
            :align="'center'"
            label="设备"
            width="130"
          />
          <el-table-column
            prop="browser"
            :align="'center'"
            label="浏览器"
            width="120"
          />
          <el-table-column :align="'center'" label="是否隐藏" width="90">
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
              <el-tag v-if="scope.row.review == 1" type="success">通过</el-tag>
              <el-tag v-if="scope.row.review == -1" type="danger"
                >未通过</el-tag
              >
              <el-tag v-if="scope.row.review == 0" type="warning"
                >待审核</el-tag
              >
            </template></el-table-column
          >
          <el-table-column
            prop="createTime"
            :align="'center'"
            label="创建时间"
            width="160"
          />
          <!-- <el-table-column
            prop="updateTime"
            :align="'center'"
            label="修改时间"
            width="200"
          /> -->

          <el-table-column
            :align="'center'"
            fixed="right"
            label="操作"
            width="160"
          >
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
    <modify-modal
      ref="modifyRef"
      v-model:show="showDialog"
      :item="selected"
      @refresh="getData()"
    />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin: 15px 0;
}
</style>
