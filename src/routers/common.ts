import asyncComponent from '@/components/asyncComponent';

export default [
  {
    component: asyncComponent(() => import('../containers/noauthorize')),
    path: '/noauthorize'
  },
  {
    component: asyncComponent(() => import('../containers/notfound')),
    path: '/:any'
  }
];