var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchame=new Schema({
    "userId":String ,
    "status":String,
    "userImg":String,
	"userName":String,
	"password":String,
	"email":String,
	"userPhone":String,
	"company":String,
	"job":String,
	"introduce":String,
	"openId":String,
	"guideList":[
	{
		"guideId":String,
		"guideSN":String
	}		
	],

});

module.exports=mongoose.model('user',userSchame)