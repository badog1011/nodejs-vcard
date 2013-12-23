var vcard ;
var fs = require('fs');
var path = require('path');

fs.readFile(path.join(__dirname, '/db.json'), function(err, data) {
	vcard = JSON.parse(data);
});

exports.create = function(req, res){
	var person = {
		nickname: "",
		name: "",
		tel: ""
	};

	person.nickname = req.params.nickname;

	person.tel =  req.query.tel;
	person.name = req.query.name;

	vcard.push(person);

	//更新db.json
	fs.writeFile(path.join(__dirname, '/db.json'), JSON.stringify(vcard), function (err) {
		res.end();
	});
};

exports.read = function(req, res){
	res.send(vcard);

	res.end();	
};

exports.update = function(req, res){
	var nickname = req.params.nickname;

	vcard.forEach(function (entry) {
		if (entry.nickname === nickname) {
			console.log('found!');

			entry.name =  req.query.name;
			entry.tel =  req.query.tel;
		}
	});
	//更新db.json
	fs.writeFile(path.join(__dirname, '/db.json'), JSON.stringify(vcard), function (err) {
		res.end();
	});

};

exports.delete = function(req, res){
	var nickname = req.params.nickname;
	var newVcard = [];
	var delPath = path.join(__dirname, '../frontend/uploads', nickname +'.jpg' ); //刪除圖片路徑宣告
	//移除資料夾裡的圖檔
	fs.unlink(delPath, function(err, data){ 
		vcard.forEach(function (entry) {
		if (entry.nickname !== nickname) {
			console.log('file is delete!');
			newVcard.push(entry);
		}
		});
		vcard = newVcard;

		//刪除db.json資料
		 fs.writeFile(path.join(__dirname, '/db.json'), JSON.stringify(vcard), function (err) {
		 	res.end();
		 });
		
	});

};

exports.upload = function(req, res) {

    var type = req.params.type;   // 'photo' or 'voice'
    var ext;

    switch (type) {
    	case 'photo':
    		ext = '.jpg';
    		break;
    	case 'voice':
    		ext = '.mp3';
    		break;
    }
    var filename = req.params.nickname + ext;

    fs.readFile(req.files.file.path, function (err, data) {
        var newPath = path.join(__dirname, '../frontend/', 'uploads',  filename);

        fs.writeFile(newPath, data, function (err) {
            if (err) {
                res.json({status: 'error', message: err});
            } else {
                res.json({status: 'ok'});
            }
        });
    });
};