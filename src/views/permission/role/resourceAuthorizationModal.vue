<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { ElTree, ElMessage } from "element-plus";
import { getTree } from "@/api/resource";
import { getRoleResource, updateRoleResources } from "@/api/role";
interface Tree {
  id: number;
  name: string;
  title: string;
  children?: Tree[];
}
defineOptions({
  name: "ResourceAuthorizationModal"
});
const emits = defineEmits(["update:show"]);
const props = defineProps({
  show: Boolean,
  roleId: Number
});

const { show, roleId } = toRefs(props);
const visiable = ref(show.value);
const loading = ref<boolean>(false);
watch(show, () => {
  visiable.value = show.value;
  if (visiable.value) {
    loading.value = true;
    // 获取菜单树
    getTree()
      .then((data: any) => {
        tree.value = data;
        getRoleResource(roleId!.value).then((list: any) => {
          const arr: any = [];
          list.forEach(m => {
            arr.push(m.menuId);
          });
          defaultSelected.value = arr;
          loading.value = false;
        });
      })
      .catch(() => {
        loading.value = false;
      });
  } else {
    tree.value = [];
    defaultSelected.value = [];
  }
  console.log(roleId?.value);
});

// watch(roleId, () => {
//   if (roleId.value) {
//     //更新角色菜单
//   }
// });
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "title"
};
const defaultSelected = ref<number[]>([]);
// const setCheckedKeys = (arr: number[] = []) => {
//   selected = arr;
//   treeRef.value!.setCheckedKeys(arr, false);
// };
const tree = ref<Tree[]>([]);
const btnLoading = ref<boolean>(false);
const submitForm = () => {
  if (selected.value.length == 0) {
    return;
  }
  btnLoading.value = true;
  const data: any = [];
  selected.value.forEach(menuId => {
    console.log("submit!", data);
    data.push({
      roleId: roleId!.value,
      menuId
    });
  });
  updateRoleResources(null, { data })
    .then(() => {
      ElMessage({
        message: "资源权限授权成功！",
        type: "success"
      });
      visiable.value = false;
      btnLoading.value = false;
    })
    .catch(() => {
      btnLoading.value = false;
    });
};
const selectAll = () => {
  const arr: any = [];
  tree.value.forEach(node => {
    if (node.children) {
      node.children.forEach((n: any) => {
        arr.push(n.id);
      });
    }
  });
  selected.value = arr;
  treeRef.value!.setCheckedKeys(arr, false);
};
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false);
  selected.value = [];
};
let selected = ref<number[]>([]);
const check = (node: any, status: any) => {
  const { checkedNodes, checkedKeys } = status;
  console.log(checkedNodes, checkedKeys);
  const arr: any = [];
  for (let i = 0; i < checkedNodes.length; i++) {
    const temp = checkedNodes[i];
    console.log(temp);

    if (!temp.children || temp.children.length == 0) {
      arr.push(temp.id);
    }
  }
  selected.value = arr;
  console.log("选中的id", arr);
};
</script>

<template>
  <el-dialog
    v-model="visiable"
    :title="'设置角色资源权限'"
    class="form"
    style=""
  >
    <div v-loading="loading">
      <div class="buttons">
        <el-button @click="selectAll()">全选</el-button>
        <el-button @click="resetChecked()">重置</el-button>
      </div>
      <el-tree
        ref="treeRef"
        :data="tree"
        show-checkbox
        node-key="id"
        highlight-current
        :props="defaultProps"
        @check="check"
        :default-checked-keys="defaultSelected"
      />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="btnLoading || selected.length == 0"
          v-loading="btnLoading"
          @click="submitForm()"
        >
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.buttons {
  margin-bottom: 15px;
}
</style>
