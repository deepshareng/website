//=============================================================================
// DeepShare Version 1.0
//=============================================================================

//-----------------------------------------------------------------------------
// Only for local debug,
// Clean the code in dsLogDebug before online!!
//-----------------------------------------------------------------------------
//var ws = new WebSocket("ws://" + window.location.hostname + ":3333/");
var ws = new WebSocket("ws://192.168.1.102:3333");
DeepShare.dsLogDebug = function(msg) {
    // FIXME: clean before online
   if (DeepShare.DEBUG) {
        // Print log on server by websocket
        var d = new Date();
        if (ws.readyState === ws.OPEN) {
            ws.send('[DEBUG] - [' + d.toLocaleTimeString() + '] - ' + msg);
        } else {
            //alert('ws broken!!!');
        }

        // Or use alert
        //alert(msg);
   } 
};

DeepShare.DEBUG = true;

DeepShare.BIND_STATUS = {
    INITIAL: 0,
    BINDED: 1,
    DISMISSED: 2,
};

function DeepShare(params) {

    var self = this;

    this._deeplinkLocation = '';
    this._dstLocation = '';
    this._bindedDeepLink = DeepShare.BIND_STATUS.INITIAL;

    this._AppData = {
        inapp_data:      '',
        sender_id:       '',
        app_id:          '',
        download_title:  '',
        download_msg:    '',
        download_btn_text:'',
        download_url_ios: '',
        download_url_android:'',
        channels:       [], 
    };
    this._ResponseData = null;
    this._Params = null;
    this._DSCallbacks = {
        weixinIOSTipCallback: function() {
            DeepShare.dsLogDebug('weixin ios tip');                     
        },
        weixinAndroidTipCallback: function() {
            DeepShare.dsLogDebug('weixin android tip');                     
        },
        weiboIOSTipCallback: function() {
            DeepShare.dsLogDebug('weibo ios tip');                     
        },
        weiboAndroidTipCallback: function() {
            DeepShare.dsLogDebug('weibo android tip');                     
        },
        qqIOSTipCallback: function() {
            DeepShare.dsLogDebug('qq ios tip');                     
        },
        qqAndroidTipCallback: function() {
            DeepShare.dsLogDebug('qq android tip');                     
        },
        cannotDeeplinkCallback: function() {
            DeepShare.dsLogDebug('cannot deeplink');                     
        },
        iosLandingCallback: function() {
            DeepShare.dsLogDebug('ios landing');                     
        },
        androidMarketLandingCallback: function() {
            DeepShare.dsLogDebug('android market');                     
        },
        androidDownloadLandingCallback: function() {
            DeepShare.dsLogDebug('android downloading...');                     
            self._gotoUrl(self._Params.url);
        },
        androidCannotGoMarketLandingCallback: function() {
            DeepShare.dsLogDebug('android cannot go market');                     
        },
        iosPlatformNotAvailCallback: function() {
            DeepShare.dsLogDebug('ios platform not available');                     
        },
        androidPlatformNotAvailCallback: function() {
            DeepShare.dsLogDebug('android platform not available');                     
        }
    };

    this._env = {
        windowLocation: function (loc) {
            window.location = loc;
        },
        windowOpen: function (loc) {
            window.open(loc);
        },
        windowClose: function () {
            window.close();
        },
        windowChangeHistory: function () {
            window.history.replaceState("Object", "Title", "0");
        },
        windowAddEventListener: function (type, listener) {
            window.addEventListener(type, listener);
        },
        windowUrlAddTag: function () {
            if (window.location.search.indexOf(DeepShare.kDSTag) < 0) {
                var tag = Math.floor((Math.random() * 1000000));
                var queryStr = "?" + DeepShare.kDSTag + "=" + tag;
                window.location.search = queryStr;
                DeepShare.dsLogDebug("Url Add Tag:" + queryStr);
            }
        },
        cookieEnabled: function () {
            var isPrivateMode = false;
            try { localStorage.test = 2; } catch (e) {
                DeepShare.dsLogDebug("private mode");
                isPrivateMode = true;
            }
            return navigator.cookieEnabled && !isPrivateMode;
        }
    };

    this._AppInsStatus = {
        NotInstall: 0,
        Installed: 1,
        Unclear: 2
    };

    this._DSAction = {
        trackingUrl: 'v2/dsactions/',
        actionJSDeepLink: 'js/deeplink',
        actionJSDst: 'js/dst',
        actionJSUserClick: 'js/userclick',

        destination: {
            dstweixintipandroid: 'dst-weixin-tip-android',
            dstweixintipios: 'dst-weixin-tip-ios',
            dstqqtipandroid: 'dst-qq-tip-android',
            dstqqtipios: 'dst-qq-tip-ios',
            dstweibotipandroid: 'dst-weibo-tip-android',
            dstweibotipios: 'dst-weibo-tip-ios',
            dstcannotdeeplink: 'dst-cannot-deeplink',
            dstucbrowser: 'dst-uc-browser',
            dstios9UniversalLinkLandPage: 'dst-ios9-universallink-landpage',
            dstandroidDirectDownloadLandPage: 'dst-android-direct-download-landpage',
            dstandroidMarketLandPage: 'dst-android-market-landpage',
            dstandroidCannotGoMarketLandPage: 'dst-android-cannot-gomarket-landpage',
            dstplatformNA: 'dst-{Platform}-not-available'
        }
    };

    this._initialize(params);
}

