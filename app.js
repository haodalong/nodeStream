/*
	作者:		haodalong
	使用说明:	windows系统下，cmd窗口进入该文件目录，node app.js运行该文件，打开浏览器，输入网址http://localhost:3000/example.mp4即可看到视频内容
				（open the browser and type in http://localhost:3000/example.mp4 to watch the example video）
	联系:		tongjixuehao@163.com
*/

var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');


// 加载资源文件, load resources in current directory
// 读取当前目录下的指定文件
console.log('__dirname:'+__dirname);
fs.readFile(path.resolve(__dirname,"example.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    mp4_file = data;
});


// 创建http服务器
http.createServer(function (req, res) {
    var reqResource = url.parse(req.url).pathname;
	
    console.log("Resource: " + reqResource);
	
	if(req.headers.range==null){
		req.headers.range= 'bytes=0-';
	}	
	
	var total;
	
	if(reqResource == "/example.mp4"){
		total = mp4_file.length;
	}
	
	//console.log(req.headers);    
	var range = req.headers.range;
	var positions = range.replace(/bytes=/, "").split("-");
	var start = parseInt(positions[0], 10);
	// if last byte position is not present then it is the last byte of the video file.
	var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
	var chunksize = (end-start)+1;

	if(reqResource == "/example.mp4"){
		res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
							 "Accept-Ranges": "bytes",
							 "Content-Length": chunksize,
							 "Content-Type":"video/mp4"});
		res.end(mp4_file.slice(start, end+1), "binary");

	} 
    
}).listen(3000); 