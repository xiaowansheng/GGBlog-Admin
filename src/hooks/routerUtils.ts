import { isString, isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import {
  useRouter,
  useRoute,
  RouteRecordName
} from "vue-router";
interface Detail {
  name: RouteRecordName;
  id: string;
}
export function useDetail() {
  console.log("Tags", useMultiTagsStoreHook().$state.multiTags);

  console.log("Menus", usePermissionStoreHook().$state.wholeMenus);
  const menus = usePermissionStoreHook().$state.wholeMenus;
  const tags = useMultiTagsStoreHook().$state.multiTags;
  const route = useRoute();
  const router = useRouter();
  const getParameter =  route.params;

  // 用于页面刷新，重新获取浏览器地址栏参数并保存到标签页
  const initToDetail = () => {
    if (getParameter) {
      const parameter = getParameter;
      // ⚠️ 这里要特别注意下，因为vue-router在解析路由参数的时候会自动转化成字符串类型，比如在使用useRoute().route.query或useRoute().route.params时，得到的参数都是字符串类型
      // 所以在传参的时候，如果参数是数字类型，就需要在此处 toString() 一下，保证传参跟路由参数类型一致都是字符串，这是必不可少的环节！！！
      Object.keys(parameter).forEach(param => {
        if (!isString(parameter[param])) {
          parameter[param] = parameter[param].toString();
        }
      });
      const tag = {
        path: `${route.path}`,
        name: route.name,
        params: parameter,
        meta: {
          title: `${route.meta.title}-${parameter.id}`
          // 如果使用的是非国际化精简版title可以像下面这么写
          // title: `No.${index} - 详情信息`,
        }
      };
    // console.log("route", route);
      useMultiTagsStoreHook().handleTags("push", tag);
      router.push({ name: route.name, params: parameter });
    }
  };

  const closeToPage = (toName:string) => {
      if (route.params.id) {
        useMultiTagsStoreHook().handleTags<Detail>("spliceById", {
          name: route.name,
          id: route.params.id
        });
      } else {
        useMultiTagsStoreHook().handleTags("splice", route.path);
      }

    router.push({ name: toName });
  };

  return { initToDetail, getParameter, router, route, closeToPage };
}
