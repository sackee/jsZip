var fzWx = {
	debug : false,
    init: function(debug) {
        var self = this;
        self.debug = debug || false;
        $.ajax({
            url: "/index.php?m=Home&c=Wx&a=createJsapiSign",
            data: {
                'url': window.location.href
            },
            type: 'post',
            dataType: "json",
            async: false,
            success: function(data) {
                self.config(data.appId, data.timestamp, data.nonceStr, data.signature);
                self.jsapiSignCallBack();
            },
            error: function (data) {
                console.log(data);
            }
        });

    },
    jsapiSignCallBack : function () {
    	if(typeof jsapiSignCallBack != 'undefined' && jsapiSignCallBack instanceof Function){   
        	jsapiSignCallBack();  
        } 
    },
    
    config: function(appId, timestamp, nonceStr, signature,debug) {
        wx.config({
            debug: this.debug,
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
        });
    },
    //获取用户信息
    wxShareSuccess :function (){
    	if(typeof wxShareSuccess != 'undefined' && wxShareSuccess instanceof Function){   
    		wxShareSuccess();  
        } 
    },
    wxShareCancel : function () {
    	if(typeof wxShareCancel != 'undefined' && wxShareCancel instanceof Function){   
    		wxShareCancel();  
        } 
    },
    hideAll: function () {
    	wx.ready(function() {
    		wx.hideAllNonBaseMenuItem();
    	})
    },
    share: function(title, desc, sharelink, imgUrl) {
        var self = this;
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: desc,
                // 分享标题
                link: sharelink,
                // 分享链接
                imgUrl: imgUrl,
                // 分享图标
                // desc: desc, // 分享描述
                success: function() {
                	self.wxShareSuccess();
                },
                cancel: function() {
                	self.wxShareCancel();
                }
            });
            wx.onMenuShareAppMessage({
                title: title,
                // 分享标题
                desc: desc,
                // 分享描述
                link: sharelink,
                // 分享链接
                imgUrl: imgUrl,
                // 分享图标
                type: '',
                // 分享类型,music、video或link，不填默认为link
                dataUrl: '',
                // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                	self.wxShareSuccess();
                },
                cancel: function() {
                	self.wxShareCancel(); 
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: title,
                // 分享标题
                desc: title + desc + "（@竹子英语）",
                // 分享描述
                link: sharelink,
                // 分享链接
                imgUrl: imgUrl,
                // 分享图标
                success: function() {
                	self.wxShareSuccess();
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                	self.wxShareCancel();
                }
            });
            wx.onMenuShareQQ({
                title: title,
                // 分享标题
                desc: desc,
                // 分享描述
                link: sharelink,
                // 分享链接
                imgUrl: imgUrl,
                // 分享图标
                success: function() {
                	self.wxShareSuccess();
                },
                cancel: function() {
                    self.wxShareCancel();
                }
            });
        });
    }
};
    
    
    




