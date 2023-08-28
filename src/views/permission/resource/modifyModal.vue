<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { Resource, addResource, updateResource } from "@/api/resource";
import { ElMessage } from "element-plus";
defineOptions({
  name: "MenuAddAndModifyModal"
});
const emits = defineEmits(["update:show", "refresh"]);
const props = defineProps({
  show: Boolean,
  isChildren: Boolean,
  parentId: Number,
  parentName: String,
  item: null
});

const { show, isChildren, parentId, item } = toRefs(props);
const visiable = ref(show.value);
watch(show, () => {
  // console.log(item?.value);
  if (item?.value != null) {
    form.id = item.value.id;
    resetForm()
  } else {
    resetForm();
    form.id = null;
    form.parentId=parentId?.value
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Resource>({
  id: null,
  name: "",
  requestMethod: null,
  path: "",
  parentId: null,
  open: 0,
  description: ""
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("资源称不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  requestMethod: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!isChildren||value) {
          callback();
        } else {
          callback(new Error("请求方式不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  path: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("访问路径不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      if (form.id) {
        updateResource(null, { data: form }).then(() => {
          ElMessage({
            message: "修改成功！",
            type: "success"
          });
          emits("refresh");
          visiable.value = false;
        });
      } else {
        addResource(null, { data: form }).then(() => {
          ElMessage({
            message: "保存成功！",
            type: "success"
          });
          emits("refresh");
          visiable.value = false;
        });
      }
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.name = "";
  form.requestMethod = null;
  form.path = "";
  form.parentId = null;
  form.open = 0;
  form.description = "";
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="form.id ? '修改资源信息' : '新增资源信息'"
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
      <el-form-item v-if="!form.id" label="资源类型">
        <el-input :value="isChildren ? '接口' : '模块'" disabled />
      </el-form-item>
      <el-form-item v-if="!form.id && parentName" label="模块">
        <el-input :value="parentName" disabled />
      </el-form-item>
      <el-form-item v-if="form.id" label="模块ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item :label="isChildren?'接口名称':'模块名称'" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-if="isChildren" label="请求方法" prop="requestMethod">
                <el-select
              v-model="form.requestMethod"
              placeholder="选择请求方法"
              size="default"
              style="min-width: 120px"
            >
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
            </el-select>
      </el-form-item>
      <el-form-item   label="访问路径" prop="path">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="是否开放">
        <el-switch
          v-model="form.open"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
        />
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
</template>

<style lang="scss" scoped></style>
