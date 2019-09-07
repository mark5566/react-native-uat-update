/**
* 备注：头部内容
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
import { UpdateProp } from 'react-native-uat-update/index.model';
import { defaultHeaderContainer } from 'react-native-uat-update/index.default';
import { State as VersionState } from "../index";
type Props = {
		style : ViewStyle,
		data  : VersionState,
};
type State = {};

export class HeaderDetault extends Component <Props,State>{
		static defaultProps :Props = {
		}
		state:State={
		}
		render(){
				const {style,data} = this.props;
				const updateProps:UpdateProp = data.data;
				return (
						<View style={[styles.container,style,defaultHeaderContainer]}>
								<Image source={require('../resource/update_bg.png')} style={styles.bg}/>
								<View style={styles.txtContainer}>
									<Text style={styles.titleTxt}>{updateProps.title}</Text>
									<Text style={styles.versionTxt}>{updateProps.version}</Text>
								</View>
						</View>
				)
		}
}

const styles = StyleSheet.create({
		container:{

		},
		bg:{
			width:'100%',
			height:'100%',
			borderTopLeftRadius:10,
			borderTopRightRadius:10,
		},
		txtContainer:{
			padding:30,
			position:'absolute',
			top:0,
			left:0,
			width:'100%',
			height:'100%',
			// backgroundColor: 'red',
			
		},
		titleTxt:{
			color:'white',
			fontSize:20,
			fontWeight:'600',
		},
		versionTxt:{
			marginTop:15,
			color:'white',
			fontSize:16,
			fontWeight:'500'
		}
})