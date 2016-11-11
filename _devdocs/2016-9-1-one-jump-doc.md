---
title: 一下跳转
tab: one-jump
category: devdoc
---
# 简介

一下跳转服务是DeepShare的一项轻量级服务，它通过三行JS代码，简化了开发者从Web页面到App页面跳转的所有问题，自动支持适配Universal link, App Link等系统级跳转功能，并通过跳转数据，帮助开发者优化跳转流程。


<div style="text-align:center; width:100%; ">  
    <img id="appIcon" src="/img/doc-one-jump-p1.png" style="width:40%;"/>
</div>

## 注册账号 {#register}
后台地址为：[http://dashboard.deepshare.io](http://dashboard.deepshare.io)   

提交注册申请后，请前往注册邮箱，在邮件中点击激活链接，即可进入管理平台

首次登入开发者后台后，可以添加新App, 请按照提示一步一步填写相应信息，完成添加。

添加完成后可以在应用信息中查看并修改之前所添加的所有信息。
其中所生成的AppID作为您的应用在DeepShare的唯一标识，在后继集成环节需要被使用到。
<div style="text-align:center; width:100%; ">  
    <img id="appIcon" src="/img/doc-one-jump-p2.png" style="width:70%;"/>
</div>

## Web端集成 {#web}

### 引入DeepShare JS库

在需要调用的页面引入[JS库文件]({{ site.url.js-sdk-link }}) ，其文件地址为：
{% highlight html %}
{{ site.url.js-sdk-link }}
{% endhighlight %}

### 初始化

初始化DeepShare对象

{% highlight javascript %}
// 初始化DeepShare, appid为之前后台添加App后所生成的，可以在后台的“应用信息”里查看
var deepshare = new DeepShare('appid');
deepshare.BindParams({});
{% endhighlight %}

### 跳转

将按钮点击事件的回调函数设置为DeepShare的跳转方法start()

{% highlight javascript %}
deepshare.Start();
{% endhighlight %}


完整示例代码如下：
{% highlight javascript %}
<script type="text/javascript">
// 初始化DeepShare
var deepshare = new DeepShare('38CCA4C77072DDC9');
deepshare.BindParams({});

document.getElementById('#GoToAppButton').addEventListener('click', function() {
    // 触发跳转
    deepshare.Start();
})
</script>
{% endhighlight %}

## iOS端集成 {#ios}

### 配置Universal Link 
Universal Link是Apple为iOS 9提供的一个新特性，通过Universal Link，App可以无需打开Safari，直接通过iOS系统启动。

**配置developers.apple.com的相关信息**：

- 登陆[developers.apple.com](http://developers.apple.com)，点击按钮「Certificate, Identifiers & Profiles」，然后再点击「Identifiers」
<div align="center"><img src="/img/doc-ios-sdk-ul-p2.png" style="width:70%;"/></div>
- 确保开启「Associated Domains」，这个按钮在页面下方，如图所示：
<div align="center"><img src="/img/doc-ios-sdk-ul-p3.png" style="width:70%;"/></div>

**配置XCode:**

- 在Xcode配置中开启「Associated Domains」
  1. 选择相应的target；
  2. 点击「Capabilities tab」；
  3. 开启Associated Domains；
  4. 点击「+」按钮，添加一个Associated Domain，其内容为applinks:fds.so。

完成后如图所示：
<div align="center"><img src="/img/doc-ios-sdk-ul-p4.png" style="width:80%;"/></div>

### 配置普通浏览器跳转
配置完成后用户可以在Safari中调起App。

- 修改\*-Info.plist（\*代表你的工程名字）。   
  添加用于回调的URL Scheme，App在Dashboard注册后会自动生成此值
  1. 添加一个叫URL types的键值；
  2. 点击左边剪头打开列表，可以看到Item 0，一个字典实体；
  3. 点击Item 0新增一行，从下拉列表中选择URL Schemes，敲击键盘回车键完成插入；
  4. 更改所插入URL Schemes的值为DashBoard中生成的Scheme。

完成后如图所示：
![](/img/doc-ios-sdk-p1.png)

DashBoard中的iOS Scheme信息：DashBoard>应用信息>iOS应用信息
<div align="center"><img src="/img/doc-ios-sdk-p2.png" style="width:70%;"/></div>

## Android端集成 {#android}

修改Manifest.xml，在启动Activity中增加DeepShare的intent-filter，这样您的App就可以通过浏览器被唤起

示例代码如下：
{% highlight xml %}
<manifest……>
    <uses-permission android:name="android.permission.INTERNET" />
    <application……>
        <activity……>
            <intent-filter>
                <data
                    android:host="此处填写DashBoard中显示的host"
                    android:scheme="此处填写DashBoard中显示的scheme" />
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
            </intent-filter>
        </activity>
    </application>
</manifest>
{% endhighlight %}

DashBoard中的Android Scheme信息：DashBoard>应用信息>Android应用信息   
（请先填写Package Name, Host通常会和Package Name保持一致）
<div align="center"><img src="/img/doc-android-sdk-p2.png" style="width:70%;"/></div>

## FAQ

### iOS Universal Link没有正常工作?    
可能有多种原因，请依次排查。   

   1. 请确认DashBoard中正确填写了Team Id。   
   2. 因为Universal Link是App安装时激活的，如果是从XCode直接Debug版更新安装的，Universal Link可能不会被激活。请完全删除App后重新安装App。   
   3. 请确保entitlements file关联了正确的target。因为一些原因，某些版本的Xcode 7并不会把entitlements file添加到build中，所以我们需要在project browser中手动将新生成的entitlements file添加到正确的target中，这样这个文件才会build。 

