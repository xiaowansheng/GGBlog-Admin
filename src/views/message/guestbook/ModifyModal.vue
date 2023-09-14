<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";

import { Guestbook, updateLeaveWord } from "@/api/guestbook";
defineOptions({
  name: "CommentEditModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  item: null
});

const { show, item } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  // console.log(item?.value);

  form.id = item.value.id;
  form.hidden = item.value.hidden;
  form.review = item.value.review;

  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Guestbook>({
  id: null,
  review: null,
  hidden: null
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      
      loading.value = true
      updateLeaveWord(form).then(() => {
        ElMessage({
          message: "修改成功！",
          type: "success"
        });
        emits("refresh");
        visiable.value = false;
        
          loading.value=false
      }).catch(() => {
        
          loading.value=false
      })
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.review = null;
  form.hidden = null;
};
</script>

<template>
  <div>
    
  <el-dialog v-model="visiable" :title="'修改留言信息'" class="form" style="">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="left"
      status-icon
    >
      <el-form-item label="留言ID:">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="审核情况:">
        <el-radio-group v-model="form.review">
          <el-radio :label="1" size="large">通过</el-radio>
          <el-radio :label="0" size="large">待审核</el-radio>
          <el-radio :label="-1" size="large">未通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否隐藏:">
        <el-switch
          v-model="form.hidden"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <!-- <el-button @click="resetForm()">重置</el-button> -->
        <el-button v-loading="loading" :disabled="loading" type="primary" @click="submitForm(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>