//-----------------------------------------------------------------------------
// Constants List
//-----------------------------------------------------------------------------
DeepShare.kPostVerb = 'POST';
DeepShare.kRequestProtocol = 'https://';
DeepShare.kServerName = 'fds.so/';
DeepShare.kVersionName = 'v2/';
DeepShare.kAPIJS = 'jsapi/';
DeepShare.kAPIUrl = 'url/';
DeepShare.kDSTag = 'ds_tag';

//-----------------------------------------------------------------------------
// Private Functions
//-----------------------------------------------------------------------------
DeepShare.prototype._initialize = function DeepShare_prototype__initialize(params) {
    // // Set Locale
    // var lang = navigator.language;
    // var isEng = /^en/.test(lang);
    // if (isEng) {
    //     document.write("<script src='../../jsserver/en/langconfig.js'><\/script>");
    // } else {
    //     document.write("<script src='../../jsserver/chs/langconfig.js'><\/script>");
    // }

    if (!IsNullOrUndefined(params.app_id)) {
        this._AppData.app_id = params.app_id;
    }
    if (!IsNullOrUndefined(params.inapp_data)) {
        this._AppData.inapp_data     = JSON.stringify(params.inapp_data);
    }
    if (!IsNullOrUndefined(params.sender_id)) {
        this._AppData.sender_id      = params.sender_id;
    }
    if (!IsNullOrUndefined(params.download_title)) {
        this._AppData.download_title = params.download_title;
    }
    if (!IsNullOrUndefined(params.download_msg)) {
        this._AppData.download_msg   = params.download_msg;
    }
    if (!IsNullOrUndefined(params.download_btn_text)) {
        this._AppData.download_btn_text  = params.download_btn_text;
    }
    if (!IsNullOrUndefined(params.download_url_ios)) {
        this._AppData.download_url_ios   = params.download_url_ios;
    }
    if (!IsNullOrUndefined(params.download_url_android)) {
        this._AppData.download_url_android   = params.download_url_android;
    }
    if (!IsNullOrUndefined(params.channels)) {
        this._AppData.channels     = JSON.stringify(params.channels);
    }

    if (!IsNullOrUndefined(params.callbacks)) {
        this._DSCallbacks = params.callbacks;
    }

    this._refreshBind(true);
};

DeepShare.prototype._refreshBind = function DeepShare_prototype__refreshParam(force) {
    DeepShare.dsLogDebug('Try refresh bind, force: ' + force + ', binded: ' + this._bindedDeepLink);

    var instance = this;
    // !force: [null|undefined|''|0] all can be true 
    if (!force && instance._bindedDeepLink === DeepShare.BIND_STATUS.BINDED) {
        return;
    }

    // FIXME: add for test
    // this._Params = Params

    var requestUrl = DeepShare.kRequestProtocol +
                     DeepShare.kServerName +
                     DeepShare.kVersionName +
                     DeepShare.kAPIJS +
                     instance._AppData.app_id;

    $.ajax({
        url: requestUrl,
        type: 'POST',
        data: JSON.stringify(instance._AppData),
        xhrFields: {withCredentials: true,},
        success: function(result) {
            instance._Params = result;
            instance._bindedDeepLink = DeepShare.BIND_STATUS.BINDED;
            DeepShare.dsLogDebug('Params from api:' + JSON.stringify(params) + JSON.stringify(result));
        },
        error: function() {
            DeepShare.dsLogDebug('Refresh Params Error');
        },
        dataType: 'json',
    });
};

