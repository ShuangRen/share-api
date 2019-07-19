
import asyncComponent from '@/components/asyncComponent';

const routers: any = [];

routers.push({
  component: asyncComponent(() => import('../containers/home/list')),
  path: `/:key/list/:tag`
}, {
    component: asyncComponent(() => import('../containers/home/detailHOC')),
    path: `/:key/detail`
  },
  {
    component: asyncComponent(() => import('../containers/home')),
    path: `/:key`
  }
)

export default routers;