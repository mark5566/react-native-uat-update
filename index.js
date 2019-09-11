/**
* 备注：更新检测：包含热更新、appstore更新检测
* create by Mark at 2019-August
*/
import React, { Component } from 'react';
import { 
		View,
		Text,
		Image,
		TouchableOpacity,
		StyleSheet,
		ViewStyle,
		Modal,
		ScrollView,
		TouchableWithoutFeedback,
		Linking,
} from 'react-native';
import { UpdateProp,AppInfo,AppStoreResponse, UpdateStatus, } from './index.model';
import CodePush, { 
	DownloadProgress,
	DownloadProgressCallback,
	RemotePackage,
	LocalPackage,
 } from "react-native-code-push";
import DeviceInfo from "react-native-device-info";
import { FindNewUpdate } from 'react-native-uat-update/view/findNewUpdate';
import { HeaderDetault } from "react-native-uat-update/view/headerDefault";
import { defaultContainerStyle, defaultModelStyle, defaultHeaderContainer } from 'react-native-uat-update/index.default';
import { DownloadView } from 'react-native-uat-update/view/downloadView';

type Props = {
		style : ViewStyle,
		appleid         : String,//appleID，必须
		
		supportCodePush : Boolean,//是否支持热更新
		codepushKey     : String,//热更新检测地址
		codepushDebugKey: String,//热更新测试版本key
		forceUpdate     : Boolean,//是否强制更新

		wrapper    : (state:State)=>View,//容器
		themeColor 			: String,//主题颜色

		onCheckingAppStore : ()=>{},//检查appstore
		onCheckedAppStore  : (update:UpdateProp)=>{},//检查到appstore版本有更新
		onAppStoreNoUpdate : ()=>{},//appStore没有更新
		onAppStoreException: (e:String)=>{},//检查appstore版本异常
		onCheckingCodepush : ()=>{},//开始检查codepush
		onCodepushHasUpdate: (update:UpdateProp)=>{},//codepush有更新
		onCodepushNoUpdate : ()=>{},//codepush暂无更新
		onCPDownloading    : (progress:DownloadProgress)=>{},//正在下载bundle
		onCPInstalling     : ()=>{},//正在安装
		onCPInstallComplete: ()=>{},//安装完成
		onRestart 				 : ()=>{},//重启
};
export type State = {
	data : UpdateProp,
	show : Boolean,
	status : UpdateStatus,
	downloadProgress:DownloadProgress,
	remtePackage:?RemotePackage,
};

const Header = (state:State)=>{
	return (
		<View style={{backgroundColor:'red',width:300,height:100}}>
			<Text>{state.data.title}</Text>
		</View>
	)
}

export class Version extends Component <Props,State>{
		static defaultProps :Props = {
			style:defaultContainerStyle,

			supportCodePush : true,
			codepushKey : '',
			codepushDebugKey:'',
			appleid : '1448092987',
			forceUpdate:true,
			themeColor : 'rgb(230,180,120)',
			wrapper : (state:State)=><HeaderDetault data={state}/>,
			
			onCheckingAppStore : ()=>{},//检查appstore
			onCheckedAppStore  : (update:UpdateProp)=>{},//检查到appstore版本有更新
			onAppStoreNoUpdate : ()=>{},//appStore没有更新
			onAppStoreException: (e:String)=>{},//检查appstore版本异常
			onCheckingCodepush : ()=>{},//开始检查codepush
			onCodepushHasUpdate: (update:UpdateProp)=>{},//codepush有更新
			onCodepushNoUpdate : ()=>{},//codepush暂无更新
			onCPDownloading    : (progress:DownloadProgress)=>{},//正在下载bundle
			onCPInstalling     : ()=>{},//正在安装
			onCPInstallComplete: ()=>{},//安装完成
			onRestart 				 : ()=>{},//重启

			
			
		}
		state:State={
			data : {
				title:'检查更新',
			},
			show : false,
			status: UpdateStatus.NoCheck,
			remotePackage:null
		}

