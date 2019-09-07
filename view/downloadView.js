/**
* 备注：下载中
* create by Mark at 2019-September
*/
import React, { Component } from 'react';
import { 
		View,
		Text,
		Image,
		TouchableOpacity,
		StyleSheet,
		ViewStyle
} from 'react-native';
import { 
	DownloadProgress,
 } from "react-native-code-push";

type Props = {
		style : ViewStyle,
		progress : DownloadProgress,
		prgressColor:String,//进度条颜色
		
};
type State = {};


const CONTENT_WIDTH : Number = 220;
export class DownloadView extends Component <Props,State>{
		static defaultProps :Props = {
			prgressColor : 'red',
		}
		state:State={
		}
		render(){
				const {style,progress,prgressColor} = this.props;
				
				const p : DownloadProgress = progress || {receivedBytes:0,totalBytes:100};
				const currentProgress:Number = p.receivedBytes / p.totalBytes ;
				const progressWidth : Number = CONTENT_WIDTH * currentProgress ;

				return (
						<View style={[styles.container,style]}>
							<View
								style={[styles.progress,{width:CONTENT_WIDTH}]}>
								<View style={[styles.bg,{width:progressWidth}]}/>
								<Text style={styles.progressTxt}>{parseInt(currentProgress*100)}%</Text>
							</View>
						</View>
				)
		}
}


const styles = StyleSheet.create({
		container:{
			width:'100%',
			height:80,
			padding:20,
			alignItems:'center',
			justifyContent:'center',
		},
		progress : {
			height:30,
			borderRadius:15,
			backgroundColor: 'rgb(220,220,220)',
			alignItems:'center',
			justifyContent:'center',
			overflow:'hidden',
		},
		bg:{
			height : '100%',
			left:0,
			top:0,
			position: 'absolute',
		},
		progressTxt:{
			color:'white',
		}
})