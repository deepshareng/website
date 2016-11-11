---
title: Web API集成(App端)
tab: web-sdk
category: devdoc
---
# Web API 集成

DeepShare Web API 提供了一组Web API，可以帮助用户直接通过http访问和在Device端使用DeepShare的相应功能。    

**注意：请尽量使用Android SDK或者IOS SDK集成，Web API集成复杂度远远大于SDK集成。**

## 添加到工程 {#addToProject}
请根据您所要调用的Web API的平台做相应修改，以便通过DeepShare链接直接启动App。

### Android

修改Manifest.xml，增加DeepShare的intent-filter，这样您的App就可以通过浏览器被唤起。

示例代码如下：
{% highlight xml %}
<manifest……>
    <uses-permission android:name="android.permission.INTERNET" />
    <application……>
        <activity……>
            <intent-filter>
                <data
                    android:host="此处填写DashBoard中生成的host"
                    android:scheme="此处填写DashBoard中生成的scheme" />
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
            </intent-filter>
        </activity>
    </application>
</manifest>
{% endhighlight %}

### iOS
打开\*-Info.plist（\*代表你的工程名字），添加用于回调的URL Scheme，App在Dashboard注册后会自动生成此值。

  1. 添加一个叫URL types的键值；
  2. 点击左边剪头打开列表，可以看到Item 0，一个字典实体；
  3. 点击Item 0新增一行，从下拉列表中选择URL Schemes，敲击键盘回车键完成插入；
  4. 更改所插入URL Scheme的值为DashBoard中生成的Scheme。

完成后如图所示：
![](/img/doc-ios-sdk-p1.png)

## 基本功能 {#basic}

### 获取场景还原参数

#### 接口协议: 

- **URL**：https://fds.so/v2/inappdata/用户申请的AppID

- **请求方式**: POST

- **支持格式**: Json

- **请求参数说明**：

<body>
    <table class="api_table" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr class="title">
                <th width="20"></th>
                <th width="100">名称</th>
                <th width="80">类型</th>
                <th width="60">必填</th>
                <th>说明</th>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">is_newuser</td>
                <td class="url">bool</td>
                <td class="url">是</td>
                <td>是否是新安装APP的用户</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">unique_id</td>
                <td class="url">string</td>
                <td class="url">是</td>
                <td>用户的唯一识别ID</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">sdk_info</td>
                <td class="url">string</td>
                <td class="url">是</td>
                <td>调用方式，其值固定为:"webapi"</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">os</td>
                <td class="url">string</td>
                <td class="url">是</td>
                <td>平台标识，其值为"iOS"或者"Android"</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">os_version</td>
                <td class="url">string</td>
                <td class="url">是</td>
                <td>平台版本标识，例如:"9.1"(ios)或者"4.4.4"(android)</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">model</td>
                <td class="url">string</td>
                <td class="url">否</td>
                <td>安卓设备品牌，例如:"MI 4LTE"；IOS不需要此值(android)</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">click_id</td>
                <td class="url">string</td>
                <td class="url">否</td>
                <td>老用户打开时，从Scheme URI中解析得出</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">short_seg</td>
                <td class="url">string</td>
                <td class="url">否</td>
                <td>老用户打开时, Device是IOS9并且启用Universal Link时，从Universal link中解析得出</td>
            </tr>
        </tbody>
    </table>
    <br/>
</body>

- **返回参数说明**：
<body>
    <table class="api_table" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr class="title">
                <th width="20"></th>
                <th width="100">名称</th>
                <th width="80">类型</th>
                <th>说明</th>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">inapp_data</td>
                <td class="url">string</td>
                <td>所绑定在用户之前点击的DeepShare链接中的场景还原数据</td>
            </tr>
        </tbody>
    </table>
    <br/>
</body>

