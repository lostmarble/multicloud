var http = require("http");
var kuaipan = require("./kuaipan");
var querystring = require("querystring");

http.createServer(function(request, response) { 
	var chunks=[];
	request.on("data",function(chunk){
		chunks.push(chunk);
	}).on("end",function(){
		request.post=querystring.parse(chunks.join(""));
		handlerRequest(request, response);
	});
}).listen(80); 
console.log("setting up");

function handlerRequest(request, response){
    console.log(request.url);
	//设置key及secret
	//kuaipan.setKey("consumer_key","xcC8qU3GBEzH8kOh");
	//kuaipan.setKey("consumer_secret","IphFPT6gvHovU4D2");
	kuaipan.setKey("consumer_key","xcNS6gKATUFy9Nam");
	kuaipan.setKey("consumer_secret","DeXtVL9oi0ftsw4Q");
	switch(request.url.substr(1,2)){
		//回调地址，获取正式token
		case "cb":
			var get=querystring.parse(request.url.split("?")[1]);
            console.log(get)
			kuaipan.setKey("oauth_token",get.oauth_token);
			kuaipan.setKey("oauth_verifier",get.oauth_verifier);
			// oauth_token = get['oauth_token'];
			// oauth_verifier = get['oauth_verifier'];
			kuaipan.getAccessToken(function(){
				//response.writeHead(302, {"Location" : "http://127.0.0.1/us"}); 
				response.writeHead(302, {"Location" : "http://127.0.0.1/me"}); 
				response.end(); 
			});
		break;
		//获取用户信息
		case "us":
			kuaipan.getAccountInfo(function(d){
				response.writeHead(200,{"Content-Type":"text/html"});
				response.write("用户id"+d.user_id);
				response.write("<br>用户名"+d.user_name);
				response.write("<br>最大允许文件"+d.max_file_size);
				response.write("<br>空间总量"+d.quota_total);
				response.write("<br>使用量"+d.quota_used);
				response.write("<br>回收站"+d.quota_recycled);
				response.end();
			});
		break;
        //get metadata
        case "me":
            kuaipan.getMetadata("app_folder/",
                    function(d){
                        console.log(d);
                        response.writeHead(200,{"Content-Type":"text/html"});
                        response.write("用户id"+querystring.stringify(d));
                        response.end();
                    },
                    {}
            );
		break;

		//获取临时token
		default:
			kuaipan.getAuthorization("http://127.0.0.1/cb",function(d){
				response.writeHead(302, {"Location" : d}); 
                console.log("location:"+d)
				response.end(); 
			});
		break;
	}
}
