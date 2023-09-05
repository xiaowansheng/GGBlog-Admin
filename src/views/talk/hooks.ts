import { isString, isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import {
  useRouter,
  useRoute,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";

export function useDetail() {
  console.log(
    "useMultiTagsStoreHook()",
    useMultiTagsStoreHook().$state
  );
  
  console.log(
    "usePermissionStoreHookusePermissionStoreHook()",
    usePermissionStoreHook().$state
  );
  
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;

  let tag: any = {};
  function toDetail(parameter: LocationQueryRaw | RouteParamsRaw) {
    // ⚠️ 这里要特别注意下，因为vue-router在解析路由参数的时候会自动转化成字符串类型，比如在使用useRoute().route.query或useRoute().route.params时，得到的参数都是字符串类型
    // 所以在传参的时候，如果参数是数字类型，就需要在此处 toString() 一下，保证传参跟路由参数类型一致都是字符串，这是必不可少的环节！！！
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    const name = "TalkEdit";
    tag = {
      path: `/talk/edit/:id`,
      name: name,
      params: parameter,
      meta: {
        title: {
          zh: `编辑说说-${parameter.id}`,
          en: `EditTalk-${parameter.id}`
        }
        // 如果使用的是非国际化精简版title可以像下面这么写
        // title: `No.${index} - 详情信息`,
      }
    };
    useMultiTagsStoreHook().handleTags("push", tag);
    router.push({name:name,params:parameter});
  }

  // 用于页面刷新，重新获取浏览器地址栏参数并保存到标签页
  const initToDetail = () => {
    console.log("route", route);
    if (getParameter) toDetail(getParameter);
  };

  const close = (isAdd: boolean = true) => {

    if (isAdd) {
      useMultiTagsStoreHook().handleTags("splice", route.path);
    } else {
      useMultiTagsStoreHook().handleTags("spliceById", {
        name: tag.name,
        id: tag.params.id
      });
    }
    
    router.push({ name: "TalkList" });
  };

  return { toDetail, initToDetail, getParameter, router, close };
}
