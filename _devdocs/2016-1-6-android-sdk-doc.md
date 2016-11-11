---
title: ANDROID SDK
tab: android-sdk
category: devdoc
---
# Android SDK

## 相关系统代码 {#setup}
当Activity为singleTop或singleTask的启动模式时，需要在系统回调方法onNewIntent()中将intent设置为新收到的intent，DeepShare需要根据启动intent判断程序是否是通过DeepShare链接被激活的。   
当Activity的启动模式不是singleTop或singleTask时，此方法也没有任何副作用，如果开发者不确定启动模式的话，建议添加。

示例代码如下：

{% highlight java %}
@Override
public void onNewIntent(Intent intent) {
    this.setIntent(intent);
}
{% endhighlight %}


在Activity的onStop方法中，调用DeepShare.onStop()方法。

示例代码如下：

{% highlight java %}
@Override
public void onStop() {
    super.onStop();
    DeepShare.onStop();//停止DeepShare
}
{% endhighlight %}

## 基本功能 {#basic}

### 获取场景还原参数API
DeepShare的核心功能是可以在应用启动时接收到分享者的预设参数，并根据这些参数进行场景的恢复。
{% highlight java %}
/**
 * 初始化API，同时设置相应的监听器
 * @param activity 当前activity
 * @param appId APP注册时生成的APP ID.
 * @param inappDataListener 用来接收inappData回调的instance.
 */
public static void init(Activity activity, String appId, DSInappDataListener inappDataListener)
{% endhighlight %}

为实现场景还原功能，启动Activity需要实现DSInappDataListener接口。DSInappDataListener接口定义了场景调用成功时的回调函数onInappDataReturned。   
在应用的启动Activity中，在onStart()方法里添加DeepShare.init方法，并通过重写异步回调方法onInappDataReturned()获取分享参数`params`。   

示例代码例如下：   
（其中所返回参数"name"为<a class="page-link" href="#deepshare-params-recovery" >DeepShare参数</a>中所举实例中的参数）

{% highlight java %}
public class MainActivity extends Activity implements DSInappDataListener {
    public void onStart() {
        super.onStart();
        DeepShare.init(this, "此处填写您申请的App ID", this);
    }
    
    @Override
    /** 代理方法onInappDataReturned处理获取的启动参数
    * @param params 所获取到的启动参数
    */
    public void onInappDataReturned(JSONObject params) {
        try {
                if (params == null) return;
                String cmdName = params.getString("name");
                goToLinuxCmd(cmdName); //调用应用自己的接口跳转到分享时页面
            } catch (JSONException e) {
                e.printStackTrace();
            }
    }

    @Override
    public void onFailed(String s) {

    }
}
{% endhighlight %}

## 用户归因API {#userattribution}

### 返回分享者ID
通过此接口，可以获得唯一标识本用户在本App中的分享ID，可用于追踪用户分享源头。   
通常用法是将此分享者ID传入网页端API组装<a class="page-link" href="#deepshare-params-attribute" >DeepShare参数</a>的JS代码中，作为sender_id的参数值生成DeepShare链接。
{% highlight java %}
/**
 * 返回我的senderId
 */
public static String getSenderId()

{% endhighlight %}

### 获取分享带来的新使用
通过获取本用户分享带来的新用户的安装量及老用户的打开次数，开发者可以给此用户返利，以激励用户更多的分享，进而带来链式传播的效果
{% highlight java %}
/**
 * 异步返回通过我的分享带来的此应用的新使用，新用户的安装量及老用户的打开次数
 *
 */
public static void getNewUsageFromMe(NewUsageFromMeListener callback){
}
{% endhighlight %}
此功能依赖于上一个接口getSenderId()，开发者需要将分享者ID传入网页端API组装<a class="page-link" href="#deepshare-params-attribute" >DeepShare参数</a>的JS代码中，否则此API的回调将会返回0值。   
此方法调用将异步执行，异步执行结果通过回调接口onNewUsageFromMe()返回。   
此接口定义为：
{% highlight java %}
public interface NewUsageFromMeListener extends DSFailListener {
    /* 返回我的分享带来的新的使用
     * @param newInstall 新用户的下载安装量
     * @param newOpen 老用户的打开次数
     */
    public void onNewUsageFromMe(int newInstall, int newOpen);
}
{% endhighlight %}

### 清空分享带来的新使用
清空本用户分享带来的新用户的安装量及老用户的打开次数，一般在返利结束后调用此方法，用于清零。
{% highlight java %}
/**
 * 清空通过我的分享带来的此应用的新使用，包括新安装的用户量和老用户的打开次数
 *
 */
public static void clearNewUsageFromMe(DSFailListener callback){
}
{% endhighlight %}

## 价值标签API

### 改变价值标签的值
{% highlight java %}
/**
 * 改变指定价值标签的值，用户可以自定义事件的标签，如购买事件记录
 * @param tagToValue 所指定价值标签和其增加或减少的价值量所组成的HashMap.
 *
 */
public static void attribute(HashMap<String, Integer> tagToValue, DSFailListener callback)
{% endhighlight %}
- 可以通过此接口，统计新用户及新使用带来的价值。一种场景是电商类应用可以通过此接口统计本用户分享所带来的价值，进而实现返利、赠送优惠券等营销活动
- 此接口中tagToValue为标签和其对应的值，其中值是改变量
- 此接口所改变的标签对应的值是属于深度链接分享者的，返利统计也会计算在分享者的名下

示例代码如下：
{% highlight java %}
HashMap<String, Integer> map = new HashMap<String, Integer>();
map.put("paidMoney", 888);
//在标签"paidMoney"下增加了888的值，如果paidMoney之前值为1000，调用接口后的值为1888
DeepShare.attribute(map, new DSFailListener(){
    @Override
    public void onFailed(String reason) {
    }
});
{% endhighlight %}

## FAQ

#### 当App在手机后台时，从微信中通过应用宝跳转至App后为何无法跳转至内容页面?    
应用宝跳转时启动的不是App的LAUNCHER Activity, 而是App的当前Activity。所以如果DeepShare.init()方法在LAUNCHER Activity的onStart里调用而且当前Activity不是LAUNCHER Activity的话，App被调起时就无法跳转。    
解决方法是使用Application的<a class="page-link" href="http://developer.android.com/reference/android/app/Application.html#registerActivityLifecycleCallbacks(android.app.Application.ActivityLifecycleCallbacks" >ActivityLifecycleCallbacks(需要翻墙)</a>来监听整个Application的生命周期事件。


