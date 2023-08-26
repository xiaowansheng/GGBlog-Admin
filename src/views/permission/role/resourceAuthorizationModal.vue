<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { ElTree } from "element-plus";
interface Tree {
  id: number;
  label: string;
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
watch(show, () => {
  visiable.value = show.value;
  if (visiable.value) {
    defaultSelected.value = [5, 7];
  }
  console.log(roleId.value);
});

watch(roleId, () => {
  if (roleId.value) {
    //更新角色菜单
  }
});
watch(visiable, () => {
  if (!visiable.value) {
    emits("update:show", false);
  }
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "label"
};
const defaultSelected = ref<number[]>([]);
// const setCheckedKeys = (arr: number[] = []) => {
//   selected = arr;
//   treeRef.value!.setCheckedKeys(arr, false);
// };
const tree: Tree[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1"
      }
    ]
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      {
        id: 5,
        label: "Level two 2-1"
      },
      {
        id: 6,
        label: "Level two 2-2"
      }
    ]
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1"
      },
      {
        id: 8,
        label: "Level two 3-2"
      }
    ]
  }
];
const submitForm = () => {
  const data = {
    roleId: roleId.value,
    menuIds: selected
  };
  console.log("submit!", data);
};
const selectAll = () => {
  const arr = [];
  tree.forEach(node => {
    if (node.children) {
      node.children.forEach(n => {
        arr.push(n.id);
      });
    }
  });
  selected = arr;
  treeRef.value!.setCheckedKeys(arr, false);
};
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false);
  selected = [];
};
let selected: number[] = [];
const check = (node: any, status: any) => {
  const { checkedNodes, checkedKeys } = status;
  console.log(checkedNodes, checkedKeys);
  const arr = [];
  for (let i = 0; i < checkedNodes.length; i++) {
    const temp = checkedNodes[i];
    console.log(temp);

    if (!temp.children || temp.children.length == 0) {
      arr.push(temp.id);
    }
  }
  selected = arr;
  console.log("选中的id", arr);
};
</script>

<template>
  <el-dialog v-model="visiable" :title="'设置角色资源权限'" class="form" style="">
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

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm()"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
