const pdfparse= require("pdf-parse")
const generateInterviewReport= require("../sevices/ai.service")
const interviewReportModel=require("../models/interviewReport.model")

async function generateInterviewreportController(req,res){
      

      const resumeContent= await (new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
      const{selfDescription,jobDescription}=req.body


      const interviewReportByAi= await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
      })    

  
      const interviewReport= await interviewReportModel.create({
       user:req.user.id,
       resumeText:resumeContent.text,
       selfDescription,
       jobDescription,
       matchScore: interviewReportByAi.matchScore,
       technicalQuestionSchema: interviewReportByAi.technicalQuestions,
       behavioralQuestionSchema: interviewReportByAi.behavioralQuestions,
       skillGapSchema: interviewReportByAi.skillGap,
       preparationPlanSchema: interviewReportByAi.preparationPlan
      })

      res.status(200).json({
        message:"Interview report generated successfully",
        interviewReport
      })

}








module.exports={generateInterviewreportController}