		//修改当前状态
		onChangeStatus = (status:UpdateStatus)=>{
			console.log(`当前状态:${status}`);
			this.setState({status : status,
										data:{
											...this.state.data,
											title:status
										}},
										()=>{
											if(status == UpdateStatus.AppStoreHasUpdate || status == UpdateStatus.CodepushHasUpdate){
												this.onChangeModal(true)
											}
										});
		}

		//显示模态窗
		onChangeModal = (show:?Boolean)=>{
			if(this.state.show == show){
				return ;
			}
			this.setState({show:show==undefined||show==null?!this.state.show:show});
		}

		componentDidMount(){
			this.setup();
		}

		/**检查appstore版本 */
		checkAppStore= async():?UpdateProp=>{
			let appleid:String = this.props.appleid;
			let url:String = `http://itunes.apple.com/lookup?id=${appleid}`;
			this.onChangeStatus(UpdateStatus.CheckingAppStore);
			let appInfo : AppStoreResponse = await fetch(url).then(res=>res.json());
			console.log(`appstore请求结果:${JSON.stringify(appInfo)}`);
			try {
				if(appInfo && appInfo.resultCount==1){
					let update : UpdateProp = new UpdateProp(appInfo.results[0]);
					return update
				}else{
					return null;
				}
			} catch (error) {
				console.log(`请求appstore版本异常:${JSON.stringify(error)}`)
				return null;
			}
		}

		/**检查codepush版本 */
		checkCodepush= async():Promise<?RemotePackage>=>{
			console.log(`__dev__:${__DEV__}`)
			const key : String = __DEV__ === true ? this.props.codepushDebugKey : this.props.codepushKey
			let remotePackage : ?RemotePackage = await CodePush.checkForUpdate(key);
			return remotePackage ;
		}

		onDownloadProgress = (p:DownloadProgress)=>{
			this.setState({downloadProgress:p})
		}

		onError= (err)=>{
			console.log(err);
		}

		/**下载codepush */
		getRemoteUpdate =async(remotePackage:RemotePackage)=>{
			// let localPackage : LocalPackage = await remotePackage.download(this.onDownloadProgress).catch(this.onError);

			this.onChangeStatus(UpdateStatus.CodepushIsDownloading);
			let localPackage : LocalPackage=await remotePackage.download(this.onDownloadProgress).catch(this.onError);
			if(localPackage){
				this.onChangeStatus(UpdateStatus.CodepushInInstalling)
				this.installCodepush(localPackage);
				if(this.installCodepush){
					this.onChangeStatus(UpdateStatus.CodepushInstalled)
					this.onChangeStatus(UpdateStatus.CodepushRestart);
					this.restart();
				}
			}

			// return localPackage;
		}

		/**安装codepush */
		installCodepush =async (localPackage:LocalPackage):Promise<Boolean>=>{
			let installProgress  = await localPackage.install();
			return installProgress;
		}

		/**重启 */
		restart = ()=>{
			this.onChangeModal(false)
			CodePush.restartApp();
		}

		/**启动更新 */
		setup = async () =>{
			CodePush.notifyAppReady();
			const {appleid} = this.props;
			if(!appleid || appleid==''){
				console.warn(`appleid属性不能为空`);
				return ;
			}
			this.onChangeStatus(UpdateStatus.CheckingAppStore);
			let appstoreUpdate : UpdateProp = await this.checkAppStore();
			let localVersion:String = DeviceInfo.getVersion();
			// localVersion = '3.0.0';
			if(appstoreUpdate && Version.hasNew(localVersion,appstoreUpdate.version)){
				this.setState({data : appstoreUpdate})
				this.onChangeStatus(UpdateStatus.AppStoreHasUpdate);
				
			}else{
				this.onChangeStatus(UpdateStatus.AppStoreNoUpdate);
				this.onChangeStatus(UpdateStatus.CheckingCodepush);
				//没有appstore版本
				let remotePackage : RemotePackage =await this.checkCodepush();
				if(remotePackage && remotePackage.downloadUrl!=''){
					const codePushInfo : AppInfo = {
						fileSizeBytes : remotePackage.packageSize,
						releaseNotes:remotePackage.description,
						version : `${remotePackage.appVersion}.${remotePackage.label.replace('v','')}`
					}
					this.setState({remtePackage:remotePackage,data:new UpdateProp(codePushInfo)},()=>{
						this.onChangeStatus(UpdateStatus.CodepushHasUpdate);
					});
					
				}else{
					this.onChangeStatus(UpdateStatus.CodepushNoUpdate);
				}

			}
		}



