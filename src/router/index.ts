import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/index.vue" as any),
    meta: { public: true, layout: false },
  },
  {
    path: "/",
    component: () => import("@/views/Layout/index.vue" as any),
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/Home/index.vue" as any),
        meta: { title: "学习通" },
      },
      {
        path: "courses",
        name: "courses",
        component: () => import("@/views/Courses/index.vue" as any),
        meta: { title: "我的课程" },
      },
      {
        path: "timer",
        name: "timer",
        component: () => import("@/views/Timer/index.vue" as any),
        meta: { title: "专注计时" },
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/views/Profile/index.vue" as any),
        meta: { title: "我的" },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/Settings/index.vue" as any),
        meta: { title: "设置" },
      },
      {
        path: "CDP",
        name: "CDP",
        component: () => import("@/views/CDP/index.vue" as any),
        meta: { title: "CDP转发" },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/home" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  const token = localStorage.getItem("xxt_token");
  if (!to.meta.public && !token) return { name: "login" };
  // if (to.name === "login" && token) return { name: "home" };
  return true;
});

export default router;
