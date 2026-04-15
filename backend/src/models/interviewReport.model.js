const mongoose = require("mongoose")




/**
 * -job description schema:string
 * -resume text:string
 * -self description:string
 * 
 * -MatchScore:number
 * }
 * 
 * -Technocal questons :[
 * {
 *      question :"",
 *      intention :"",
 *      ans:""
 * }]
 * -Behavioral question :[{
 *    question :"",
 *      intention :"",
 *      ans:""}]
 * 
 * 
 * -skill gap:[{
 *      skill:"",
 *      severity:"",
 *      type:string
 *      enum:["high","medium","low"]
 * 
 * }]
 * -preparation plan:[{
 *      day:number,
 *      focus:string,
 *      tasks:string,
 *         
 * }]
 * 
 * 
 */


const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
    },{
        _id:false
    
})  


const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
    },{
        _id:false
    
})   


const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["high","medium","low"],   
        required:[true,"Severity is required"]
    },
   
    },{
        _id:false
    
}) 

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:{
        type:[String],
        required:[true,"Tasks are required"]
    }
    },{
        _id:false
    
})  





const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job description is required"]
    },
    resumeText:{
        type:String,
        
    },
    selfDescription:{
        type:String,
       
    },
    matchScore:{
        type:Number,
       min:0,
       max:100
    },
    technicalQuestionSchema:[technicalQuestionSchema],
    behavioralQuestionSchema:[behavioralQuestionSchema],
    skillGapSchema:[skillGapSchema],
    preparationPlanSchema:[preparationPlanSchema],
    user:{

    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
    }   
},{
    timestamps:true 
})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)

module.exports = interviewReportModel   