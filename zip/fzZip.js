
function fzZip(){
	
	this.zipName;
	this.fileList=new Array();
	this.show='';
	this.complete;
	
	this.append=function(url,name){
		name=name||this.filename(url);
		var arr=new Array();
		arr['url']=url;
		arr['name']=name;
		arr['is_load']=false;
		this.fileList[url]=arr;
	};
	
	
	this.setShow=function(show){
		this.show=show;
	}
	
	this.setComplete=function(complete){
		this.complete=complete;
	}
	
	//获取文件名
	this.filename=function(fileName){
		return fileName.substring(fileName.lastIndexOf("/")+1); 
	};
	
	
	//转成base64
	this.fileToBase64=function(request){
		var self = this;
		var reader = new FileReader();
	    reader.readAsDataURL(request.response);
	    reader.onload =  function(e){
	        var base=e.target.result;
	        var start=base.indexOf('base64,');
	        base = base.substr(start+7);
	        self.showProgress("转码base64成功"+request.responseURL);
	        self.canZip(request.responseURL,base);
	        
	    };
	    self.showProgress("正在转码base64"+request.responseURL+"...");
		
	};
	
	//加载文件
	this.loadFile=function(url){
		var self = this;
		var request = new XMLHttpRequest();
	    request.open('GET',url, true);
	    request.responseType = 'blob';
	    request.onload = function() {
	    	self.showProgress("下载文件成功"+url);
	    	self.fileToBase64(request);
	    };
	    request.send();
	    self.showProgress("正在下载文件"+url+'...');
	    
	};
	
	//是否zip
	this.canZip=function(url,base){
		this.fileList[url]['base']=base;
		this.fileList[url]['is_load']=true;
		var is_do=true;
		for(var key in this.fileList){
			if(!this.fileList[key].is_load){
				is_do=false;
				break;
			}
		}
		if(is_do){
			this.doZIP();
		}
	};
	
	this.doZIP=function(){

		var self=this;
		zipName=self.zipName;
		var folderName=zipName.substring(0,zipName.lastIndexOf(".")); 
		
		self.showProgress('正在压缩'+zipName+'文件...');
		var zip = new JSZip();
        var folder = zip.folder(folderName);
        for(var key in self.fileList){
			folder.file(self.fileList[key].name, self.fileList[key].base, {base64: true});
		}
        
        zip.generateAsync({type:"blob"}).then(function(content) {
        	self.showProgress('压缩'+zipName+'文件成功！');
        	
        	if(typeof self.complete === "function") {
    			self.complete(self);
    		}
        	
            saveAs(content,zipName);
        });
		
		
	};
	
	this.showProgress=function(txt){
		if(this.show!=''){
			$(this.show).append("<p>"+txt+"</p>");
		}
		console.log(txt);
	}
	
	this.run=function(zipName){
		
		var date=new Date();
		date=date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()+""+date.getHours()+""+date.getMinutes();
		zipName=zipName||date+'.zip';
		this.zipName=zipName;
		
		for(var key in this.fileList){
			this.loadFile(this.fileList[key].url);
		}
		
	};
	
}








