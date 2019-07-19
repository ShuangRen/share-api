export interface IState {
	collapsed: boolean, // 是否收起
	openKeys: string[], // 展开的菜单key
	rootSubmenuKeys: string[], // 顶层key
	defaultSelectedKeys: string[] // 默认选择的 菜单
}
export interface INavChild {
	id: string,
	name: string,
	path: string,
	icon?: string
}
export interface INav {
	id: number,
	icon: string,
	name: string,
	options?: INavChild[]
}