//默认样式

//默认蒙层样式透明度
export const defaultModelStyle = {
	backgroundColor : 'rgba(0,0,0,0.5)',
}

//默认容器样式
export const defaultContainerStyle = {
	width : 269,
	height: 374,
	backgroundColor: 'white',
	borderRadius: 10,
	// overflow: 'hidden', <<----切忌不要设置这个属性，否则无法超出容器显示了
}

//默认头部样式
export const defaultHeaderContainer = {
	borderTopLeftRadius: defaultContainerStyle.borderRadius,
	borderTopRightRadius: defaultContainerStyle.borderRadius,
	height : 130,
	width:'100%'
}



