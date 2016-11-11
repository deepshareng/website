---
title: Web API(网页端)
tab: web-webapi
category: devdoc
---
# Web API(网页端)

Web API是网页端通过调用DeepShare的Web接口，返回一个绑定DeepShare参数的DeepShare链接。    

当DeepShare链接被用户点击后，如果App已经被安装在手机上，App会被自动唤起；如果App未安装，DeepShare会引导用户进入商店或者直接下载安装。    

无论哪种场景，当App启动时，调用DeepShare的SDK相应接口即可获取启动参数等相关信息。

## DeepShare链接 {#link}

DeepShare链接可以看成一个绑定APP初始化参数、渠道信息、发送方ID信息等Web信息的Deferred Deeplink链接。   

其结构为：https://fds.so/d/#APP_ID/#Hash   
例如：https://fds.so/d/38CCA4C77072DDC9/2LwCsozd9S   

DeepShare链接具有如下特点：

  -  短连接，易于分享
  -  自适应浏览器（微信，微博，各种第三方安卓浏览器均已适配）
  -  支持iOS Universal Link
  -  转化率自动跟踪

通过DeepShare链接实现场景还原的典型流程如下图所示，其中黄色部分的流程需要调用DeepShare的接口来完成。
<div align="center"><img src="/img/doc-genurl-p1.png" style="width:70%;"/></div>

## API接口说明 {#api}

- URL：https://fds.so/v2/url/用户申请的AppID
- 请求方式：POST
- 支持格式：JSON
- 请求参数：<a class="page-link" href="#deepshare-params-example" >DeepShare参数</a>

{% highlight javascript %}
var paramsJson = JSON.stringify(params)
$.post('https://fds.so/v2/url/#appID', paramsJson, function(result) {
      //deepshareUrl为所生成的DeepShare Link
      deepshareUrl = result.url;
 }).error(function() {
      //出错情况下可以继续用户正常逻辑，可设置一个默认url.
});
{% endhighlight %}

为了使跳转时有更好的体验，**强烈建议**采用以下调用方式:

{% highlight javascript %}
var paramsJson = JSON.stringify(params)
$.ajax({
    url: 'https://fds.so/v2/url/#appID',
    type: 'POST',
    data: paramsJson,
    xhrFields: {withCredentials: true,},
    success: function(result) {
        //deepshareUrl为所生成的DeepShare Link
        deepshareUrl = result.url;
    },
    error: function() {
      //出错情况下可以继续用户正常逻辑，可设置一个默认url.
    },
});
{% endhighlight %}


## EXAMPLE {#example}

以下通过一个真实的项目"Linux CMD"演示如何产生DeepShare Link:

<body>
  <div class="container" >
    <section>
      <div class="row col-lg-6 col-lg-offset-1">
      	<h4>URL</h4>
        <pre class="requesturl">Perform a action!</pre>
        <br>
        <h4>Request</h4>
        <pre class="request">Perform a action!</pre>
        <br>
        <h4>Response</h4>
        <pre class="response">Perform a action!</pre>
      </div>
    </section>
    <section>
      <div class="row col-lg-6 col-lg-offset-1">
        <h3>Action</h3>
        <div class="group">
          <button id="geturl" class="btn btn-info">GetURL</button>
        </div>
      </div>
    </section>
  </div>
  

  <script type="text/javascript">
    var requestView = $('.request');
    var responseView = $('.response');
    var requestUrlView = $('.requesturl');
    var requestUrl = 'https://fds.so/v2/url/38CCA4C77072DDC9';
    var deepshareUrl = null;
    var data = {
    	name:"mkdir",
    }

    var webParams = {
        inapp_data : data,
        sender_id :"senderID",
        download_title : "DownLoad Title",
    	  download_msg : "Download Msg",
    }

	  function generateUrl(){
		    responseView.html("Waiting for response");
        paramsJson = JSON.stringify(webParams);
		    requestUrlView.html(requestUrl);
        requestView.html(paramsJson);
        $.post(requestUrl, paramsJson, function(result) {
            responseView.html(JSON.stringify(result));
            deepshareUrl = result.url;
        }).error(function() {
          //Do your own bussiness logic in case that our servive is not reachable.
          deepshareUrl = "http://deepshare.io"
        });
	  }
    window.onload = function () {
    	generateUrl();
    }

    $('#geturl').click(function() {
        generateUrl();
    });

    //Add this button action in your real html which is accessed by mobile
    $('#openurl').click(function() {
        if(deepshareUrl != null){
            location.href = deepshareUrl;
        }else{
            //Do your own bussiness logic in case that our servive is not reachable.
        }
    });

</script>
</body>

## 最佳实践 {#bestPractice}

我们推荐的方法是在页面加载时调用接口生成本页面所需要的所有URL，用户点击时进行跳转： 
（使用此方式在iOS9并且开启Universal Link的情况下，从微信、QQ等打开DeepShare URL时可以进行直接跳转，不需要用户手动选择在Safari打开）
{% highlight javascript %}
var deepshareUrl = null;
window.onload = function () {
    $.post('https://fds.so/v2/url/#appID', paramsJson, function(result) {
        deepshareUrl = result.url
    }).error(function() {
    });
};
{% endhighlight %}

跳转的时候直接将location.href设为DeepShare URL：
{% highlight javascript %}
$('#openDeepShareUrl').click(function() {
    if(deepshareUrl != null){
        location.href = deepshareUrl;
    }else{
        //出错情况下可以继续用户正常逻辑.例如可以设置直接前往APP商店
    }
});
{% endhighlight %}

***
<hr>
请参考以下三节内容以进行下一步集成。

-  <a class="page-link" href="#android-sdk" >Android SDK集成</a>：(推荐)Android native SDK的集成方法
-  <a class="page-link" href="#ios-sdk" >iOS SDK集成</a>：(推荐)iOS native SDK的集成方法   
-  <a class="page-link" href="#web-sdk" >Web SDK集成</a>：App中直接调用Web接口的集成方法(不喜欢集成SDK的用户请走这里)

