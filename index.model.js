export class UpdateStatus {

	//没有检查
	static NoCheck = "NoCheck";

	//正在检查更新：appstore
	static CheckingAppStore = 'CheckingAppStore';

	//存在appstore更新
	static AppStoreHasUpdate = 'AppStoreHasUpdate';

	//appstore没有更新
	static AppStoreNoUpdate = 'AppStoreNoUpdate';

	//检查appstore异常
	static AppStoreException = 'AppStoreException';

	//正在检查更新：codepush
	static CheckingCodepush = 'CheckingCodepush';

	//codepush存在更新
	static CodepushHasUpdate = 'CodepushHasUpdate';

	//codepush不存在更新
	static CodepushNoUpdate = 'CodepushNoUpdate';

	//codepush正在下载安装包
	static CodepushIsDownloading = 'CodepushIsDownloading';

	//codepush正在安装
	static CodepushInInstalling = 'CodepushInInstalling';

	//codepush安装完毕
	static CodepushInstalled = 'CodepushInstalled';

	//codepush正在重启
	static CodepushRestart = 'CodepushRestart';

}


//更新对象
export class UpdateProp {
	version : String;
	title 				: String;
	newFeature    : String[];
	size  				: Number;//单位：MB


	constructor(data:AppInfo){
		this.version = data.version;
		this.title='发现新版本';
		this.newFeature=data.releaseNotes?data.releaseNotes.split('\n'):[];
		this.size = data.fileSizeBytes / (1024*1024);
	}

}


export type AppInfo = {
	fileSizeBytes : Number,
	releaseNotes : String,//\n分割线
	currentVersionReleaseDate:String,//发布日期
	version :String,
}

export type AppStoreResponse = {
	resultCount : Number,//只有resultCount==1，才往下判断
	results:AppInfo[],
}