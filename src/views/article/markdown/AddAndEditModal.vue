<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";

import {
  Article,
  getAllArticleType,
  addArticle,
  updateArticle
} from "@/api/article";

import { getContentStatus } from "@/api/common";
import { getAllCategory } from "@/api/category";
import { getAllTag } from "@/api/tag";
import { computed } from "vue";

import SinglePictureUpload from "@/components/upload/SinglePicture/index.vue";
defineOptions({
  name: "ArticleAddAndEditModal"
});
const emits = defineEmits(["update:show", "close"]);
const props = defineProps({
  show: Boolean,
  item: null
});
const { show, item: form } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
onBeforeMount(() => {
  getAllCategory().then((data: any) => {
    categorys.value = data;
  });
  getAllTag().then((data: any) => {
    tags.value = data;
  });
  getAllArticleType().then((data: any) => {
    articleTypes.value = data;
  });
  getContentStatus().then((data: any) => {
    contentStatus.value = data;
  });
});

const categorys = ref<any[]>([]);
const tags = ref<any[]>([]);
const articleTypes = ref<any[]>([]);
const contentStatus = ref<any[]>([]);
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("标题不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  cover: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.cover) {
          callback();
        } else {
          callback(new Error("文章封面不能为空!"));
        }
      }
    }
  ],
  category: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.categoryVo.id || form.value.categoryVo.name) {
          callback();
        } else {
          callback(new Error("文章类型不能为空!"));
        }
      }
    }
  ],
  tag: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.tagVos.length) {
          callback();
        } else {
          callback(new Error("文章标签不能为空!"));
        }
      },
      trigger: "change"
    }
  ],
  type: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("请选择文章类型!"));
        }
      },
      trigger: "change"
    }
  ],
  status: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("请选择文章状态!"));
        }
      },
      trigger: "change"
    }
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      if (form.value?.id) {
        updateArticle(form.value)
          .then(() => {
            ElMessage({
              message: "修改成功！",
              type: "success"
            });
            emits("close");
            visiable.value = false;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      } else {
        addArticle(form.value)
          .then(() => {
            ElMessage({
              message: "保存成功！",
              type: "success"
            });
            emits("close");
            visiable.value = false;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.value.title = "";
  form.value.type = "";
  form.value.status = "";
  form.value.note = "";
};
/**
 * 选中分类
 * @param item
 */
const selectCategory = (item: any) => {
  form.value.categoryVo.id = item.id;
  form.value.categoryVo.name = item.name;
};
/**
 * 删除选中的分类
 */
const deleteCategoryTag = () => {
  form.value.categoryVo.id = null;
  form.value.categoryVo.name = "";
};
/**
 * 可选择的标签数量
 */
const tagLength = ref<number>(3);
/**
 *
 * @param item 选中标签
 */
const selectTag = (item: any) => {
  const vos: any[] = form.value.tagVos ?? [];
  if (vos.length == tagLength.value) {
    ElMessage.info(`最多只能选择 ${tagLength} 个标签。`);
    return;
  }
  if (vos.length == tagLength.value) {
    return;
  }
  for (let i = 0; i < vos.length; i++) {
    const tagVo = vos[i];
    if ((item.id && tagVo.id == item.id) || tagVo.name == item.name) {
      return;
    }
  }
  vos.push({ id: item.id, name: item.name });
};
/**
 * 删除已经选择的标签
 */
const deleteTag = (item: any) => {
  const vos: any[] = form.value.tagVos ?? [];
  for (let i = 0; i < vos.length; i++) {
    const tagVo = vos[i];
    if ((item.id && tagVo.id == item.id) || tagVo.name == item.name) {
      vos.splice(i, 1);
      return;
    }
  }
};
/**
 * 查找当前标签是否已经被选中
 */
const isExist = (item: any): boolean => {
  const vos: any[] = form.value.tagVos ?? [];
  for (let i = 0; i < vos.length; i++) {
    const tagVo = vos[i];
    if ((item.id && tagVo.id == item.id) || tagVo.name == item.name) {
      return true;
    }
  }
  return false;
};
/**
 * 分类过滤输入框
 */
const categoryValue = ref<string>("");
/**
 * 标签过滤输入框
 */
const tagValue = ref<string>("");
/**
 * 展示过滤的标签
 */
const tagList = computed(() =>
  tags.value.filter((value: any) => {
    return value.name.indexOf(tagValue.value) >= 0;
  })
);
/**
 * 展示过滤的分类
 */
const categoryList = computed(() =>
  categorys.value.filter((value: any) => {
    return value.name.indexOf(categoryValue.value) >= 0;
  })
);

/**
 * 创建新的分类
 */
const createCategory = () => {
  // 检查是否是已经存在的分类，不是则添加，是则直接使用
  for (let i = 0; i < categorys.value.length; i++) {
    const cate = categorys.value[i];
    if (cate.name == categoryValue.value) {
      selectCategory(cate);
      return;
    }
  }
  selectCategory({
    id: null,
    name: categoryValue.value
  });
  categoryValue.value = "";
};
/**
 * 创建新的标签
 */
const createTag = () => {
  // 检查是否是已经存在的标签，不是则添加，是则直接使用
  for (let i = 0; i < tags.value.length; i++) {
    const cate = tags.value[i];
    if (cate.name == tagValue.value) {
      selectTag(cate);
      return;
    }
  }
  selectTag({
    id: null,
    name: tagValue.value
  });
  tagValue.value = "";
};
</script>

<template>
  <div>
    <el-dialog
      v-model="visiable"
      :title="form.id ? '编辑文章信息' : '新增文章信息'"
      class="form"
      style=""
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        status-icon
      >
        <el-form-item v-if="form.id" label="文章ID:">
          <el-input :disabled="true" :value="item?.id" />
        </el-form-item>
        <el-form-item label="文章标题:" prop="title">
          <el-input :disabled="true" v-model="form.title" placeholder="" />
        </el-form-item>
        <!-- <el-form-item label="内容:" prop="title">
        <el-input  v-model="form.content" placeholder="" />
      </el-form-item> -->
        <el-form-item label="文章分类:" prop="category">
          <el-tag
            class="selected-cate"
            closable
            v-if="form.categoryVo.name"
            @close="deleteCategoryTag()"
          >
            <span> {{ form.categoryVo.name }}</span>
          </el-tag>
          <el-popover
            v-if="!form.categoryVo.name"
            placement="top-start"
            title="选择分类"
            :width="300"
            trigger="click"
          >
            <template #reference>
              <el-button class="select-btn" type="primary">选择分类</el-button>
            </template>
            <div>
              <el-input
                type="text"
                v-model="categoryValue"
                @keydown.enter="createCategory"
                placeholder="输入进行筛选，Enter进行添加"
              />
              <div class="select">
                <div
                  class="cate-item"
                  v-for="item in categoryList"
                  :key="item.id"
                  @click="selectCategory(item)"
                >
                  {{ item.name }}
                </div>
                <div
                  class="cate-item"
                  v-for="item in categorys"
                  @click="selectCategory(item)"
                >
                  {{ item.name }}
                </div>
                <div
                  class="cate-item"
                  v-for="item in categorys"
                  @click="selectCategory(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章标签:" prop="tag">
          <span v-if="form.tagVos.length != 0">
            <el-tag
              class="selected-tag"
              type="success"
              closable
              v-for="item in form.tagVos"
              :key="item.id"
              @close="deleteTag(item)"
            >
              <span> {{ item.name }}</span>
            </el-tag>
          </span>
          <el-popover
            v-if="form.tagVos.length < tagLength"
            placement="top-start"
            title="选择标签"
            :width="380"
            trigger="click"
          >
            <template #reference>
              <el-button class="select-btn" type="primary">选择标签</el-button>
            </template>
            <div>
              <el-input
                type="text"
                v-model="tagValue"
                @keydown.enter="createTag"
                placeholder="输入进行筛选，Enter进行添加"
              />
              <div class="select">
                <el-tag
                  class="tag-item"
                  type="success"
                  :class="isExist(item) ? 'selected' : ''"
                  v-for="item in tagList"
                  @click="selectTag(item)"
                >
                  <span> {{ item.name }}</span>
                </el-tag>
              </div>
            </div>
          </el-popover>
        </el-form-item>

        <el-form-item label="文章封面:" prop="cover">
          <!-- <el-input v-model="form.cover" placeholder="文章封面" /> -->
          <single-picture-upload
            v-model:value="form.cover"
            dir="article"
            :width="'320px'"
            :height="'180px'"
          />
          <!-- @update:value="(url)=>form.cover=url" -->
        </el-form-item>
        <el-form-item label="文章类型:" prop="type">
          <!-- <el-input v-model="form.type" placeholder="选择文章类型" /> -->
          <el-select
            v-model="form.type"
            placeholder="选择文章类型"
            size="default"
            style="min-width: 120px"
          >
            <el-option
              v-for="item in articleTypes"
              :key="item.name"
              :label="item.label + '（' + item.name + '）'"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type == 'reprint'"
          label="原作者:"
          prop="originalAuthor"
        >
          <el-input
            v-model="form.originalAuthor"
            placeholder="输入文章原作者"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type == 'reprint'"
          label="原标题:"
          prop="originalTitle"
        >
          <el-input v-model="form.originalTitle" placeholder="输入文章原标题" />
        </el-form-item>
        <el-form-item
          v-if="form.type == 'reprint'"
          label="原链接:"
          prop="originalUrl"
        >
          <el-input v-model="form.originalUrl" placeholder="输入文章原链接" />
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.note"
            placeholder="输入备注信息"
          />
        </el-form-item>
        <el-form-item label="文章状态:" prop="status">
          <!-- <el-input v-model="form.status" placeholder="选择文章状态" /> -->
          <el-select
            v-model="form.status"
            placeholder="选择文章状态"
            size="default"
            style="min-width: 120px"
          >
            <el-option
              v-for="item in contentStatus"
              :key="item.name"
              :label="item.label + '（' + item.name + '）'"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否置顶:" prop="top">
          <el-switch v-model="form.top" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visiable = false">取消</el-button>
          <el-button v-if="!form.id" @click="resetForm()">重置</el-button>
          <el-button
            v-loading="loading"
            :disabled="loading"
            type="primary"
            @click="submitForm(formRef)"
          >
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.el-tag.is-closable.selected-cate {
  font-size: 16px;
  padding: 15px 8px;
}
.el-tag.is-closable.selected-tag {
  font-size: 15px;
  padding: 15px 8px;
}
.el-tag.is-closable.selected-tag {
  margin-right: 10px;
}
.select {
  margin-top: 15px;
  font-size: 15px;
  max-height: 180px;
  overflow-y: auto;
  .cate-item {
    padding: 10px 10px;
  }
  .cate-item:hover {
    background-color: rgb(233, 238, 239);
  }
  .tag-item {
    margin: 5px 0px;

    font-size: 14px;
    padding: 0px 8px;
  }
  .tag-item:not(:last-of-type) {
    margin-right: 10px;
  }
  .selected {
    background-color: rgb(199, 205, 206);
  }
}
</style>
