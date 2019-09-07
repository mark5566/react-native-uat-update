/**
* 备注：发现新版本
* create by Mark at 2019-September
*/
import React, { Component } from 'react';
import { 
		View,
		Text,
		Image,
		TouchableOpacity,
		StyleSheet,
		ViewStyle,
		ScrollView,
		FlatList,
} from 'react-native';
import { 
	AppInfo, UpdateProp,
 } from "../index.model";
type Props = {
		style : ViewStyle,
		onClick:()=>{},
		data : UpdateProp,
		themeColor:String,
};
type State = {
	
};

export class FindNewUpdate extends Component <Props,State>{
		static defaultProps :Props = {
		}
		state:State={
		}

		/**点击更新 */
		onClickUpdate = ()=>{
			this.props.onClick && this.props.onClick();
		}

		render(){
				const {style,data,themeColor} = this.props;
				// const {data} = this.state;
				return (
						<View 
								onStartShouldSetResponder={()=>true}					
								style={[styles.container,style]}>
								
								<ScrollView 
									style={styles.content}>
									
									<Text style={styles.txt}>更新包大小:{parseFloat(data.size).toFixed(1)}MB</Text>
									<Text style={[styles.txt,styles.titleTxt]}>更新说明:</Text>
									{
										data.newFeature.map((item,index)=><Text style={styles.des} key={`${index}`}>{item}</Text>)
									}
									{
										data.newFeature.map((item,index)=><View><Text style={styles.des} key={`${index}`}>{item}</Text></View>)
									}

								</ScrollView>
									
									<View style={styles.footer}>
									<TouchableOpacity
										onPress={this.onClickUpdate}
										style={[styles.installBtn,{backgroundColor:themeColor}]}>
										<Text style={styles.installBtnTitle}>立即更新</Text>
									</TouchableOpacity>
								</View>
						</View> 
				)
		}
}

export const styles = StyleSheet.create({
		container:{
			padding:20,
			flex:1,
			justifyContent:'space-between',
			// alignItems:'center',
			
		},
		content:{
			// flex:1,
			// height:'100%',
		},
		txt:{
			color:'#999999',
			marginTop:4,
			fontWeight:'200'
		},
		titleTxt:{
			fontSize:14,
			color:'black',
			fontWeight:'600',
			paddingVertical:10,
		},
		installBtn:{
			width:'100%',
			height:30,
			borderRadius:15,
			alignItems:'center',
			justifyContent:'center',
			// paddingVertical:5,
		},
		footer:{
			width:'100%',
			alignItems:'center',
			justifyContent:'center',
			// height:50,
			// backgroundColor: 'red',
			marginTop:10,
			
		},
		installBtnTitle:{
			color:'white',
		},
		des:{
			marginTop:4,
			// color:'rgb(50,50,50)',
			fontWeight:'300',
		}

})