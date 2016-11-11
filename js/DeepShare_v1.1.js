//=============================================================================
// DeepShare Version 1.1
// Another style of code of v1.0, `the logic`!!
//=============================================================================

//-----------------------------------------------------------------------------
// Only for local debug,
// Clean the code in dsLogDebug before online!!
//-----------------------------------------------------------------------------
//var ws = new WebSocket("ws://" + window.location.hostname + ":3333/");
//var ws = new WebSocket("ws://192.168.1.102:3333/");
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

DeepShare.DEBUG = false;



function DeepShare(params) {
    //-----------------------------------------------------------------------------
    // Constants List
    //-----------------------------------------------------------------------------
    var BIND_STATUS = {
        INITIAL: 0,
        BINDED: 1,
        DISMISSED: 2,
    };
    var DS_kPostVerb = 'POST';
    var DS_kRequestProtocol = 'https://';
    var DS_kServerName = 'fds.so/';
    var DS_kVersionName = 'v2/';
    var DS_kAPIJS = 'jsapi/';
    var DS_kAPIUrl = 'url/';
    var DS_kDSTag = 'ds_tag';


    //-----------------------------------------------------------------------------
    // Private
    //-----------------------------------------------------------------------------
    var _deeplinkLocation = '';
    var _dstLocation = '';
    var _bindedDeepLink = BIND_STATUS.INITIAL;

    var _AppData = {
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
    var _ResponseData = null;
    var _Params = null;
    var _DSCallbacks = {
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
            _gotoUrl(_Params.url);
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

    var _env = {
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
            if (window.location.search.indexOf(DS_kDSTag) < 0) {
                var tag = Math.floor((Math.random() * 1000000));
                var queryStr = "?" + DS_kDSTag + "=" + tag;
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

    var _AppInsStatus = {
        NotInstall: 0,
        Installed: 1,
        Unclear: 2
    };

    var _DSAction = {
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


    //-----------------------------------------------------------------------------
    // Private Functions
    //-----------------------------------------------------------------------------
    var _initialize = function(params) {
        // // Set Locale
        // var lang = navigator.language;
        // var isEng = /^en/.test(lang);
        // if (isEng) {
        //     document.write("<script src='../../jsserver/en/langconfig.js'><\/script>");
        // } else {
        //     document.write("<script src='../../jsserver/chs/langconfig.js'><\/script>");
        // }

        if (!IsNullOrUndefined(params.app_id)) {
            _AppData.app_id = params.app_id;
        }
        if (!IsNullOrUndefined(params.inapp_data)) {
            _AppData.inapp_data     = JSON.stringify(params.inapp_data);
        }
        if (!IsNullOrUndefined(params.sender_id)) {
            _AppData.sender_id      = params.sender_id;
        }
        if (!IsNullOrUndefined(params.download_title)) {
            _AppData.download_title = params.download_title;
        }
        if (!IsNullOrUndefined(params.download_msg)) {
            _AppData.download_msg   = params.download_msg;
        }
        if (!IsNullOrUndefined(params.download_btn_text)) {
            _AppData.download_btn_text  = params.download_btn_text;
        }
        if (!IsNullOrUndefined(params.download_url_ios)) {
            _AppData.download_url_ios   = params.download_url_ios;
        }
        if (!IsNullOrUndefined(params.download_url_android)) {
            _AppData.download_url_android   = params.download_url_android;
        }
        if (!IsNullOrUndefined(params.channels)) {
            _AppData.channels     = JSON.stringify(params.channels);
        }

        if (!IsNullOrUndefined(params.callbacks)) {
            _DSCallbacks = params.callbacks;
        }

        _refreshBind(true);
    };

    var _refreshBind = function(force) {
        DeepShare.dsLogDebug('Try refresh bind, force: ' + force + ', binded: ' + _bindedDeepLink);

        // !force: [null|undefined|''|0] all can be true 
        if (!force && _bindedDeepLink === BIND_STATUS.BINDED) {
            return;
        }

        // FIXME: add for test
        // _Params = Params

        var requestUrl = DS_kRequestProtocol +
                         DS_kServerName +
                         DS_kVersionName +
                         DS_kAPIJS +
                         _AppData.app_id;

        $.ajax({
            url: requestUrl,
            type: 'POST',
            data: JSON.stringify(_AppData),
            xhrFields: {withCredentials: true,},
            success: function(result) {
                _Params = result;
                _bindedDeepLink = BIND_STATUS.BINDED;
                DeepShare.dsLogDebug('Params from api:' + JSON.stringify(params) + JSON.stringify(result));
            },
            error: function() {
                DeepShare.dsLogDebug('Refresh Params Error');
            },
            dataType: 'json',
        });
    };

    var _reportDSJSEvent = function(eventType, dst) {
        var params = {
            action: eventType,
            kvs: {
                "click_id": _Params.match_id,
                "destination": dst,
                "ds_tag": _Params.ds_tag
            }
        };
        var requestUrl = DS_kRequestProtocol +
                         DS_kServerName +
                         _DSAction.trackingUrl +
                         _Params.app_id;
        var paramsJson = JSON.stringify(params);
        $.post(requestUrl, paramsJson, function (result) {
        }).error(function () {
            //Do your own business logic in case that our server is down.
        });
    };

    var _reportDSJSUserClickEvent = function(eventType, btn, choice) {
        var params = {
            action: eventType,
            kvs: {
                "click_id": _Params.match_id,
                "user_btn": btn,
                "user_choice": choice,
                "ds_tag": _Params.ds_tag
            }
        };
        var requestUrl = DS_kRequestProtocol +
                         DS_kServerName +
                         _DSAction.trackingUrl +
                         _Params.app_id;
        var paramsJson = JSON.stringify(params);
        $.post(requestUrl, paramsJson, function (result) {
        }).error(function () {
            //Do your own business logic in case that our server is down.
        });
    };

    var _clearTimeoutOnPageUnload = function (redirectTimer) {
        _env.windowAddEventListener("pagehide", function () {
            DeepShare.dsLogDebug('window event pagehide');
            
            clearTimeout(redirectTimer);

        });
        _env.windowAddEventListener("blur", function () {
            DeepShare.dsLogDebug('window event blur');

            clearTimeout(redirectTimer);
        });
        _env.windowAddEventListener("unload", function () {
            DeepShare.dsLogDebug('window event unload');

            clearTimeout(redirectTimer);
        });
        document.addEventListener("webkitvisibilitychange", function () {
            DeepShare.dsLogDebug('window event webkitvisibilitychange');

            if (document.webkitHidden) {
                DeepShare.dsLogDebug('window is hidden');
                clearTimeout(redirectTimer);
            } else {
                // Switch back window from app
                // No need, Only YYB need refresh, but yyb url is new page, when
                // backward!!
            }
        });
        _env.windowAddEventListener("beforeunload", function () {
            DeepShare.dsLogDebug('window event beforeunload');
            clearTimeout(redirectTimer);
        });
        _env.windowAddEventListener("focus", function () {
            DeepShare.dsLogDebug('window event focus');

            //focus event is dangerous, it shows at least Firefox and Xiaomi Browser will receive a focus event when it try to deeplink.
            //So do not use event to clear timer.
            //if (isFirefox()) {
            //    return;
            //}
            //clearTimeout(redirectTimer);
            //env.windowChangeHistory();
        });
        _env.windowAddEventListener("focusout", function () {
            DeepShare.dsLogDebug('Window event focusout');

            clearTimeout(redirectTimer);
        });
    };


    _gotoTip = function(type, dst) {
        DeepShare.dsLogDebug('Go to tip: ' + dst);

        if (type === "ios") {
            switch (dst) {
                case _DSAction.destination.dstweixintipios:
                    if (!IsNullOrUndefined(_DSCallbacks.weixinIOSTipCallback)) {
                        _DSCallbacks.weixinIOSTipCallback();
                    }
                    break;
                case _DSAction.destination.dstweibotipios:
                    if (!IsNullOrUndefined(_DSCallbacks.weiboIOSTipCallback)) {
                        _DSCallbacks.weiboIOSTipCallback();
                    }
                    break;
                case _DSAction.destination.dstqqtipios:
                    if (!IsNullOrUndefined(_DSCallbacks.qqIOSTipCallback)) {
                        _DSCallbacks.qqIOSTipCallback();
                    }
                    break;
            }
        } else if (type === "android") {
            switch (dst) {
                case _DSAction.destination.dstweixintipandroid:
                    if (!IsNullOrUndefined(_DSCallbacks.weixinAndroidTipCallback)) {
                        _DSCallbacks.weixinAndroidTipCallback();
                    }
                    break;
                case _DSAction.destination.dstweibotipandroid:
                    if (!IsNullOrUndefined(_DSCallbacks.weiboAndroidTipCallback)) {
                        _DSCallbacks.weiboAndroidTipCallback();
                    }
                    break;
                case _DSAction.destination.dstqqtipandroid:
                    if (!IsNullOrUndefined(_DSCallbacks.qqAndroidTipCallback)) {
                        _DSCallbacks.qqAndroidTipCallback();
                    }
                    break;
            }
        }
        //_env.windowUrlAddTag();   ???
        _dstLocation = dst;
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _gotoCannotDeeplink = function() {
        DeepShare.dsLogDebug('cannot deeplink');

        if (!IsNullOrUndefined(_DSCallbacks.cannotDeeplinkCallback)) {
            _DSCallbacks.cannotDeeplinkCallback();
        }

        _dstLocation = _DSAction.destination.dstcannotdeeplink;
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _gotoAndroidNewInstall = function() {
        if (_Params.is_download_directly) {
            _gotoAndroidDownloadUrl();
        } else {
            if (_Params.cannot_go_market) {
                _gotoAndroidCannotGoMarketLandingPage();
            } else if (_Params.cannot_get_win_event || _Params.is_uc) {
                _gotoAndroidMarketLandingPage();
            } else {
                _gotoAndroidMarket();
            }
        }
    };

    var _gotoIOSLandingPage = function() {
        _dstLocation = _DSAction.destination.dstios9UniversalLinkLandPage;
        DeepShare.dsLogDebug('Go to iOS landing page: ' + _dstLocation);

        if (!IsNullOrUndefined(_DSCallbacks.iosLandingCallback)) {
            _DSCallbacks.iosLandingCallback();
        }
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _gotoAndroidMarketLandingPage = function() {
        _dstLocation = _DSAction.destination.dstandroidMarketLandPage;
        DeepShare.dsLogDebug('Go to android market landing page: ' + _dstLocation);

        if (!IsNullOrUndefined(_DSCallbacks.androidMarketLandingCallback)) {
            _DSCallbacks.androidMarketLandingCallback();
        }
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _gotoAndroidCannotGoMarketLandingPage = function() {
        _dstLocation = _DSAction.destination.dstandroidCannotGoMarketLandPage;
        DeepShare.dsLogDebug('Go to android can not go to market landing page: ' + _dstLocation);

        if (!IsNullOrUndefined(_DSCallbacks.androidCannotGoMarketLandingCallback)) {
            _DSCallbacks.androidCannotGoMarketLandingCallback();
        }
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _gotoAndroidDownloadUrl = function() {
        _dstLocation = _DSAction.destination.dstandroidDirectDownloadLandPage;
        DeepShare.dsLogDebug('Go to android download landing page: ' + _dstLocation);

        if (!IsNullOrUndefined(_DSCallbacks.androidDownloadLandingCallback)) {
            _DSCallbacks.androidDownloadLandingCallback();
        }
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _gotoAndroidMarket = function() {

        _dstLocation = 'market://details?id=' + _Params.pkg;
        DeepShare.dsLogDebug('Go to android market: ' + _dstLocation);

        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
        _env.windowLocation(_dstLocation);
    };

    var _gotoUrl = function(url) {
        DeepShare.dsLogDebug('Goto url: ' + url);

        // Page changed, no need to refresh

        _dstLocation = url;
        _reportDSJSEvent(_DSAction.actionJSDst, url);
        _env.windowLocation(url);
    };

    var _gotoPlatformNotAvail = function(platform) {
        if (platform === "ios") {
            if (!IsNullOrUndefined(_DSCallbacks.iosPlatformNotAvailCallback)) {
                _DSCallbacks.iosPlatformNotAvailCallback();
            }
        } else if (platform === "android") {
            if (!IsNullOrUndefined(_DSCallbacks.androidPlatformNotAvailCallback)) {
                _DSCallbacks.androidPlatformNotAvailCallback();
            }
        }
        _dstLocation = _DSAction.destination.dstplatformNA.replace(/{Platform}/g, platform);
        _reportDSJSEvent(_DSAction.actionJSDst, _dstLocation);
    };

    var _deeplinkLaunch = function(deeplink, timeoutTime, timeoutCallback) {
        _deeplinkLocation = deeplink;
        DeepShare.dsLogDebug('deeplinklaunch: ' + _deeplinkLocation);

        _reportDSJSEvent(_DSAction.actionJSDeepLink, deeplink);
        _env.windowLocation(deeplink);
        var timeout = setTimeout(function () {
            timeoutCallback();
        }, timeoutTime);
        _clearTimeoutOnPageUnload(timeout);
    };

    var _chiosDeeplinkLaunch = function(deeplink, timeoutCallback) {
        _deeplinkLocation = deeplink;
        var w = null;
        try {
            _reportDSJSEvent(_DSAction.actionJSDeepLink, deeplink);
            w = _env.windowOpen(deeplink);
            DeepShare.dsLogDebug('chrome ios open pass');

        } catch (e) {
            DeepShare.dsLogDebug('chrome ios open exception');
        }
        if (w) {
            _env.windowClose();
        } else {
            timeoutCallback();
        }
    };

    var _iframeDeeplinkLaunch = function(deeplink, timeoutTime, timeoutCallback) {
        DeepShare.dsLogDebug('Go to iframeDeeplinkLaunch: ' + deeplink);

        var timeout = setTimeout(function () {
            timeoutCallback();
        }, timeoutTime);
        _clearTimeoutOnPageUnload(timeout);
        var hiddenIFrame = document.createElement('iframe');
        hiddenIFrame.style.width = '1px';
        hiddenIFrame.style.height = '1px';
        hiddenIFrame.border = 'none';
        hiddenIFrame.style.display = 'none';
        hiddenIFrame.src = deeplink;
        document.body.appendChild(hiddenIFrame);
        _deeplinkLocation = deeplink;
        _reportDSJSEvent(_DSAction.actionJSDeepLink, deeplink);
    };

    var _isIosNotAvailable = function() {
        return _Params.is_ios && (_Params.bundle_id === undefined || _Params.bundle_id === "");
    };

    var _isAndroidNotAvailable = function() {
        return _Params.is_android && (_Params.pkg === undefined || _Params.pkg === "");
    };

    var _shouldGotoYYB = function() {
        return _Params.yyb_url !== undefined && _Params.yyb_url !== "";
    };

    var _dealIOS = function(tag, dst, url) {
        // Righ now, url are all `yyb_url`
        DeepShare.dsLogDebug('Deal with iOS: ' + tag + ' dst: ' + dst + ' url: ' + url);
        if (_Params.ios_major <= 8) {
            if (!IsNullOrUndefined(url)) {
                _gotoUrl(url);
            } else {
                _gotoTip(tag, dst);
            }
        } else {
            if (_Params.is_universal_link) {
                _gotoUrl(_Params.ds_url);
            } else {
                _gotoTip(tag, dst);
            }
        }
    };


    //-----------------------------------------------------------------------------
    // Public Functions
    //-----------------------------------------------------------------------------
    this.Start = function() {
        _reportDSJSEvent('ds_jssdk_click', '');
        var deeplinkurl = '';
       
        /* 
         * Maybe use later 
        if (_bindedDeepLink === BIND_STATUS.INITIAL) {
            // Just ignore, have not bind yet,
            // BINDED or DISMISSED both will fall through
            //
            // currently the same effect of `_isIosNotAvailable` and `_isAndroidNotAvailable`
            // because, the default params of INITIAL equals to `_isIosNotAvailable` `_isAndroidNotAvailable`
            return;
        }
        */

        if (_isIosNotAvailable()) {
            _gotoPlatformNotAvail('ios');
            return;
        } else if (_isAndroidNotAvailable()) {
            _gotoPlatformNotAvail('android');
            return;
        }
        if (_Params.is_wechat) {
            DeepShare.dsLogDebug('In WeChat');

            if (_shouldGotoYYB()) {
                DeepShare.dsLogDebug('YYBurl is: ' + _Params.yyb_url);

                if (_Params.is_ios) {
                    _dealIOS('ios', _DSAction.destination.dstweixintipios, _Params.yyb_url);
                } else {
                    _gotoUrl(_Params.yyb_url);
                }
            } else {
                if (_Params.is_ios) {
                    DeepShare.dsLogDebug("isIOS without YYBurl");

                    _dealIOS('ios', _DSAction.destination.dstweixintipios);
                } else if (_Params.is_android) {
                    DeepShare.dsLogDebug("isAndroid without YYBurl");

                    _gotoTip('android', _DSAction.destination.dstweixintipandroid);
                }
            }

        } else if (_Params.is_qq) {
            DeepShare.dsLogDebug("In QQ");

            if (_shouldGotoYYB()) {
                DeepShare.dsLogDebug('YYBurl is: ' + _Params.yyb_url);

                if (_Params.is_ios) {
                    _dealIOS('ios', _DSAction.destination.dstqqtipios, _Params.yyb_url);
                } else {
                    _gotoUrl(_Params.yyb_url);
                }
            } else {
                if (_Params.is_ios) {
                    DeepShare.dsLogDebug("isIOS");

                    _dealIOS('ios', _DSAction.destination.dstqqtipios);
                } else if (_Params.is_android) {
                    DeepShare.dsLogDebug("isAndroid");

                    _gotoTip('android', _DSAction.destination.dstqqtipandroid);
                }
            }
        } else if (_Params.is_weibo) {
            DeepShare.dsLogDebug("In Weibo");

            if (_Params.is_ios) {
                DeepShare.dsLogDebug("isIOS");
                
                _dealIOS('ios', _DSAction.destination.dstweibotipios);
            } else if (_Params.is_android) {
                DeepShare.dsLogDebug("isAndroid");

                _gotoTip('android', _DSAction.destination.dstweibotipandroid);
            }
        } else if (_Params.is_ios) {
            // don't care for toutiao
            DeepShare.dsLogDebug("In iOS");

            deeplinkurl = _Params.scheme + '://';
            if (_Params.match_id && _Params.match_id.length > 0) {
                deeplinkurl += "?click_id=" + _Params.match_id;
            }
            DeepShare.dsLogDebug('Deeplink url: ' + deeplinkurl);

            if (_Params.ios_major < 9) {
                DeepShare.dsLogDebug("IOS Major below 9:" + _Params.ios_major);

                _iframeDeeplinkLaunch(deeplinkurl, 2000, function () {
                    _gotoUrl(_Params.url);
                });
            } else {
                DeepShare.dsLogDebug("IOS Major upper 9:" + _Params.ios_major);

                if (_Params.chrome_major > 0) {
                    DeepShare.dsLogDebug("isChrome");

                    _chiosDeeplinkLaunch(deeplinkurl, function () {
                        _gotoUrl(_Params.url);
                    });
                } else if (_Params.is_universal_link) {
                    //If it is universal link, it mean it is in two situation
                    //1.The App is not installed
                    //2.The App is installed, but the system prefer the web page
                    //So we need to show the landing page to cover both situation
                    DeepShare.dsLogDebug("isUniversallink = true");


                    // TODO: universal link problem!
                    _gotoUrl(_Params.ds_url);
                    /*
                    if (_env.cookieEnabled()){
                        DeepShare.dsLogDebug("cookie Enabled; AppInsStatus:" + _Params.app_ins_status);

                        // TODO: go to universal link page. 
                        switch (parseInt(_Params.app_ins_status, 10)){
                            case _AppInsStatus.Installed:
                                _gotoIOSLandingPage();
                                break;
                            case _AppInsStatus.NotInstall:
                                _gotoUrl(_Params.url);
                                break;
                            case _AppInsStatus.Unclear:
                                _gotoIOSLandingPage();
                                break;
                            default:
                                _gotoIOSLandingPage();
                                break;
                        }
                    } else {
                        DeepShare.dsLogDebug("Cookie Not Enabled");

                        _gotoIOSLandingPage();
                    }*/
            } else {
                DeepShare.dsLogDebug("is safari");

                _deeplinkLaunch(deeplinkurl, 500, function () {
                    _gotoUrl(_Params.url);
                    });
                }
            }

        } else if (_Params.is_android) {
            DeepShare.dsLogDebug("In Android");

            deeplinkurl = _Params.scheme + '://' + _Params.host;
            if (_Params.match_id && _Params.match_id.length > 0) {
                deeplinkurl += "?click_id=" + _Params.match_id;
            }
            DeepShare.dsLogDebug('Deeplink url: ' + deeplinkurl);
                
            if (_Params.cannot_deeplink) {
                _iframeDeeplinkLaunch(deeplinkurl, 2000, function () {
                    _gotoCannotDeeplink();
                });
            } else if (_Params.is_qq_browser) {
                DeepShare.dsLogDebug("In QQ browser");

                if (_shouldGotoYYB()) {
                    DeepShare.dsLogDebug(_Params.yyb_url);

                    // In QQ browser open yyburl without page event!
                    _refreshBind();
                    _gotoUrl(_Params.yyb_url);
                } else {
                    _gotoCannotDeeplink();
                }
            } else if (_Params.is_uc) {
                DeepShare.dsLogDebug("In UC browser");

                // confirm button, long time to wait ...
                // TODO: show loading...
                _iframeDeeplinkLaunch(deeplinkurl, 5000, function () {
                    _gotoAndroidNewInstall();
                });
            } else if (_Params.chrome_major >= 25 && !_Params.force_use_scheme) {
                DeepShare.dsLogDebug("In chrome major >= 25, Chrome_major:" + _Params.chrome_major);

                //Extract scheme from deeplink
                var intent = _Params.host;
                if (_Params.match_id && _Params.match_id.length > 0) {
                    intent += "?click_id=" + _Params.match_id;
                }
                var pkg = _Params.pkg;
                // When deeplinking on chrome 35+, there is inherent app store
                // fallback logic built into the browser (likely a bug in Chrome).
                // Workaround for Bug https://code.google.com/p/chromium/issues/detail?id=459711&thanks=459711&ts=1424288965.
                var workaroundlink = "intent://" + intent +
                                     "#Intent;scheme=" + toLowerCase(_Params.scheme) +
                                     ";package=" + pkg +
                                     ";S.browser_fallback_url=" + _Params.url +
                                     ";end";

                _deeplinkLaunch(workaroundlink, 2000, function () {
                    _gotoAndroidNewInstall();
                });
                /*
                _deeplinkLaunch(deeplinkurl, 2000, function () {
                    ._gotoAndroidNewInstall();
                });
                */
            } else {
                DeepShare.dsLogDebug("In default browser");

                _iframeDeeplinkLaunch(deeplinkurl, 2000, function () {
                    _gotoAndroidNewInstall();
                });
            }
        }

        _bindedDeepLink = BIND_STATUS.DISMISSED;
    };

    this.SetParam = function(params) {
        _initialize(params);    
    };
    this.SetBindInfo = function(params) {
        _Params = params;
    };
    this.BindInAppInfo = function() {
        _refreshBind();
    };
    this.SetCallbackWeixinIOSTip = function(callback) {
        _DSCallbacks.weixinIOSTipCallback = callback; 
    };
    this.SetCallbackWeixinAndroidTip = function(callback) {
        _DSCallbacks.weixinAndroidTipCallback = callback;
    };
    this.SetCallbackWeiboIOSTip = function(callback) {
        _DSCallbacks.weiboIOSTipCallback = callback; 
    };
    this.SetCallbackWeiboAndroidTip = function(callback) {
        _DSCallbacks.weiboAndroidTipCallback = callback;
    };
    this.SetCallbackQQIOSTip = function(callback) {
        _DSCallbacks.qqIOSTipCallback = callback; 
    };
    this.SetCallbackQQAndroidTip = function(callback) {
        _DSCallbacks.qqAndroidTipCallback = callback; 
    };
    this.SetCallbackQQAndroidTip = function(callback) {
        _DSCallbacks.qqAndroidTipCallback = callback; 
    };
    this.SetCallbackIOSNotAvailable = function(callback) {
        _DSCallbacks.iosPlatformNotAvailCallback = callback;
    };
    this.SetCallbackAndroidNotAvailable = function(callback) {
        _DSCallbacks.androidPlatformNotAvailCallback = callback;
    };
    this.SetCallbackCannotDeeplink = function(callback) {
        _DSCallbacks.cannotDeeplinkCallback = callback;
    };

    this.SetCallbackIOSLanding = function(callback) {
        _DSCallbacks.iosLandingCallback = callback;
    };
    this.SetCallbackAndroidMarketLanding = function(callback) {
        _DSCallbacks.androidMarketLandingCallback = callback;
    };
    this.SetCallbackAndroidDownloadLanding = function(callback) {
        _DSCallbacks.androidDownloadLandingCallback = callback;
    };
    this.SetCallbackAndroidCannotGoMarketLanding = function(callback) {
        _DSCallbacks.androidCannotGoMarketLandingCallback = callback;
    };


    // Init
    _initialize(params);
}



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