DeepShare.prototype._reportDSJSEvent = function DeepShare_prototype__reportDSJSEvent(eventType, dst) {
    var params = {
        action: eventType,
        kvs: {
            "click_id": this._Params.match_id,
            "destination": dst,
            "ds_tag": this._Params.ds_tag
        }
    };
    var requestUrl = DeepShare.kRequestProtocol +
                     DeepShare.kServerName +
                     this._DSAction.trackingUrl +
                     this._Params.app_id;
    var paramsJson = JSON.stringify(params);
    $.post(requestUrl, paramsJson, function (result) {
    }).error(function () {
        //Do your own business logic in case that our server is down.
    });
};

DeepShare.prototype._reportDSJSUserClickEvent = function DeepShare_prototype__reportDSJSUserClickEvent(eventType, btn, choice) {
    var instance = this;

    var params = {
        action: eventType,
        kvs: {
            "click_id": this._Params.match_id,
            "user_btn": btn,
            "user_choice": choice,
            "ds_tag": this._Params.ds_tag
        }
    };
    var requestUrl = DeepShare.kRequestProtocol +
                     DeepShare.kServerName +
                     this._DSAction.trackingUrl +
                     this._Params.app_id;
    var paramsJson = JSON.stringify(params);
    $.post(requestUrl, paramsJson, function (result) {
    }).error(function () {
        //Do your own business logic in case that our server is down.
    });
};

DeepShare.prototype._clearTimeoutOnPageUnload = function DeepShare_prototype__clearTimeoutOnPageUnload(redirectTimer) {
    var instance = this;
    instance._env.windowAddEventListener("pagehide", function () {
        DeepShare.dsLogDebug('window event pagehide');
        
        clearTimeout(redirectTimer);

        instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;
    });
    instance._env.windowAddEventListener("blur", function () {
        DeepShare.dsLogDebug('window event blur');

        clearTimeout(redirectTimer);
        instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;
    });
    instance._env.windowAddEventListener("unload", function () {
        DeepShare.dsLogDebug('window event unload');

        clearTimeout(redirectTimer);
        instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;
    });
    document.addEventListener("webkitvisibilitychange", function () {
        DeepShare.dsLogDebug('window event webkitvisibilitychange');

        if (document.webkitHidden) {
            DeepShare.dsLogDebug('window is hidden');
            clearTimeout(redirectTimer);
            instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;
        } else {
            // Switch back window from app
            // No need, Only YYB need refresh, but yyb url is new page, when
            // backward!!
        }
    });
    instance._env.windowAddEventListener("beforeunload", function () {
        DeepShare.dsLogDebug('window event beforeunload');
        clearTimeout(redirectTimer);
    });
    instance._env.windowAddEventListener("focus", function () {
        DeepShare.dsLogDebug('window event focus');

        //focus event is dangerous, it shows at least Firefox and Xiaomi Browser will receive a focus event when it try to deeplink.
        //So do not use this event to clear timer.
        //if (isFirefox()) {
        //    return;
        //}
        //clearTimeout(redirectTimer);
        //env.windowChangeHistory();
    });
    instance._env.windowAddEventListener("focusout", function () {
        DeepShare.dsLogDebug('Window event focusout');

        clearTimeout(redirectTimer);
        instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;
    });
};


