import { $t } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "homeFilled",
    title: $t("menus.home"),
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/home/welcome/index.vue"),
      meta: {
        title: $t("menus.welcome"),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/analysis",
      name: "Analysis",
      component: () => import("@/views/home/analysis/index.vue"),
      meta: {
        title: $t("menus.analysis"),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
