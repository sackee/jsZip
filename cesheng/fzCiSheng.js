var fzAiengine = {
	isOk : false,//初始化次声是否正常
	isStart : false,//是否正在录音
	isCeping : false,//是否正在测评
	startClickTag : 0,//点击开始录音标志
	endClickTag : 0,//结束录音标示
	timeOut	: 5,//初始化次声签名重试时间
	startTime : 0, //开始录音时间
	endTime :0,//结束录音时间
	localId : '',
	res :{},
	
	request : {
            attachAudioUrl: 1,
            rank: 100,
            coreType: "en.pred.exam",
            refText: {
                qid: "PAPER-000002-QT-000002",
                lm: ""
            },
            precision: 0.5,
            client_params: {
                ext_subitem_rank4: 0,
                ext_word_details: 1
            }
	},
	
	//初始化签名
	aiengineNew : function () {
		var self = this;
		self.timeOut -- ;
		aiengine.aiengine_new({
	          url: "/index.php?m=Home&c=CiSheng&a=sign",
	          preAuthorize: 0,
	          serverTimeout: 30,
	          success: function (res) {
	        	  self.isOk = true;
	          },
	          fail: function (err) {
	        	  if (self.timeOut > 0) {
	        		  setTimeout(function(){
	            		  self.aiengineNew();
	            		  },1000);
	        	  } else {
	        		  self.toast("初始化录音机失败，请尝试重新刷新页面~");
	        	  }
	          },
	          complete: function (res) {
	        	  
	          } //选
	    });
	},
	
	//开始录音
	aiengineStart: function(lm) {
		var self = this;
		if (!self.isOk) {
			 self.toast("正在初始化录音机~");
			 return false;
		}
		if (self.startClickTag == 0) {
			 self.startClickTag = 1;
	         setTimeout(function () {self.startClickTag = 0}, 500);
	         if (!self.isStart && !self.isCeping) {
	        	 self.startTime = new Date().getTime();
	        	 self.startRecord(lm);
	         }
	    }
		return true;
	},
	
	//结束录音
	aiengineStop: function() {
		var self = this;
		if (self.endClickTag == 0) {
			 self.endClickTag = 1;
	         setTimeout(function () {self.endClickTag = 0}, 500);
	         self.endTime = new Date().getTime();
	         if (self.endTime - self.startTime >= 1000) {
	        	 self.startTime = 0;
	        	 self.endTime = 0;
	        	 self.stopRecord();
	         }
	    }
        return true;
	},
	
	//开始录音状态
	beforeStartRecord :function (){
    	if(typeof beforeStartRecord != 'undefined' && beforeStartRecord instanceof Function){   
    		beforeStartRecord();  
        } 
    },
    //开始录音成功
    startRecordSuccess:function() {
    	if(typeof startRecordSuccess != 'undefined' && startRecordSuccess instanceof Function){   
    		startRecordSuccess();  
        }
    },
    //开始录音失败
    startRecordFail:function () {
    	if(typeof startRecordFail != 'undefined' && startRecordFail instanceof Function){   
    		startRecordFail();  
        }
    },
    
    //开始录音完成
    startRecordComplete:function () {
    	if(typeof startRecordComplete != 'undefined' && startRecordComplete instanceof Function){   
    		startRecordComplete();  
        }
    },
    
    //测评结束
    cepingComplete: function() {
    	if(typeof cepingComplete != 'undefined' && cepingComplete instanceof Function){   
    		cepingComplete();  
        }
    },
	
    //开启录音
	startRecord: function(lm) {
		var self = this;
		self.beforeStartRecord();
		self.isStart = true;
		self.request.refText.lm = lm;
		aiengine.aiengine_start({
            isShowProgressTips: 0,
            request: self.request,
            success: function (res) {
            	self.res = res;
            	self.isCeping = false;
            	self.cepingComplete();
            },
            fail: function (err) {
	           	if (self.isCeping) {
	           		 self.toast("测评失败~");
	           		 self.isCeping = false;
	           		 self.cepingComplete();
	           	} else {
	           		 self.toast("开始录音失败~");
	           		 self.isStart = false;
	           		 self.isCeping = false;
	           		 self.startRecordFail();
	           	}
            },
            complete: function (res) {
            	self.localId = res.localId;
            	self.startRecordComplete();
            }
        });
		
	},
    
    //结束录音成功
    stopRecordSuccess:function() {
    	if(typeof stopRecordSuccess != 'undefined' && stopRecordSuccess instanceof Function){   
    		stopRecordSuccess();  
        }
    },
    //结束录音失败
    stopRecordFail:function () {
    	if(typeof stopRecordFail != 'undefined' && stopRecordFail instanceof Function){   
    		stopRecordFail();  
        }
    },
    
    //结束录音完成
    stopRecordComplete:function () {
    	if(typeof stopRecordComplete != 'undefined' && stopRecordComplete instanceof Function){   
    		stopRecordComplete();  
        }
    },
    
    //结束录音
    stopRecord :function() {
    	var self = this;
        aiengine.aiengine_stop({
            success: function (res) {
            	
           	 	self.isStart = false;
           	 	self.isCeping = true;
           	 	self.stopRecordSuccess();
            },
            fail: function (err) {
            	
            	self.isStart = false;
            	self.isCeping = false;
            	self.stopRecordFail();
            },
            complete: function (res){
           	 	console.log(res);
          　}
        });
    },
    toast :function(txt) {
    	if(typeof toast != 'undefined' && toast instanceof Function){   
    		toast(txt);  
        }
    }
    
};
    
    




