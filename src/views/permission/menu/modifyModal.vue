<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, toRefs, watch } from "vue";
import { Menu, addMenu, updateMenu } from "@/api/menu";
import { ElMessage } from "element-plus";
import IconSelect from "@/components/ReIcon/src/Select.vue";
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

const { show, isChildren, parentId, parentName, item } = toRefs(props);
const visiable = ref(show.value);
const loading = ref(false);
watch(show, () => {
  // console.log(item?.value);
  if (item?.value != null) {
    form.id = item.value.id;
    form.name = item.value.name;
    form.title = item.value.title;
    form.icon = item.value.icon;
    form.redirect = item.value.redirect;
    form.path = item.value.path;
    form.component = item.value.component;
    form.parentId = item.value.parentId;
    form.hidden = item.value.hidden;
    form.sort = item.value.sort;
    form.description = item.value.description;
  } else {
    resetForm();
    form.id = null;
    form.parentId = parentId?.value;
  }
  visiable.value = show.value;
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});
const form = reactive<Menu>({
  id: null,
  name: "",
  title: "",
  icon: "",
  redirect: "",
  path: "",
  component: "",
  parentId: null,
  hidden: 0,
  sort: 0,
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
          callback(new Error("菜单名称不能为空!"));
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
          callback(new Error("菜单标题不能为空!"));
        }
      },
      trigger: "blur"
    }
  ],
  icon: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          callback();
        } else {
          callback(new Error("菜单图标不能为空!"));
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
  componnet: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value || parentId?.value) {
          callback();
        } else {
          callback(new Error("组件位置不能为空!"));
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
        updateMenu(null, { data: form })
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
        addMenu(null, { data: form })
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
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = () => {
  form.name = "";
  form.title = "";
  form.icon = "";
  form.redirect = "";
  form.path = "";
  form.component = "";
  form.parentId = parentId!.value;
  form.hidden = 0;
  form.sort = 0;
  form.description = "";
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="form.id ? '修改菜单信息' : '新增菜单信息'"
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
      <el-form-item v-if="!form.id" label="菜单类型">
        <el-input :value="isChildren ? '子目录菜单' : '根目录菜单'" disabled />
      </el-form-item>
      <el-form-item v-if="isChildren" label="父菜单名称">
        <el-input :value="parentName" disabled />
      </el-form-item>
      <el-form-item v-if="form.id" label="菜单ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="菜单标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <!-- <el-input v-model="form.icon" /> -->
        <IconSelect v-model="form.icon" />
      </el-form-item>
      <el-form-item label="访问路径" prop="path">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="重定向">
        <el-input v-model="form.redirect" />
      </el-form-item>
      <el-form-item v-if="form.parentId" label="组件地址" prop="component">
        <el-input v-model="form.component" />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-switch
          v-model="form.hidden"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="排序等级" prop="label">
        <el-input type="number" v-model="form.sort" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" v-loading="loading" :disabled="loading" @click="submitForm(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
