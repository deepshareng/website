---
title: DeepShare参数
tab: deepshare-params
category: devdoc
---
# DeepShare参数

DeepShare参数是DeepShare服务的核心元素，DeepShare参数通过DeepShare服务可以从Web端传递到App内部。   

DeepShare的所有功能都是基于DeepShare参数实现的，例如场景还原，渠道检测，归因分析等。

以下分别介绍DeepShare参数的每一个域及其对应的功能，其中每一个域都是可选的。

## 场景还原 {#recovery}

**inapp_data**：通过将应用内的场景还原参数（例如文章地址、商品ID等）设置到inapp_data域，当App启动时通过调用DeepShare的init方法，就可以得到此场景还原参数。  
开发者可以选择通过集成Native SDK或者调用Web API(App端)来获取场景还原参数。当场景还原参数返回后，开发者可以根据参数信息进行场景的还原。    
实例如下：
{% highlight javascript %}
var data = {
    name : "mkdir",
}
var params = {
    inapp_data : data,
}
{% endhighlight %}
其中data中参数格式可以为任意Json数据格式，例如：

-  字符串：name : "mkdir",
-  整  数：value : 1,
-  布尔值：is_ok : true,
-  ...


打开App时即可收到DeepShare启动参数。   

-  <a class="page-link" href="#ios-sdk-basic" >iOS启动时接受inapp_data实例代码</a>   
-  <a class="page-link" href="#android-sdk-basic" >Android启动时接受inapp_data实例代码</a>

如果inapp_data域为空，App被调起时就不会接收到场景还原参数。

## 渠道监测 {#channel}

**channels**：通过设置channels域，自动将安装前后的渠道绑定起来，之后可以通过Dashboard查看渠道的表现。   
实例如下：
{% highlight javascript %}
var params = {
    channels : ["chanName_chanType_chanNumber"],
}
{% endhighlight %}

## 归因分析 {#attribute}

**sender_id**：通过native SDK获取，用于标识此分享的发起者。 此参数用于统计以及归因分析。

  -  <a class="page-link" href="#ios-sdk-basic" >iOS</a>: `+ (NSString *)getSenderID;`   
  -  <a class="page-link" href="#android-sdk-basic" >Android</a>: `public static String getSenderId();`

## 自定义下载过程 {#download}

download_title：可以附加显示在跳转商店页面的信息，可以给用户更好的引导。

download_msg：可以附加显示在跳转商店页面的信息，可以给用户更好的引导。

（此页面只会在iOS9 Universal Link的Web中转页面和Android直接下载APK的中转页面出现）
<div align="center"><img src="/img/doc-deepshare-params-p1.png" style="width:60%;"/></div>


## DeepShare参数实例 {#example}

一个完整的DeepShare参数：
{% highlight javascript %}
var data = {
    name : "mkdir",
}
var params = {
    inapp_data : data,
    channels:["chanName1_chanType1_chanNumber1"],
    sender_id : "senderID",
    download_title : "我是download_title",
    download_msg : "我是download_msg",
}
{% endhighlight %}

请参考以下两节内容以进行下一步集成。

-  <a class="page-link" href="#web-webapi" >Web API(网页端)</a>：(推荐方式)通过调用Web接口获取DeepShare Link, 通过DeepShare Link进行跳转。
-  <a class="page-link" href="#web-jsapi" >JS API(网页端)</a>：通过调用DeepShare的JS接口，来实现DeepShare相关功能的方式。(Beta)


