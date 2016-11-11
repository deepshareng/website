---
title: IOS SDK
tab: ios-sdk
category: devdoc
---
# iOS SDK

## Universal Link {#setupUL}
Universal Link是Apple为iOS 9提供的一个新特性，通过Universal Link，App可以无需打开Safari，直接通过iOS系统启动。
在iOS9.2以后的版本中，如果继续通过Safari能否打开App Scheme来判断App是否安装，用户体验变得很差: 

- 如果App未安装，会出现错误对话框:
<div align="center"><img src="/img/doc-ios-sdk-ul-p1.png" style="width:40%;"/></div>

- 如果App已安装，会出现一个确认打开的对话框。但是在iOS9.2以后，这个对话框由以前的模态对话框变成了非模态对话框，如果通过打开Scheme超时来判断是否安装，超时后会继续执行超时回调代码。
这样的话，即使在已经安装的情况下，还是会进入商店的下载页面。

因此，我们强烈推荐配置Universal Link，而通过DeepShare来配置Universal Link也变得非常简便。   
[去配置Universal Link](https://dashboard.deepshare.io/#/app/ios)

## 基本功能 {#basic}

### 获取场景还原参数

DeepShare的核心功能是可以在应用启动时接收到分享者的预设参数，并根据这些参数进行场景的恢复。
{% highlight objc %}
/** 初始化API，同时设置相应的委托对象
 * @param appId APP注册时生成的APP ID.
 * @param options launchOptions AppDelegate的didFinishLaunchingWithOptions方法所传回的参数
 * @param delegate 委托方法onInappDataReturned所在的类的对象
 * @return void
 */
+ (void)initWithAppID:(NSString *)appId withLaunchOptions:(NSDictionary *)options withDelegate:(id)delegate;

/** 委托方法onInappDataReturned
 * @param params 所获取到的启动参数
 * @param error 错误信息
 */
- (void)onInappDataReturned: (NSDictionary *) params withError: (NSError *) error {
}
{% endhighlight %}

在AppDelegate的didFinishLaunchingWithOptions方法中添加[DeepShare initWithAppID...]的调用，并通过Delegate接受返回的启动参数。
LaunchOptions是用来判断App是否是通过URL Scheme进行唤起的。
示例代码如下：   
（其中所返回参数"name"为<a class="page-link" href="#deepshare-params-recovery" >DeepShare参数</a>中所举实例中的参数）

{% highlight objc %}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
    [DeepShare initWithAppID:@"此处填写您申请的App ID" withLaunchOptions:launchOptions withDelegate:self];
    return YES;
}

- (void)onInappDataReturned: (NSDictionary *) params withError: (NSError *) error {
    if (!error) {
        NSLog(@"finished init with params = %@", [params description]);
        NSString *cmdName = [params objectForKey:@"name"];
        goToLinuxCmd(cmdName); //调用应用自己的接口跳转到分享时页面
    } else {
        NSLog(@"init error id: %ld %@",error.code, errorString);
    }
}
{% endhighlight %}

## 用户归因API {#userattribution}

### 返回分享者的ID {#senderID}

通过此接口，可以获得唯一标识用户在本App中的分享ID，可用于追踪用户分享源头。   
通常用法是将此分享者ID传入网页端API组装<a class="page-link" href="#deepshare-params-attribute" >DeepShare参数</a>的JS代码中，作为sender_id的参数值生成DeepShare链接。
{% highlight objc %}
/**
 * 获取分享者的ID
 */
+ (NSString *)getSenderID;
{% endhighlight %}

### 获取分享带来的新使用
通过获取本用户分享带来的新用户的安装量及老用户的打开次数，开发者可以给此用户返利，以激励用户更多的分享，进而带来链式传播的效果。
{% highlight objc %}
/**
 * 异步返回通过我的分享带来的此应用的新使用，新用户的安装量及老用户的打开次数
 *
 */
+ (void)getNewUsageFromMe:(callbackWithNewUsageFromMe)callback;
{% endhighlight %}
此功能依赖于上一个接口getSenderId，开发者需要将分享者ID传入网页端API组装<a class="page-link" href="#deepshare-params-attribute" >DeepShare参数</a>的JS代码中，否则此API的回调将会返回0值。   
此方法调用将异步执行，异步执行结果通过block函数callbackWithNewUsageFromMe返回。   
此接口定义为：
{% highlight objc %}
/* 返回我的分享带来的新的使用
 * @param newInstall 新用户的下载安装量
 * @param newOpen 老用户的打开次数
 * @param error 错误信息
 */
typedef void (^callbackWithNewUsageFromMe) (int newInstall, int newOpen, NSError *error);
{% endhighlight %} 

### 清空分享带来的新使用
清空本用户分享带来的新用户的安装量及老用户的打开次数，一般在返利结束后调用此方法，用于清零。
{% highlight objc %}
/**
 * 清空通过我的分享带来的此应用的新使用，包括新安装的用户量和老用户的打开次数
 * @param callback 如果出错，错误信息会通过此block函数返回
 */
+ (void)clearNewUsageFromMe:(callbackWithError)callback;
{% endhighlight %}


## 价值标签API

### 改变价值标签的值

{% highlight objc %}
/**
 * 改变指定价值标签的值
 * @param tagToValue 所指定价值标签和其增加或减少的价值量所组成的NSDictionary.
 */
+ (void) attribute:(NSDictionary *)tagToValue completion:(callbackWithError)callback;
{% endhighlight %}

- 可以通过此接口，统计新用户及新使用带来的价值。一种场景是电商类应用可以通过此接口统计本用户分享所带来的价值，进而实现返利、赠送优惠券等营销活动
- 此接口中tagToValue为标签和其对应的值，其中值是改变量
- 此接口所改变的标签对应的值是属于深度链接分享者的，返利统计也会计算在分享者的名下

示例代码：
{% highlight objc %}
NSString *tag = @"paidMoney";
NSNumber *value = @888;
NSDictionary *taggedvalue = [[NSDictionary alloc] initWithObjects:@[value] forKeys:@[tag]];
//在标签"paidMoney"下增加了888的值,如果paidMoney之前值为1000,调⽤用接⼝口后的值为1888
[DeepShare attribute:taggedvalue completion:^(NSError *error) { }];
{% endhighlight %}

## FAQ

####  Universal Link没有正常工作?    
可能有多种原因，请依次排查。   

   1. 请确认DashBoard中正确填写了Team Id。   
   2. 因为Universal Link是App安装时激活的，如果是从XCode直接Debug版更新安装的，Universal Link可能不会被激活。请完全删除App后重新安装App。   
   3. 请确保entitlements file关联了正确的target。因为一些原因，某些版本的Xcode 7并不会把entitlements file添加到build中，所以我们需要在project browser中手动将新生成的entitlements file添加到正确的target中，这样这个文件才会build。 

####  导入lib后为何XCode显示很多warning?    
这是XCode之前的一个bug，如果新工程是通过XCode7之前版本创建的，就会出现这个问题，如果新工程是通过XCode7之后版本创建的，就没有这个问题。    
在Debug版本中其实并不需要dSYM文件，解决的方法就是在Build Setting中将Debug setting从"DWARF with dSYM File" 改成"DWARF", Debug setting保持不变。
<div align="center"><img src="/img/doc-ios-sdk-faq-p1.png" style="width:70%;"/></div>
