var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var guideSchame=new Schema({
    "guideId":String ,
    "guideSN":String,
	"guideName":String,
	"guiderId":String,
	"guiderName":String,
	"guideSSID":String,
	"guideCount":String,
	"guideAddress":String,
	"status":String,
	"guideInfo":String,
	"guideImg":String,
	"notice":[
		{
			"title":String,
			"content":String,
			"time":String
		}
	],
	"tourists":[
		{
			"touristId":String,
			"signInCount":[
				{
					"tag":String,
					"isSign":String
				}
			]
		}
	]
});

module.exports=mongoose.model('guide',guideSchame)