		/**新旧版本号比较 
		 * @param {本地版本} localVersion
		 * @param {远程版本} remoteVersion
		 * @returns {true:远程有新版本 false：没有新版本}
		*/
		static hasNew(localVersion:String,remoteVersion:String):Boolean{
			try {
				let local : Number = localVersion.split('.').map(item=>parseInt(item));
				let remote: Number = remoteVersion.split('.').map(item=>parseInt(item));
				if(local && remote && remote.length==3 && local.length==3){
					let local_major : Number = local[0];
					let local_minor : Number = local[1];
					let local_patch : Number = local[2];

					let remote_major: Number = remote[0];
					let remote_minor: Number = remote[1];
					let remote_patch: Number = remote[2];

					if(remote_major>local_major){return true}
					if(remote_major==local_major && remote_minor>local_minor){return true}
					if(remote_major==local_major && remote_minor==local_minor && remote_patch>local_patch){return true}
					return false;
				}else{
					return true
				}
			} catch (error) {
				return true;
			}
		}

		/**点击去更新
		 * 1.去appstore更新
		 * 2.直接开始下载热更新
		 */
		onClickUpdate = ()=>{
			let currentStatus : UpdateStatus = this.state.status;
			if(currentStatus == UpdateStatus.AppStoreHasUpdate){
				Linking.openURL(`itms-apps://itunes.apple.com/app/${this.props.appleid}`)
			}else if(currentStatus == UpdateStatus.CodepushHasUpdate){
				this.getRemoteUpdate(this.state.remtePackage);
			}else{
				alert('nono')
			}
		}

		bodyRender = (state:State,props:Props)=>{
			switch(state.status){
				case UpdateStatus.CodepushHasUpdate:
				case UpdateStatus.AppStoreHasUpdate:return <FindNewUpdate data={state.data} themeColor={props.themeColor} onClick={this.onClickUpdate} />
				case UpdateStatus.CodepushIsDownloading:return <DownloadView progress={state.downloadProgress} prgressColor="blue"/>
				default:return this.renderNormal(this.state);
			}

		}
		
		/**检查更新 */
		renderChecking = (state:State)=>{
			return this.renderNormal(state);
		}
		/**正在下载 */
		/**正在安装 */
		renderInstalling = (state:State)=>{
			return this.renderNormal(state)
		}

		/**渲染一般视图：标题+子标题 */
		renderNormal = (state:State)=>{
			return (
				<View>
					<Text>{state.data.title}</Text>
				</View>
			)
		}

		onMaskClick = ()=>{
			alert('alert');
		}

		render(){
				const {style,wrapper} = this.props;
				const {show} = this.state;
				return (
					<Modal
						visible={show}
						transparent={true}
						onRequestClose={this.onChangeModal}
						animated={true}
						animationType="fade"
						presentationStyle="overFullScreen"
						>
						<TouchableOpacity
							activeOpacity={1}
							style={[styles.container,defaultModelStyle]}
							onPress={this.onMaskClick}>
						<View 
								onStartShouldSetResponder={()=>true}
								// onMoveShouldSetResponder={()=>false}
								// onMoveShouldSetResponderCapture={()=>false}
								style={[defaultContainerStyle]}
								>
								<View style={defaultHeaderContainer}>
									{wrapper(this.state)}
								</View>
								<View 
									style={styles.content}>
									{this.bodyRender(this.state,this.props)}
								</View>
						</View>
						</TouchableOpacity>
					</Modal>
				)
		}
}

const styles = StyleSheet.create({
		container:{
			flex:1,
			alignItems:'center',
			justifyContent:'center',
			backgroundColor: 'rgba(0,0,0,0.5)',
		},
		content:{
			flex:1,
		}
})