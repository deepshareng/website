

# DeepShare JS-SDK(deprecated)

## $ 概述

DeepShare
JS-SDK是使网页开发者在网页中使用DeepShare的深度分享功能，在网页中实现跨平台跳转，降低用户导入门槛

## $ 使用步骤

### 一 申请和配置app

请查看:
[deepshare开发者文档](http://deepshare.io/doc/)


### 二 引入JS文件

在需要调用的页面引入js文件，js地址[http://cdn.deepshare.io/xxxx](http://XXXXX)

### 三 调用代码 

- 组装参数

- 初始化DeepShare

- 合适的时候调用Start(), 触发跳转



## $ 接口说明

### 初始化参数

```
params = {
    inAppData: 见集成文档[](http://deepshare.io/doc/)
    appID: DeepShare为开发者分配，见集成文档[](http://deepshare.io/doc/)
    senderID: Optional, TODO: 
}
```

### 初始化

```
deepshare = new DeepShare(params); // params 为上文组装的初始化参数
```

### 基础接口

触发跳转
```
// 开始跳转，调用后将立即跳转到目标（下载页面或APP内部）
deepshare.Start();  
```


### 回调

在某些少数情况下，不能跳转到目标地址，这些情况包括：
- weibo的内置浏览器中
- 微信浏览中，没有应用宝地址且不支持universal link时
- QQ浏览器中，没有应用宝宝地址且不支持univeral link时
- 用户的设备没有对用的版本, 例如APP只开发了Android版本，但用户的设备是iOS
- 一些特殊的浏览器的限制，不能进行跳转 

在这些情况下，deepshare jssdk
提供回调接口，方便开发者定制，为用户提供更好的体验。


```
deepshare.SetCallbackWeixinIOSTip(callback)             // 设置后，在iOS的微信中不能跳转是将调用此callback
deepshare.SetCallbackWeixinAndroidTip(callback)         // 设置后，在Android的微信中不能跳转时将调用此callback
deepshare.SetCallbackWeiboIOSTip(callback)              // 设置后，在iOS的微博中不能跳转时将调用此callback
deepshare.SetCallbackWeiboAndroidTip(callback)          // 设置后，在Android的微博中不能跳转时将调用此callback
deepshare.SetCallbackQQIOSTip(callback)                 // 设置后，在iOS的QQ中不能跳转时将调用此callback
deepshare.SetCallbackQQAndroidTip(callback)             // 设置后，在Android的QQ中不能跳转时将调用此callback
deepshare.SetCallbackIOSNotAvailable(callback)          // 设置后，iOS版本不可用时将调用此callback
deepshare.SetCallbackAndroidNotAvailable(callback)      // 设置后，Android版本不可用时将调用此callback
deepshare.SetCallbackCannotDeeplink(callback)           // 设置后，其他不能跳转情况时将调用此callback
```


## $ 一个完整的例子

```
<!-- In you html page -->
<script src="<addr-of-deepshare-js-sdk>"></script>
<script>
// 组装参数
var params = {
    inAppData: {
        contentId: '123456',
    },
    appID: 'xxxxxxxx',
}

// 初始化DeepShare
var deepshare = new DeepShare(params);

document.getElementById('#GoToAppButton').addEventListener('click', function() {
    // 触发跳转
    deepshare.Start();
})
</script>

```

