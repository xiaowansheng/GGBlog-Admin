<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { updateSimpleArticle } from "@/api/article";
defineOptions({
  name: "ArticleEditModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  contentStatus: null,
  articleTypes: null,

  item: null
});
const roles = ref<any>([]);
const { show, item, articleTypes, contentStatus } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  if (item?.value) {
    form.id = item.value.id;
    form.title = item.value.title;
    form.type = item.value.type;
    form.originalAuthor = item.value.originalAuthor;
    form.originalTitle = item.value.originalTitle;
    form.originalUrl = item.value.originalUrl;
    form.status = item.value.status;
    form.note = item.value.note;
    form.top = item.value.top;
  } else {
    form.id = null;
    resetForm();
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<any>({
  id: null,
  title: "",
  type: "",
  originalAuthor: "",
  originalTitle: "",
  originalUrl: "",
  status: "",
  note: "",
  top: 0
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  id: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("没有选中文章!"));
        }
      },
      trigger: "blur"
    }
  ],
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
      updateSimpleArticle(form).then(() => {
        ElMessage({
          message: "修改成功！",
          type: "success"
        });
        emits("refresh");
        visiable.value = false;
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.title = "";
  form.type = "";
  form.status = "";
  form.note = "";
};
</script>

<template>
  <el-dialog v-model="visiable" :title="'修改文章信息'" class="form" style="">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
      status-icon
    >
      <el-form-item v-if="form.id" label="ID:">
        <el-input :disabled="true" :value="item?.id" />
      </el-form-item>
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" placeholder="" />
      </el-form-item>
      <!-- <el-form-item label="内容:" prop="title">
        <el-input  v-model="form.content" placeholder="" />
      </el-form-item> -->
      <el-form-item label="类型:" prop="type">
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
        <el-input v-model="form.originalAuthor" placeholder="输入文章原作者" />
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
      <el-form-item label="备注:" prop="note">
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
</template>
