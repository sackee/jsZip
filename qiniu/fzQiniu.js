
var qiniu_token_url=new Array();
qiniu_token_url["FILE"] = "/index.php?m=Admin&c=Qiniu&a=QiniuToken";
qiniu_token_url["PIC"] = "/index.php?m=Admin&c=Qiniu&a=PicQiniuToken";


function fzBaseQiniu(uploador,complete,next,error,type){
	
	this.uploador = uploador;
	this.next = next;
	this.error = error;
	this.complete = complete;
	this.token;
	this.savepath;
	this.savename;
	this.key;
	this.type=type||'FILE';
	this.obj;

	 
	this.config = {
             useCdnDomain: true,
             disableStatisticsReport: false,
             region: qiniu.region.z0
         };
	
    this.putExtra = {
             fname: "",
             params: {},
             mimeType: null
         };
    
    this.setConfig=function(config){
    	this.config=config;
    }
    
    this.setExtra=function(extra){
    	this.putExtra=extra;
    }    
    
    this.getToken=function(){
    	var self=this;
    	var url=qiniu_token_url[self.type];
    	$.ajax({
             type: "POST",
             url: url,
             dataType: 'json',
             async: false,
             success: function(data) {
            	 self.token=data.upload_token;
             }
        });
    };
    
    this.getToken();
    
    this.upload=function(){
    	var self=this;
    	$(this.uploador).change(function(e){
    		self.obj=$(this);
    		var file = this.files[0];
    		
            var ext = file.name.substr(file.name.lastIndexOf("."));
    		self.savepath = new Date().Format("yyyy-MM-dd");
    		self.savename = uuid(16, 46) + ext;
    		self.key = self.savepath + "/" + self.savename;
            
    		var observable = qiniu.upload(file, self.key, self.token, self.putExtra, self.config);
    		observable.subscribe(self.next, self.error, self.complete);
    	})
    };    
	
}

function fzQiniu(uploador,complete,next,error){
	return new fzBaseQiniu(uploador,complete,next,error,'FILE');
}

function fzQiniuPic(uploador,complete,next,error){
	return new fzBaseQiniu(uploador,complete,next,error,'PIC');
}


function fzQiniuBase64(base,complete,ext,error,type){
	
	this.base=base;
	this.type=type||'FILE';
	this.token;
	this.savepath;
	this.savename;
	this.key;
	this.obj;
	this.complete=complete;
	this.next = next;
	this.error = error;
	this.config={
		ext:'',
		baseType:'INPUT',
		baseDeal:''
	}
	
	this.setConfig=function(config){
		this.config=config;
	}
	
	this.getToken=function(){
    	var self=this;
    	var url=qiniu_token_url[self.type];
    	$.ajax({
             type: "POST",
             url: url,
             dataType: 'json',
             async: false,
             success: function(data) {
            	 self.token=data.upload_token;
             }
        });
	};
	this.getToken();
	
	this.upload=function(){
		if(this.config.baseType=='DATA'){
			this.baseUpload();
		}else{
			this.inputUpload();
		}

	}
	
	this.inputUpload=function(){
		var self=this;
		$(this.base).change(function(){
			self.obj=$(this);
			var file = this.files[0];
			self.config.ext = file.name.substr(file.name.lastIndexOf("."));
			
			reader = new FileReader();
			reader.onload = function(e) {  
			    self.base = e.target.result;
				self.baseUpload()
			}
			reader.readAsDataURL(file);
			
		})
	}
	
	this.baseUpload=function(){
		
		var self=this;
		
		if(typeof self.config.baseDeal === "function") {
			self.config.baseDeal(self);
		}
		
		var start=self.base.indexOf('base64,');
		if(start>=0){
		    self.base = self.base.substr(start+7);
		}
		
		self.savepath = new Date().Format("yyyy-MM-dd");
		self.savename = uuid(16, 46) + self.config.ext;
		self.key = self.savepath + "/" + self.savename;
		
		url = "https://upload.qbox.me/putb64/-1/key/"+Base64.encode(self.key); 
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange=function(){
	      if (xhr.readyState==4){
	        var res = JSON.parse(xhr.responseText);
	        self.complete(res);
	      }
	    }
	    xhr.open("post", url, true);
	    xhr.setRequestHeader("Content-Type", "application/octet-stream");
	    xhr.setRequestHeader("Authorization", "UpToken "+self.token);
	    xhr.send(self.base);
	}

}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};


var Base64 = {

	    // private property
	    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	    // public method for encoding
	    encode: function(input) {
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;

	        input = Base64._utf8_encode(input);

	        while (i < input.length) {

	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);

	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;

	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }

	            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

	        }

	        return output;
	    },

	    // public method for decoding
	    decode: function(input) {
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;

	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	        while (i < input.length) {

	            enc1 = this._keyStr.indexOf(input.charAt(i++));
	            enc2 = this._keyStr.indexOf(input.charAt(i++));
	            enc3 = this._keyStr.indexOf(input.charAt(i++));
	            enc4 = this._keyStr.indexOf(input.charAt(i++));

	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;

	            output = output + String.fromCharCode(chr1);

	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }

	        }

	        output = Base64._utf8_decode(output);

	        return output;

	    },

	    // private method for UTF-8 encoding
	    _utf8_encode: function(string) {
	        string = string.replace(/\r\n/g, "\n");
	        var utftext = "";

	        for (var n = 0; n < string.length; n++) {

	            var c = string.charCodeAt(n);

	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            } else if ((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            } else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }

	        }

	        return utftext;
	    },

	    // private method for UTF-8 decoding
	    _utf8_decode: function(utftext) {
	        var string = "";
	        var i = 0;
	        var c = c1 = c2 = 0;

	        while (i < utftext.length) {

	            c = utftext.charCodeAt(i);

	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            } else if ((c > 191) && (c < 224)) {
	                c2 = utftext.charCodeAt(i + 1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            } else {
	                c2 = utftext.charCodeAt(i + 1);
	                c3 = utftext.charCodeAt(i + 2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	                i += 3;
	            }

	        }

	        return string;
	    }

	}






