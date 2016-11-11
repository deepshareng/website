---
title: Attribution Push 集成
tab: attr-push
category: devdoc
---
# Attribution Push 集成

深享系统可以提供App安装后用户事件和流量源头的关联分析。这些事件包括DeepShare内置事件的安装和打开，也包括用户自定义的事件，比如购买、分享。

DeepShare归因分析可以针对渠道或者发送者，其中渠道的归因分析可以通过Web来浏览。而对于基于发生者的归因分析，由于数据量巨大，DeepShare提供自动Push功能，及时的将归因分析的结果Push到开发者提供的后台。

该后台只需要提供一个HTTP/RESTful API，能够接受如下POST：

## 数据格式

{% highlight json %}
[
    {
        "senderID": "Who is sending the url",
        "tag": "type of action(ds/open, ds/install, or other user defined action)",
        "value": "the amount associated with tag",
    },
    ...
]
{% endhighlight %}

## Field说明
senderID：DeepShare URL 的生成者ID，此ID就是SDK中的API getSenderId() 的返回值，开发者可以绑定此ID和自己的用户系统。

tag & value:

- ds/install，表示通过此senderID带来的新安装数量，value为其数量

- ds/open，表示通过此senderID带来的新打开数量，value为其数量

- 自定义tag，当分享接收方在SDK中调用attribute(tagToValue, DSFailListener)方法时，其value关联到此tag，归因在其发送方并返回
