var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var guideSchame=new Schema({
    "courseId":String ,
    "courseSN":String,
	"courseName":String,
	"teacherId":String,
	"teacherName":String,
	"courseSSID":String,
	"classCount":String,
	"HContent":String,
	"Htime":String,
	"classAddress":String,
	"status":String,
	"HTitle":String,
	"courseInfo":String,
	"courseImg":String,
	"notice":[
		{
			"title":String,
			"content":String,
			"time":String
		}
	],
	"students":[
		{
			"studentId":String,
			"studentName":String,
			"studentImg":String,
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