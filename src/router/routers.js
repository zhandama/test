import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/goods/goods-list.vue')
      }
    ]
  },
  {
    path: '/goods',
    name: 'goods',
    component: Main,
    meta: {
      icon: 'md-list',
      title: '商品管理'
    },
    children: [
      {
        path: 'goodslist',
        name: 'goodslist',
        meta: {
          icon: 'md-list',
          title: '商品列表'
        },
        component: () => import('@/view/goods/goods-list.vue')
      }, {
        path: 'category',
        name: 'category',
        meta: {
          icon: 'md-menu',
          title: '家具类型'
        },
        component: () => import('@/view/goods/category-list.vue')
      }, {
        path: 'property',
        name: 'property',
        meta: {
          icon: 'md-menu',
          title: '商品属性'
        },
        component: () => import('@/view/goods/property-list.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'orderlist',
        name: 'orderlist',
        meta: {
          icon: 'md-menu',
          title: '订单管理'
        },
        component: () => import('@/view/order/order-list.vue')
      }
    ]
  },
  {
    path: '/score',
    name: 'score',
    component: Main,
    meta: {
      icon: 'md-list',
      title: '积分管理'
    },
    children: [
      {
        path: 'list',
        name: 'scorelist',
        meta: {
          icon: 'ios-people',
          title: '积分列表'
        },
        component: () => import('@/view/user/score-list.vue')
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    component: Main,
    meta: {
      icon: 'md-list',
      title: '前台设置'
    },
    children: [
      {
        path: 'banner',
        name: 'banner',
        meta: {
          icon: 'ios-people',
          title: '首页轮播图'
        },
        component: () => import('@/view/news/banner.vue')
      },
      {
        path: 'indexcont',
        name: 'indexcont',
        meta: {
          icon: 'ios-people',
          title: '首页尾部展示栏位'
        },
        component: () => import('@/view/news/indexcont.vue')
      },
      {
        path: 'case',
        name: 'case',
        meta: {
          icon: 'ios-people',
          title: '设计案例'
        },
        component: () => import('@/view/news/case.vue')
      },
      {
        path: 'arts',
        name: 'arts',
        meta: {
          icon: 'ios-people',
          title: '视觉形象 '
        },
        component: () => import('@/view/news/arts.vue')
      },
    ]
  },
  {
    path: '/frontuser',
    name: 'frontuser',
    component: Main,
    meta: {
      icon: 'md-list',
      title: '前台用户'
    },
    children: [
      {
        path: 'list',
        name: 'frontuserlist',
        meta: {
          icon: 'md-list',
          title: '前台用户列表'
        },
        component: () => import('@/view/user/buyer-list.vue')
      },
      {
        path: 'design',
        name: 'design',
        meta: {
          icon: 'md-list',
          title: '设计师审核'
        },
        component: () => import('@/view/user/design-list.vue')
      },
      {
        path: 'yewuyuan',
        name: 'yewuyuan',
        meta: {
          icon: 'md-list',
          title: '业务员审核'
        },
        component: () => import('@/view/user/yewuyuan-list.vue')
      },
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: Main,
    meta: {
      icon: 'md-list',
      title: '后台管理'
    },
    children: [
      {
        path: 'list',
        name: 'userlist',
        meta: {
          icon: 'ios-people',
          title: '后台用户列表'
        },
        component: () => import('@/view/user/user-list.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
