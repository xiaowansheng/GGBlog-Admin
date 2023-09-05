<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { onBeforeMount, reactive, ref, toRefs, watch } from "vue";

import { Article,getAllArticleType, addArticle, updateArticle
} from "@/api/article";

import { getContentStatus } from "@/api/common";
import { getAllCategory } from "@/api/category";
import { getAllTag } from "@/api/tag";

defineOptions({
  name: "ArticleAddAndEditModal"
});
const emits = defineEmits(["update:show", "close"]);
const props = defineProps({
  show: Boolean,
  item: null
});
const { show, item:form } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  // console.log(item.value);

  // if (item.value?.id) {
  //   form.id = item.value.id;
  //   form.name = item.value.name;
  //   form.description = item.value.description;
  //   form.hidden = item.value.hidden;
  // } else {
  //   form.id = null;
  //   resetForm();
  // }
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
})

const categorys = ref<any[]>([]);
const tags = ref<any[]>([]);
const articleTypes = ref<any[]>([]);
const contentStatus = ref<any[]>([]);
// const form = reactive<Article>({
//   id: null,
//   name: "",
//   description: "",
//   hidden: 0
// });
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
        if (value) {
          callback();
        } else {
          callback(new Error("文章封面不能为空!"));
        }
      },
      trigger: "change"
    }
  ],
  category: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("文章类型不能为空!"));
        }
      },
      trigger: "change"
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
      trigger: "blur"
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
      trigger: "blur"
    }
  ]
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      if (form.value?.id) {
        updateArticle(form.value).then(() => {
          ElMessage({
            message: "修改成功！",
            type: "success"
          });
          emits("close");
          visiable.value = false;
        });
      } else {
        addArticle(form.value).then(() => {
          ElMessage({
            message: "保存成功！",
            type: "success"
          });
          emits("close");
          visiable.value = false;
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
          <!-- <el-input  v-model="form.categoryVo.id" placeholder="请选择文章分类" /> -->
          <el-select
            v-model="form.categoryVo.id"
            placeholder="选择文章类型"
            size="default"
            style="min-width: 120px"
          >
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签:" prop="tag">
          <!-- <el-input   placeholder="请选择文章标签" /> -->
          <el-select
            placeholder="选择标签类型"
            size="default"
            style="min-width: 120px"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="文章封面:" prop="cover">
          <el-input v-model="form.cover" placeholder="文章封面" />
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
        <el-form-item v-if="form.type=='reprint'" label="原作者:" prop="originalAuthor">
          <el-input
            v-model="form.originalAuthor"
            placeholder="输入文章原作者"
          />
        </el-form-item>
        <el-form-item v-if="form.type=='reprint'" label="原标题:" prop="originalTitle">
          <el-input v-model="form.originalTitle" placeholder="输入文章原标题" />
        </el-form-item>
        <el-form-item v-if="form.type=='reprint'" label="原链接:" prop="originalUrl">
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
          <el-button type="primary" @click="submitForm(formRef)">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
