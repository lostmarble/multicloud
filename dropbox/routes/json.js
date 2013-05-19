
/*
 * GET home page.
 */

 var dbox = require('dbox');

 var querystring=require('querystring');
 function setupApp(session){
 	if (session.app_info != null)
	 	return dbox.app({ 
	 		"app_key": session.app_info.app_key, 
	 		"app_secret": session.app_info.app_secret,
	 		"root": session.app_info.root
	 	});
	 else 
	 	return null;
 }

 function setupClient(session){
 	var app = setupApp(session);
    console.log("setupClient:"+session.app_info.root);
 	if (app != null && session.access_token != null)
    	return app.client(session.access_token);
   	else 
   		return null;
 }

var kuaipan = require('./kuaipan.js')
exports.setupKuaiPan = function(req,res) {
    console.log("setup kuaipan")
    kuaipan.getAuthorization("/setVerifier",function(){});
    //kuaipan.getAccessToken(function(){})
}

exports.setVerifier = function(req,res) {
    console.log("set verifier!");
    //kuaipan.setKey("oauth_token",get.oauth_token);
    //kuaipan.setKey("oauth_verifier",get.oauth_verifier);
};

function kmetadata (path) {
    kuaipan.getMetadata(path,
            function(d){
                data=[]
                for (var f in d){
                    keys= { revision: 12,
                    rev: 'c066ef489',
                    bytes: f.size,
                    modified: f.modify_time,
                    client_mtime:f.create_time,
                    path: f.path,
                    is_dir: f.type=="folder"?true:false,
                    root: 'dropbox' }
                    data.push(keys);
                }
                kuaipan.setKey("metadata",data);
                console.log(querystring.stringify(d));
            },
            {});
};
exports.setupApp = function(req, res){
	var app = dbox.app({ 
		//"app_key": req.param('app_key'), 
		//"app_secret": req.param('app_secret'),
		//"root": req.param('root')
		"app_key": "ihhr5sr4k7xvbmm",
		"app_secret": "am67cc7dcs5jxwb",
        "root": "dropbox"
	});
	app.requesttoken(function(status, request_token){
		if (status == 200) {
			req.session.request_token = request_token;
			req.session.app_info = {
			//	app_key: req.param('app_key'),
			//	app_secret: req.param('app_secret'),
			//	root: req.param('root')
                app_key: "ihhr5sr4k7xvbmm",
                app_secret: "am67cc7dcs5jxwb",
                root: "dropbox"
			}
		}
		res.send({status: status, request_token: request_token});
	});
};

exports.generateAccessToken = function(req,res){
	if (req.session.app_info != null && req.session.request_token != null){
		var app = setupApp(req.session);
		app.accesstoken(req.session.request_token, function(status, access_token){
			if (status == 200) req.session.access_token = access_token;
			res.send({status: status, access_token: access_token});
		});
	} else {
		res.send({status: 10000});
	}
};

exports.metadata = function(req,res){
	var client = setupClient(req.session);
	if (client != null){
        kmetadata(req.param('path') ? req.param('path'):'app_folder/');
		client.metadata( req.param('path') ? req.param('path') : '/', {}, function(status, result){
            //result.contents.push(kuaipan.metadata);
			res.send({status: status, result: result});
            console.log(result)
		});
	} else {
		res.send({status: 10000});
	}
}

exports.mkdir = function(req,res){
	var client = setupClient(req.session);
	if (client != null){
		client.mkdir( req.param('path'), {}, function(status, result){
			res.send({status: status, result: result});
		});
	} else {
		res.send({status: 10000});
	}
}

