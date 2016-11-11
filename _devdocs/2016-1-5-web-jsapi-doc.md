---
title: JS API(网页端)
tab: web-jsapi
category: devdoc
---
# JS API(网页端)

JS API是网页端通过调用DeepShare的JS接口，来实现DeepShare相关功能的方式。   
此功能目前处于Beta阶段。

使用JS API可以高度定制化DeepShare相关流程，例如定制化所有Landing Page等。

在需要调用的页面引入[JS库文件]({{ site.url.js-sdk-link }}) ，其文件地址为：
{% highlight html %}
{{ site.url.js-sdk-link }}
{% endhighlight %}


## API接口说明 {#api}

### 初始化

其中params为开发者自己组装的<a class="page-link" href="#deepshare-params-recovery" >DeepShare参数</a>。

{% highlight javascript %}
deepshare = new DeepShare(appid);
deepshare.BindParams(params);
{% endhighlight %}

### 基础接口

触发跳转
{% highlight javascript %}
deepshare.Start();  // 开始跳转，调用后将立即跳转到目标（下载页面或APP内部）
{% endhighlight %}


### 回调接口

提示：***DeepShare有成熟的默认处理方式，只有当需要高度定制跳转过程的时候才需要自己实现回调接口。***

在某些少数情况下，不能跳转到目标地址，需要特殊处理。   
这些情况包括：

- 微信浏览中，没有应用宝地址且不支持universal link时
- QQ浏览器中，没有应用宝地址且不支持univeral link时
- weibo的内置浏览器中
- 用户的设备没有对用的版本, 例如APP只开发了Android版本，但用户的设备是iOS
- 一些特殊的浏览器的限制，不能进行跳转 

在这些情况下，deepshare JS sdk
提供回调接口，方便开发者定制，为用户提供更好的体验。


{% highlight javascript %}
deepshare.SetCallbackWeixinIOSTip(callback)        // 在iOS的微信浏览器时将调用此callback
deepshare.SetCallbackWeixinAndroidTip(callback)    // 在Android的微信浏览器时将调用此callback
deepshare.SetCallbackWeiboIOSTip(callback)         // 在iOS的微博浏览器时将调用此callback
deepshare.SetCallbackWeiboAndroidTip(callback)     // 在Android的微博浏览器时将调用此callback
deepshare.SetCallbackQQIOSTip(callback)            // 在iOS的QQ浏览器时将调用此callback
deepshare.SetCallbackQQAndroidTip(callback)        // 在Android的QQ浏览器时将调用此callback
deepshare.SetCallbackIOSNotAvailable(callback)     // iOS版本不存在时将调用此callback
deepshare.SetCallbackAndroidNotAvailable(callback) // Android版本不存在时将调用此callback
deepshare.SetCallbackCannotDeeplink(callback)      // 浏览器不能支持DeepLink跳转时将调用此callback
deepshare.SetCallbackAndroidDownloadLanding(callback) // 跳转下载地址时的LandingPage
deepshare.SetCallbackAndroidMarketLanding(callback) // 在Android跳转时的LandingPage
deepshare.SetCallbackAndroidCannotGoMarketLanding(callback) // 不能跳转Android市场的LandingPage
{% endhighlight %}

### 同时生成多个跳转
有时在一个web分享页面上需要有多个跳转App的入口，需要绑定不同的初始化参数，渠道参数等<a class="page-link" href="#deepshare-params-recovery" >DeepShare参数</a>。   
针对这种情况，JS API提供了方便的批量处理接口。通过数组的方式，传入多个跳转配置:

{% highlight javascript %}
var params = new Array(
  {
    inapp_data: {
        name: 'mkdir',
    },
  },
  {
    inapp_data: {
        name: 'grep',
    },
  }
);
{% endhighlight %}

跳转时需要指定数组对应下标作为Start()方法的参数:
{% highlight javascript %}
deepshare.Start(0);  // 0代表params array里第0个deepshare参数
{% endhighlight %}

## EXAMPLE {#example}

以下通过一个真实的项目"Linux CMD"演示如何产生DeepShare Link:

### 单个跳转入口

{% highlight javascript %}
<script type="text/javascript">
//组装参数
var params = {
    inapp_data: {
        name: 'mkdir',
    },
}

// 初始化DeepShare
var deepshare = new DeepShare('38CCA4C77072DDC9');
deepshare.BindParams(params);

document.getElementById('#GoToAppButton').addEventListener('click', function() {
    // 触发跳转
    deepshare.Start();
})
</script>
{% endhighlight %}

如果您正在使用手机浏览此页面，可以点击这个按钮体验。
<body>
  <div class="container" >
    <section>
      <div class="row col-lg-6 col-lg-offset-0">
        <div class="group">
          <button id="gotoApp" class="btn btn-info">跳转App</button>
        </div>
      </div>
    </section>
  </div>
  
  <script src="{{ site.url.js-sdk-link }}"></script>
  <script type="text/javascript">
    var jsParams = {
        inapp_data : {
            name: 'mkdir',
        },
    }

    var deepshare = new DeepShare('38CCA4C77072DDC9');
    deepshare.BindParams(jsParams);
    $('#gotoApp').click(function() {
        deepshare.Start();
    });

</script>
</body>

<br>

### 多个跳转入口

{% highlight javascript %}
<script type="text/javascript">
//组装参数
var params = new Array(
  {
    inapp_data: {
        name: 'mkdir',
    },
  },
  {
    inapp_data: {
        name: 'grep',
    },
  }
);

// 初始化DeepShare
var deepshare = new DeepShare('38CCA4C77072DDC9');
deepshare.BindParams(params);

document.getElementById('#GoToMkdir').addEventListener('click', function() {
    // 触发跳转
    deepshare.Start(0);
});
document.getElementById('#GoToGrep').addEventListener('click', function() {
    // 触发跳转
    deepshare.Start(1);
});
</script>
{% endhighlight %}

如果您正在使用手机浏览此页面，可以点击这个按钮体验。
<body>
  <div class="container" >
    <section>
      <div class="row col-lg-6 col-lg-offset-0">
        <div class="group">
          <button id="gotoAppMkDir" class="btn btn-info">跳转MkDir</button>
          <button id="gotoAppGrep" class="btn btn-info">跳转Grep</button>
        </div>
      </div>
    </section>
  </div>
  
  <script src="{{ site.url.js-sdk-link }}"></script>
  <script type="text/javascript">
    var jsParams = new Array(
  {
    inapp_data: {
        name: 'mkdir',
    },
  },
  {
    inapp_data: {
        name: 'grep',
    },
  }
);

    var deepshare = new DeepShare('38CCA4C77072DDC9');
    deepshare.BindParams(jsParams);
    $('#gotoAppMkDir').click(function() {
        deepshare.Start(0);
    });
    $('#gotoAppGrep').click(function() {
        deepshare.Start(1);
    });

</script>
</body>

<br>


***

请参考以下三节内容以进行下一步集成。

-  <a class="page-link" href="#android-sdk" >Android SDK集成</a>：(推荐)Android native SDK的集成方法
-  <a class="page-link" href="#ios-sdk" >iOS SDK集成</a>：(推荐)iOS native SDK的集成方法   
-  <a class="page-link" href="#web-sdk" >Web SDK集成</a>：App中直接调用Web接口的集成方法(不喜欢集成SDK的用户请走这里)

