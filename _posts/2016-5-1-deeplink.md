---
layout: blog
title: Deeplink 与增长黑客：低成本实现用户增长的方法论
author: 小昭
tags: [deeplink, 移动运营]
description: DeepLink（深度链接）是一项减少运营难度的技术，在国外很常见，在国内却少有人讨论，而更强大的Deferred DeepLink（延迟深度链接）更是难寻踪迹。 今天小编就跟大家科普一下Deeplink与Deferred DeepLink这两项技术以及它们如何与增长黑客的思维相结合，使产品更快地增长。
cover: /img/cover-2016-5-1-deeplink.jpg
---

## **导言**

DeepLink（深度链接）是一项减少运营难度的技术，在国外很常见，在国内却少有人讨论，而更强大的Deferred
DeepLink（延迟深度链接）更是难寻踪迹。
今天小编就跟大家科普一下Deeplink与Deferred
DeepLink这两项技术以及它们如何与增长黑客的思维相结合，使产品更快地增长。

##**Deeplink 与Deferred Deeplink 是什么？**
在网站上，Deeplink是指向特定页面的链接（http://deepshare.io/doc/ ），相对应地，link是指向首页的链接（http://deepshare.io/ ）。在APP结构中Deeplink指的是能够调起APP内某个特定界面的链接，比如知乎的一个问题，淘宝的某个商品或者是大众点评上的一家店。
Deeplink 的好处在于可以通过它到达已安装APP内对应界面。比如使用了Deeplink的广告就可以让用户在点击广告的时候直接进入APP对应界面，而不是进入APP的首页或者下载界面。再比如知乎上的一个答案，只要点击答案链接，就可以直接进入手机知乎内对应的答案界面。

##**什么是Deferred Deeplink（延迟深度链接）？**
Deferred
Deeplink是Deeplink的进阶版本，增加了判断APP是否安装、用户匹配这两个新功能。Deferred
Deeplink能够在用户点击链接的时候判断APP是否安装。当用户没有安装APP时，Deferred
Deeplink引导用户到应用商店下载应用，用户下载完成后打开应用会直接看到APP中对应界面。用户匹配功能是在用户点击链接进入APP的时候将Device
Fingerprint （设备指纹信息）在服务器端进行模糊匹配。

##**增长黑客与Deferred DeepLink**
增长黑客是最近国内最火的运营概念，核心观点是以技术与数据为导向，以低成本实现产品的爆发式增长。
注重数据的增长黑客提出：要使产品全面而真实的增长，往往需要满足五个“增长要素指标”。

<div style="text-align:center;width:100%;margin:5rem 0;">  
    <img src="http://7xp89t.com1.z0.glb.clouddn.com/deepshare-blog-deeplink-2.jpg" style="max-width:100%;"/>
</div>

##**获取用户**
万事开头难，很多的APP往往死在这个阶段。这个阶段的难在于如何发现用户获取成本低且用户质量较高的渠道。而APP
STORE截断了用户的来源信息，让开发者没有办法直接获取到用户的来源，从而无法将资源投入最关键的部位，资源被白白浪费。而Deferred
Deeplink可以绕过APP STORE 的截断。Deferred
Deeplink可以当用户点击用链接的时候收集用户Device Fingerprint
（设备指纹信息）传到服务器上，引导用户去APP
STORE进行下载，当用户再打开应用的时候，这些信息跟云端信息进行匹配，从而记录用户的来源，再结合用户留存率、活跃程度和转化率，分辨出最具有价值用户是来自于些些渠道。完成在获取用户阶段的效益最大化，使每一个用户的获取成本都降到最低。

##**提高用户活跃度与留存率**
很多APP会使用弹出通知栏这样的方式来将APP内容推送给用户，让他们进入APP内观看、收听或购买，从而提高用户的活跃度和留存。试想这样一个场景，所有你在互联网上发布的链接都成为一个“内容通知栏”，只需要点击该链接就能够进入APP内对应的页面，无论是广告，还是分享链接，这些都变成APP的入口。Deferred
Deeplink能为此够提供完美的支持，当用户点击任何由Deferred
Deeplink生成的链接，无论是广告、友情链接、还是微信中的分享，都可以直达APP中对应内容。让你的APP在互联网上存在无限个入口，APP棒不怕互联网深。而Deferred
Deeplink提供的APP间无缝跳转将APP的用户体验提高到新的层次，让留存与活跃不再低迷。活跃度与留存率上去了，营收还远么？（笑脸）

##**自传播**##
自传播的基础是用户有利可得。比如转发、积攒得红包，比如邀请用户得优惠券。这些方式的原理都是让用户在传播的过程中获得利益。一般而言，这样的方式用户会经历这样的流程：小黄邀请小红下载应用，小红下载完填写邀请码，小黄获得奖励，然后小红拿到自己的邀请码，然后再去给小篮......其中经历了：1.
打开APP STORE 2. 搜索APP，下载 3. 打开APP，查找邀请码输入框 4.
输入邀请码。这样的自传播能快吗？能不能一步到位？Deferred
Deeplink说，可以的！用Deferred
Deeplink，小黄发出邀请链接（二维码），小红一扫，自动跳到APP
STORE下载，打开APP看到邀请内容，服务器记录这个分享的过程，将奖励发放给小黄。再也不用邀请码了好吗！要四步都太弱了！用Deferred
Deeplink发送红包一步搞定，还怕自传播不够快？

##**更强大的DeepShare**
Deferred Deeplink 的确可以提高运营的效率，但是Deferred
Deeplink的研发并不是一件容易的事。这么说吧，我们团队成员来自谷歌、微软、UCLA、清华、北大等著名企业与高校。从第一版本的demo，到现在的第二代产品；从iOS全机型适配到安卓95%以上的机型的适配；从后端的数据监测到前端的自定义跳转背景等等一系列的新功能，我们花了半年的时间。我们能说我们是现在国内最专业且免费的Deferred
Deeplink技术提供方。我们的产品叫DeepShare（深度分享）一款基于 Deferred Deeplink
技术、面向开发者的全平台产品。现阶段完全免费。
