<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";

import { Friend, addFriend, updateFriend } from "@/api/friend";
defineOptions({
  name: "RoleAddAndModifyModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  item: null
});

const { show, item } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(show.value);
watch(show, () => {
  // console.log(item?.value);

  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.icon = item.value.icon;
    form.url = item.value.url;
    form.author = item.value.author;
    form.introduction = item.value.introduction;
    form.review = item.value.review;
  } else {
    resetForm();
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Friend>({
  id: null,
  name: "",
  icon: "",
  url: "",
  author: "",
  introduction: "",
  review: null,
  hidden: null
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("网站名称不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  url: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("网站地址不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  author: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("作者信息不能为空!"));
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
      loading.value = true;
      if (form.id) {
        updateFriend(null, { data: form })
          .then(() => {
            ElMessage({
              message: "修改成功！",
              type: "success"
            });
            emits("refresh");
            visiable.value = false;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      } else {
        addFriend(null, { data: form })
          .then(() => {
            ElMessage({
              message: "保存成功！",
              type: "success"
            });
            emits("refresh");
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
  form.id = null;
  form.name = "";
  form.icon = "http://";
  form.url = "http://";
  form.author = "";
  form.introduction = "";
  form.review = null;
  form.hidden = null;
};
</script>

<template>
  <div>
    <el-dialog
      v-model="visiable"
      :title="form.id ? '修改友链信息' : '新增友链信息'"
      class="form"
      style=""
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
        status-icon
      >
        <el-form-item v-if="form.id" label="友链ID">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="网站名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图标地址：" prop="icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="链接地址：" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="网站作者：" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="网站介绍：">
          <el-input
            v-model="form.introduction"
            :rows="3"
            type="textarea"
            placeholder="网站介绍"
          />
        </el-form-item>
        <el-form-item v-if="form.id" label="是否隐藏：">
          <el-switch
            v-model="form.hidden"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item v-if="form.id" label="审核情况：">
          <el-radio-group v-model="form.review">
            <el-radio :label="1" size="large">通过</el-radio>
            <el-radio :label="0" size="large">待审核</el-radio>
            <el-radio :label="-1" size="large">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visiable = false">取消</el-button>
          <el-button @click="resetForm()">重置</el-button>
          <el-button type="primary" @click="submitForm(formRef)">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