- **请求Json实例**：
   1. {\"is_newuser\" : true, \"unique_id\" : \"320C9F2E-4876-4FD4-A6F5-B3DA804F32C7\", \"os\" : \"iOS\", \"os_version\" : \"8.1\"}   
   2. {\"is_newuser\" : false, \"unique_id\" : \"ce354d4e11c45855\", \"os\" : \"Android\", \"os_version\" : \"4.4.4\", \"click_id\" : \"l8sT0zzTq\"}
   3. {\"is_newuser\" : false, \"unique_id\" : \"320C9F2E-4876-4FD4-A6F5-B3DA804F32C7\", \"os\" : \"iOS\", \"os_version\" : \"9.1\", \"short_seg\" : \"1zXcI3SOvS\"}

- **返回Json实例**：
  1. {\"inapp_data\":\"{\\\"key1\\\":\\\"value1\\\"}\"}
  2. {\"inapp_data\":\"{\\\"article_id\\\":10010,\\\"has_star\\\":true,\\\"author\\\":\\\"Hai\\\"}\"}

___

#### 相关参数详解及参考实现: 
  - **unique_id**: iOS可以用IDFA；Android可以用ANDROID_ID；或者使用用户登录名。当生成DeepShare链接时，此ID需要传入作为sender_id或forwarded_sender_id的参数值。   
  - **click_id** (Android)：Android App通过Scheme URI启动时，启动URI格式为\<scheme\>://\<host\>?click_id=\<click_id\>，解析出\<click_id\>的值。
     {% highlight java %}
  /*Android端获取click_id的参考实现*/
    @Override
    public void onStart() {
        Uri data = activity.getIntent().getData();
        if (data != null && data.isHierarchical()) {
            String click_id = data.getQueryParameter("click_id");
            //click_id为对应所需上传参数
        }
    }
 {% endhighlight %}
  - **click_id** (IOS)：Android App通过Scheme URI启动时，启动URI格式为\<scheme\>://?click_id=\<click_id\>，解析出\<click_id\>的值。
 {% highlight objc %}
 /*IOS端获取click_id的参考实现*/
 + (BOOL)handleURL:(NSURL *)url {
    BOOL handled = NO;
    if (url) {
        NSString *query = [url fragment];
        if (!query) {
            query = [url query];
        }
        handled = YES;
        NSDictionary *params = [DSEncodingUtils decodeQueryStringToDictionary:query];
        if ([params objectForKey:@"click_id"]) {
            NSString *click_id = [params objectForKey:@"click_id"];
            //click_id为对应所需上传参数
        }
    }
    return handled;
}
 {% endhighlight %}

  - **short_seg**：当iOS9以上版本OS，并启用Universal Link时，iOS App通过Universal Link启动时，启动URI为用户所点击的DeepShare链接，格式为https://fds.so/d/\<AppID\>/\<short_seg\>，例如: https://fds.so/d/38CCA4C77072DDC9/1zXcI3SOvS，"1zXcI3SOvS"为其short_seg。
 {% highlight objc %}
 /*IOS 9 Only*/
 + (BOOL)continueUserActivity:(NSUserActivity *)userActivity {
    if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
        NSString *urlStr = [userActivity.webpageURL absoluteString];
        if(![urlStr containsString:@"fds.so"]){
            return false;
        }
        NSRange range = [urlStr rangeOfString:@"/" options:NSBackwardsSearch];
        if(range.location != NSNotFound) {
            NSString *short_seg = [urlStr substringFromIndex:(range.location + 1)];
            return true;
        } else {
            // wrong url format
            return false;
        }
    }
    return true;
}
 {% endhighlight %}

## 高级功能 {#advanced}

###获取用户分享带来的新的安装量及打开次数

#### 接口协议: 

- **URL**：https://fds.so/v2/dsusages/用户申请的AppID/分享者senderID

- **请求方式**: GET

- **返回参数说明**：
<body>
    <table class="api_table" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr class="title">
                <th width="20"></th>
                <th width="100">名称</th>
                <th width="80">类型</th>
                <th>说明</th>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">new_install</td>
                <td class="url">int</td>
                <td>由此分享者所带来的新的APP安装数量</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td class="url">new_open</td>
                <td class="url">int</td>
                <td>由此分享者所带来的已安装的APP打开的次数</td>
            </tr>
        </tbody>
    </table>
    <br/>
</body>


- **返回Json实例**：
  1. {\"new_install\":\"1\",\"new_open\":\"2\"}

#### 相关参数详解
  - **分享者senderID**: 唯一标识本用户在本App中的分享ID

___

###清空用户分享带来的新的安装量及打开次数

#### 接口协议: 

- **URL**：https://fds.so/v2/dsusages/用户申请的AppID/分享者senderID

- **请求方式**: DELETE

#### 相关参数详解
  - **分享者senderID**: 唯一标识本用户在本App中的分享ID


