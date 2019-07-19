import asyncComponent from '@/components/asyncComponent';
import common from '@/routers/common';
import center from '@/routers/center.ts';

export default [
  {
    component: asyncComponent(() => import('@/containers/setting')),
    exact: true,
    path: '/setting',
  },
  ...center,
  ...common,
  {
    component: asyncComponent(() => import('../containers/home')),
    exact: true,
    path: '/',
  },
];