DeepShare.prototype._gotoTip = function DeepShare_prototype__gotoTip(type, dst) {
    var instance = this;
    DeepShare.dsLogDebug('Go to tip: ' + dst);

    if (type === "ios") {
        switch (dst) {
            case instance._DSAction.destination.dstweixintipios:
                if (!IsNullOrUndefined(instance._DSCallbacks.weixinIOSTipCallback)) {
                    instance._DSCallbacks.weixinIOSTipCallback();
                }
                break;
            case instance._DSAction.destination.dstweibotipios:
                if (!IsNullOrUndefined(instance._DSCallbacks.weiboIOSTipCallback)) {
                    instance._DSCallbacks.weiboIOSTipCallback();
                }
                break;
            case instance._DSAction.destination.dstqqtipios:
                if (!IsNullOrUndefined(instance._DSCallbacks.qqIOSTipCallback)) {
                    instance._DSCallbacks.qqIOSTipCallback();
                }
                break;
        }
    } else if (type === "android") {
        switch (dst) {
            case instance._DSAction.destination.dstweixintipandroid:
                if (!IsNullOrUndefined(instance._DSCallbacks.weixinAndroidTipCallback)) {
                    instance._DSCallbacks.weixinAndroidTipCallback();
                }
                break;
            case instance._DSAction.destination.dstweibotipandroid:
                if (!IsNullOrUndefined(instance._DSCallbacks.weiboAndroidTipCallback)) {
                    instance._DSCallbacks.weiboAndroidTipCallback();
                }
                break;
            case instance._DSAction.destination.dstqqtipandroid:
                if (!IsNullOrUndefined(instance._DSCallbacks.qqAndroidTipCallback)) {
                    instance._DSCallbacks.qqAndroidTipCallback();
                }
                break;
        }
    }
    //this._env.windowUrlAddTag();   ???
    this._dstLocation = dst;
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._gotoCannotDeeplink = function DeepShare_prototype__gotoCannotDeeplink() {
    var instance = this;
    DeepShare.dsLogDebug('cannot deeplink');

    if (!IsNullOrUndefined(this._DSCallbacks.cannotDeeplinkCallback)) {
        this._DSCallbacks.cannotDeeplinkCallback();
    }

    this._dstLocation = this._DSAction.destination.dstcannotdeeplink;
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._gotoAndroidNewInstall = function DeepShare_prototype__gotoAndroidNewInstall() {
    if (this._Params.is_download_directly) {
        this._gotoAndroidDownloadUrl();
    } else {
        if (this._Params.cannot_go_market) {
            this._gotoAndroidCannotGoMarketLandingPage();
        } else if (this._Params.cannot_get_win_event || this._Params.is_uc) {
            this._gotoAndroidMarketLandingPage();
        } else {
            this._gotoAndroidMarket();
        }
    }
};

DeepShare.prototype._gotoIOSLandingPage = function DeepShare_prototype__gotoIOSLandingPage() {
    this._dstLocation = this._DSAction.destination.dstios9UniversalLinkLandPage;
    DeepShare.dsLogDebug('Go to iOS landing page: ' + this._dstLocation);

    if (!IsNullOrUndefined(this._DSCallbacks.iosLandingCallback)) {
        this._DSCallbacks.iosLandingCallback();
    }
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._gotoAndroidMarketLandingPage = function DeepShare_prototype__gotoAndroidMarketLandingPage() {
    this._dstLocation = this._DSAction.destination.dstandroidMarketLandPage;
    DeepShare.dsLogDebug('Go to android market landing page: ' + this._dstLocation);

    if (!IsNullOrUndefined(this._DSCallbacks.androidMarketLandingCallback)) {
        this._DSCallbacks.androidMarketLandingCallback();
    }
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._gotoAndroidCannotGoMarketLandingPage = function DeepShare_prototype__gotoAndroidCannotGoMarketLandingPage() {
    this._dstLocation = this._DSAction.destination.dstandroidCannotGoMarketLandPage;
    DeepShare.dsLogDebug('Go to android can not go to market landing page: ' + this._dstLocation);

    if (!IsNullOrUndefined(this._DSCallbacks.androidCannotGoMarketLandingCallback)) {
        this._DSCallbacks.androidCannotGoMarketLandingCallback();
    }
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._gotoAndroidDownloadUrl = function DeepShare_prototype__gotoAndroidDownloadLandingPage() {
    this._dstLocation = this._DSAction.destination.dstandroidDirectDownloadLandPage;
    DeepShare.dsLogDebug('Go to android download landing page: ' + this._dstLocation);

    if (!IsNullOrUndefined(this._DSCallbacks.androidDownloadLandingCallback)) {
        this._DSCallbacks.androidDownloadLandingCallback();
    }
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._gotoAndroidMarket = function DeepShare_prototype__gotoAndroidMarket() {
    instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;

    this._dstLocation = 'market://details?id=' + this._Params.pkg;
    DeepShare.dsLogDebug('Go to android market: ' + this._dstLocation);

    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
    this._env.windowLocation(this._dstLocation);
};

DeepShare.prototype._gotoUrl = function DeepShare_prototype__gotoUrl(url) {
    DeepShare.dsLogDebug('Goto url: ' + url);

    // Page changed, no need to refresh

    this._dstLocation = url;
    this._reportDSJSEvent(this._DSAction.actionJSDst, url);
    this._env.windowLocation(url);
};

DeepShare.prototype._gotoPlatformNotAvail = function DeepShare_prototype__gotoDivPlatformNotAvail(platform) {
    if (platform === "ios") {
        if (!IsNullOrUndefined(this._DSCallbacks.iosPlatformNotAvailCallback)) {
            this._DSCallbacks.iosPlatformNotAvailCallback();
        }
    } else if (platform === "android") {
        if (!IsNullOrUndefined(this._DSCallbacks.androidPlatformNotAvailCallback)) {
            this._DSCallbacks.androidPlatformNotAvailCallback();
        }
    }
    this._dstLocation = this._DSAction.destination.dstplatformNA.replace(/{Platform}/g, platform);
    this._reportDSJSEvent(this._DSAction.actionJSDst, this._dstLocation);
};

DeepShare.prototype._deeplinkLaunch = function DeepShare_prototype__deeplinkLaunch(deeplink, timeoutTime, timeoutCallback) {
    this._deeplinkLocation = deeplink;
    DeepShare.dsLogDebug('deeplinklaunch: ' + this._deeplinkLocation);

    this._reportDSJSEvent(this._DSAction.actionJSDeepLink, deeplink);
    this._env.windowLocation(deeplink);
    var timeout = setTimeout(function () {
        timeoutCallback();
    }, timeoutTime);
    this._clearTimeoutOnPageUnload(timeout);
};

DeepShare.prototype._chiosDeeplinkLaunch = function DeepShare_prototype__chiosDeeplinkLaunch(deeplink, timeoutCallback) {
    this._deeplinkLocation = deeplink;
    var w = null;
    try {
        this._reportDSJSEvent(this._DSAction.actionJSDeepLink, deeplink);
        w = this._env.windowOpen(deeplink);
        DeepShare.dsLogDebug('pass');

        instance._bindedDeepLink = DeepShare.BIND_STATUS.DISMISSED;
    } catch (e) {
        DeepShare.dsLogDebug('exception');
    }
    if (w) {
        this._env.windowClose();
    } else {
        timeoutCallback();
    }
};

DeepShare.prototype._iframeDeeplinkLaunch = function DeepShare_prototype__iframeDeeplinkLaunch(deeplink, timeoutTime, timeoutCallback) {
    DeepShare.dsLogDebug('Go to iframeDeeplinkLaunch: ' + deeplink);

    var timeout = setTimeout(function () {
        timeoutCallback();
    }, timeoutTime);
    this._clearTimeoutOnPageUnload(timeout);
    var hiddenIFrame = document.createElement('iframe');
    hiddenIFrame.style.width = '1px';
    hiddenIFrame.style.height = '1px';
    hiddenIFrame.border = 'none';
    hiddenIFrame.style.display = 'none';
    hiddenIFrame.src = deeplink;
    document.body.appendChild(hiddenIFrame);
    this._deeplinkLocation = deeplink;
    this._reportDSJSEvent(this._DSAction.actionJSDeepLink, deeplink);
};

DeepShare.prototype._isIosNotAvailable = function DeepShare_prototype__isIosNotAvailable() {
    return this._Params.is_ios && (this._Params.bundle_id === undefined || this._Params.bundle_id === "");
};

DeepShare.prototype._isAndroidNotAvailable = function DeepShareprototype__isAndroidNotAvailable() {
    return this._Params.is_android && (this._Params.pkg === undefined || this._Params.pkg === "");
};

DeepShare.prototype._shouldGotoYYB = function DeepShare_prototype__shouldGotoYYB() {
    return this._Params.yyb_url !== undefined && this._Params.yyb_url !== "";
};

DeepShare.prototype._dealIOS = function DeepShare_prototype__dealIOS(tag, dst, url) {
    // Righ now, url are all `yyb_url`
    DeepShare.dsLogDebug('Deal with iOS: ' + tag + ' dst: ' + dst + ' url: ' + url);
    if (this._Params.ios_major <= 8) {
        if (!IsNullOrUndefined(url)) {
            this._gotoUrl(url);
        } else {
            this._gotoTip(tag, dst);
        }
    } else {
        if (this._Params.is_universal_link) {
            this._gotoUrl(this._Params.ds_url);
        } else {
            this._gotoTip(tag, dst);
        }
    }
};


//-----------------------------------------------------------------------------
// Public Functions
//-----------------------------------------------------------------------------
DeepShare.prototype.Start = function DeepShare_prototype_Start() {
    this._reportDSJSEvent('ds_jssdk_click', '');
    var instance = this;
    var deeplinkurl = '';
   
    /* 
     * Maybe use later 
    if (instance._bindedDeepLink === DeepShare.BIND_STATUS.INITIAL) {
        // Just ignore, have not bind yet,
        // BINDED or DISMISSED both will fall through
        //
        // currently the same effect of `_isIosNotAvailable` and `_isAndroidNotAvailable`
        return;
    }
    */

    if (instance._isIosNotAvailable()) {
        instance._gotoPlatformNotAvail('ios');
        return;
    } else if (instance._isAndroidNotAvailable()) {
        instance._gotoPlatformNotAvail('android');
        return;
    }
    if (instance._Params.is_wechat) {
        DeepShare.dsLogDebug('In WeChat');

        if (instance._shouldGotoYYB()) {
            DeepShare.dsLogDebug('YYBurl is: ' + instance._Params.yyb_url);

            if (instance._Params.is_ios) {
                instance._dealIOS('ios', instance._DSAction.destination.dstweixintipios, this._Params.yyb_url);
            } else {
                instance._gotoUrl(instance._Params.yyb_url);
            }
        } else {
            if (instance._Params.is_ios) {
                DeepShare.dsLogDebug("isIOS without YYBurl");

                instance._dealIOS('ios', instance._DSAction.destination.dstweixintipios);
            } else if (instance._Params.is_android) {
                DeepShare.dsLogDebug("isAndroid without YYBurl");

                instance._gotoTip('android', instance._DSAction.destination.dstweixintipandroid);
            }
        }

    } else if (instance._Params.is_qq) {
        DeepShare.dsLogDebug("In QQ");

        if (instance._shouldGotoYYB()) {
            DeepShare.dsLogDebug('YYBurl is: ' + instance._Params.yyb_url);

            if (instance._Params.is_ios) {
                instance._dealIOS('ios', instance._DSAction.destination.dstqqtipios, instance._Params.yyb_url);
            } else {
                instance._gotoUrl(instance._Params.yyb_url);
            }
        } else {
            if (instance._Params.is_ios) {
                DeepShare.dsLogDebug("isIOS");

                instance._dealIOS('ios', instance._DSAction.destination.dstqqtipios);
            } else if (instance._Params.is_android) {
                DeepShare.dsLogDebug("isAndroid");

                instance._gotoTip('android', instance._DSAction.destination.dstqqtipandroid);
            }
        }
    } else if (instance._Params.is_weibo) {
        DeepShare.dsLogDebug("In Weibo");

        if (instance._Params.is_ios) {
            DeepShare.dsLogDebug("isIOS");
            
            instance._dealIOS('ios', instance._DSAction.destination.dstweibotipios);
        } else if (instance._Params.is_android) {
            DeepShare.dsLogDebug("isAndroid");

            instance._gotoTip('android', instance._DSAction.destination.dstweibotipandroid);
        }
    } else if (instance._Params.is_ios) {
        // don't care for toutiao
        DeepShare.dsLogDebug("In iOS");

        deeplinkurl = instance._Params.scheme + '://';
        if (instance._Params.match_id && instance._Params.match_id.length > 0) {
            deeplinkurl += "?click_id=" + instance._Params.match_id;
        }
        DeepShare.dsLogDebug('Deeplink url: ' + deeplinkurl);

        if (instance._Params.ios_major < 9) {
            DeepShare.dsLogDebug("IOS Major below 9:" + instance._Params.ios_major);

            instance._iframeDeeplinkLaunch(deeplinkurl, 2000, function () {
                instance._gotoUrl(instance._Params.url);
            });
        } else {
            DeepShare.dsLogDebug("IOS Major upper 9:" + instance._Params.ios_major);

            if (instance._Params.chrome_major > 0) {
                DeepShare.dsLogDebug("isChrome");

                instance._chiosDeeplinkLaunch(deeplinkurl, function () {
                    instance._gotoUrl(instance._Params.url);
                });
            } else if (instance._Params.is_universal_link) {
                //If it is universal link, it mean it is in two situation
                //1.The App is not installed
                //2.The App is installed, but the system prefer the web page
                //So we need to show the landing page to cover both situation
                DeepShare.dsLogDebug("isUniversallink = true");


                instance._gotoUrl(instance._Params.ds_url);
                /*
                if (instance._env.cookieEnabled()){
                    DeepShare.dsLogDebug("cookie Enabled; AppInsStatus:" + instance._Params.app_ins_status);

                    // TODO: go to universal link page. 
                    switch (parseInt(instance._Params.app_ins_status, 10)){
                        case instance._AppInsStatus.Installed:
                            instance._gotoIOSLandingPage();
                            break;
                        case instance._AppInsStatus.NotInstall:
                            instance._gotoUrl(instance._Params.url);
                            break;
                        case instance._AppInsStatus.Unclear:
                            instance._gotoIOSLandingPage();
                            break;
                        default:
                            instance._gotoIOSLandingPage();
                            break;
                    }
                } else {
                    DeepShare.dsLogDebug("Cookie Not Enabled");

                    instance._gotoIOSLandingPage();
                }*/
            } else {
                DeepShare.dsLogDebug("is safari");

                instance._deeplinkLaunch(deeplinkurl, 500, function () {
                    instance._gotoUrl(instance._Params.url);
                });
            }
        }

    } else if (instance._Params.is_android) {
        DeepShare.dsLogDebug("In Android");

        deeplinkurl = instance._Params.scheme + '://' + instance._Params.host;
        if (instance._Params.match_id && instance._Params.match_id.length > 0) {
            deeplinkurl += "?click_id=" + instance._Params.match_id;
        }
        DeepShare.dsLogDebug('Deeplink url: ' + deeplinkurl);
            
        if (instance._Params.cannot_deeplink) {
            instance._iframeDeeplinkLaunch(deeplinkurl, 2000, function () {
                instance._gotoCannotDeeplink();
            });
        } else if (instance._Params.is_qq_browser) {
            DeepShare.dsLogDebug("In QQ browser");

            if (instance._shouldGotoYYB()) {
                DeepShare.dsLogDebug(instance._Params.yyb_url);

                instance._gotoUrl(instance._Params.yyb_url);
            } else {
                instance._gotoCannotDeeplink();
            }
        } else if (instance._Params.is_uc) {
            DeepShare.dsLogDebug("In UC browser");

            // confirm button, long time to wait ...
            // TODO: show loading...
            instance._iframeDeeplinkLaunch(deeplinkurl, 5000, function () {
                instance._gotoAndroidNewInstall();
            });
        } else if (instance._Params.chrome_major >= 25 && !instance._Params.force_use_scheme) {
            DeepShare.dsLogDebug("In chrome major >= 25, Chrome_major:" + instance._Params.chrome_major);

            //Extract scheme from deeplink
            var intent = instance._Params.host;
            if (instance._Params.match_id && instance._Params.match_id.length > 0) {
                intent += "?click_id=" + instance._Params.match_id;
            }
            var pkg = instance._Params.pkg;
            // When deeplinking on chrome 35+, there is inherent app store
            // fallback logic built into the browser (likely a bug in Chrome).
            // Workaround for Bug https://code.google.com/p/chromium/issues/detail?id=459711&thanks=459711&ts=1424288965.
            var workaroundlink = "intent://" + intent +
                                 "#Intent;scheme=" + toLowerCase(instance._Params.scheme) +
                                 ";package=" + pkg +
                                 ";S.browser_fallback_url=" + instance._Params.url +
                                 ";end";

            instance._deeplinkLaunch(workaroundlink, 2000, function () {
                instance._gotoAndroidNewInstall();
            });
            /*
            instance._deeplinkLaunch(deeplinkurl, 2000, function () {
                instance._gotoAndroidNewInstall();
            });
            */
        } else {
            DeepShare.dsLogDebug("In default browser");

            instance._iframeDeeplinkLaunch(deeplinkurl, 2000, function () {
                instance._gotoAndroidNewInstall();
            });
        }
    }
};

DeepShare.prototype.SetParam = function DeepShare_prototype_SetParam(params) {
    this._initialize(params);    
};

DeepShare.prototype.SetBindInfo = function DeepShare_prototype_SetBindInfo(params) {
    this._Params = params;
};

DeepShare.prototype.BindInAppInfo = function DeepShare_prototype_BindInAppInfo() {
    this._refreshBind();
};

DeepShare.prototype.SetCallbackWeixinIOSTip = function(callback) {
    this._DSCallbacks.weixinIOSTipCallback = callback; 
};
DeepShare.prototype.SetCallbackWeixinAndroidTip = function(callback) {
    this._DSCallbacks.weixinAndroidTipCallback = callback;
};
DeepShare.prototype.SetCallbackWeiboIOSTip = function(callback) {
    this._DSCallbacks.weiboIOSTipCallback = callback; 
};
DeepShare.prototype.SetCallbackWeiboAndroidTip = function(callback) {
    this._DSCallbacks.weiboAndroidTipCallback = callback;
};
DeepShare.prototype.SetCallbackQQIOSTip = function(callback) {
    this._DSCallbacks.qqIOSTipCallback = callback; 
};
DeepShare.prototype.SetCallbackQQAndroidTip = function(callback) {
    this._DSCallbacks.qqAndroidTipCallback = callback; 
};
DeepShare.prototype.SetCallbackQQAndroidTip = function(callback) {
    this._DSCallbacks.qqAndroidTipCallback = callback; 
};
DeepShare.prototype.SetCallbackIOSNotAvailable = function(callback) {
    this._DSCallbacks.iosPlatformNotAvailCallback = callback;
};
DeepShare.prototype.SetCallbackAndroidNotAvailable = function(callback) {
    this._DSCallbacks.androidPlatformNotAvailCallback = callback;
};
DeepShare.prototype.SetCallbackCannotDeeplink = function(callback) {
    this._DSCallbacks.cannotDeeplinkCallback = callback;
};

DeepShare.prototype.SetCallbackIOSLanding = function(callback) {
    this._DSCallbacks.iosLandingCallback = callback;
};
DeepShare.prototype.SetCallbackAndroidMarketLanding = function(callback) {
    this._DSCallbacks.androidMarketLandingCallback = callback;
};
DeepShare.prototype.SetCallbackAndroidDownloadLanding = function(callback) {
    this._DSCallbacks.androidDownloadLandingCallback = callback;
};
DeepShare.prototype.SetCallbackAndroidCannotGoMarketLanding = function(callback) {
    this._DSCallbacks.androidCannotGoMarketLandingCallback = callback;
};


//-----------------------------------------------------------------------------
// Utils
//-----------------------------------------------------------------------------
function IsNullOrEmpty(str) {
    if (str && str.length > 0) {
        return false;
    } else {
        return true;
    }
}

function IsNullOrUndefined(object) {
    return (typeof object === "undefined") || (object === null);
}

function toLowerCase(str) {
    if (typeof str === "string") {
        return str.toLowerCase();
    } else if ((typeof object === "undefined") || (object === null)) {
        return '';
    } else {
        str = '' + str;
        return str.toLowerCase();
    } 
}

