const pdfparse= require("pdf-parse")
const {generateInterviewReport,generateResumePdf}= require("../sevices/ai.service")
const interviewReportModel=require("../models/interviewReport.model")





/**
 * 
 *  @description generate new interview report on the basis of user self descriptrion, resum pdf and job Description
 *  @access private
 *  @route POST /api/interview/
 *  @param {File} resume - user resume pdf
 *  @param {String} selfDescription - user self description
 *  @param {String} jobDescription - job description
 *  @returns {Object} - interview report
 *  
 */
async function generateInterviewreportController(req,res){
      

      let resumeContent = { text: "" };
      if (req.file) {
          resumeContent = await (new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
      }
      const{selfDescription,jobDescription}=req.body


      const interviewReportByAi= await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
      })    

  
      const interviewReport= await interviewReportModel.create({
       user:req.user.id,
       resumeText: resumeContent ? resumeContent.text : "",
       selfDescription,
       jobDescription,
       title: interviewReportByAi.title || "Interview Strategy Plan",
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


/**
 * 
 * @description Controller to get interview report by interview id 
 * @access private
 * @route GET /api/interview/:interviewId
 * @param {String} interviewId - interview id
 * @returns {Object} - interview report
 * 
 */

async function getInterviewreportController(req,res){
      

    const { interviewId}= req.params

      const interviewReport= await interviewReportModel.findOne({_id:interviewId, user:req.user.id})

      if(!interviewReport){
        return res.status(404).json({
          message:"Interview report not found",
        })
      }

      res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
      })

} 




/**
 * @description Controller to get all interview reports of logged in user 
 */


async function getAllInterviewreportController(req,res){
      

      const interviewReport= await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v  -technicalQuestions -behavioralQuestions -skillGap -preparationPlan")

      if(!interviewReport){
        return res.status(404).json({
          message:"Interview report not found",
        })
      }

      res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
      })

}   

/**
 * @description Controller to delete an interview report by interview id 
 */
async function deleteInterviewreportController(req, res) {
      const { interviewId } = req.params;
      const interviewReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id });

      if(!interviewReport) {
        return res.status(404).json({
          message: "Interview report not found or you don't have permission to delete it",
        });
      }

      res.status(200).json({
        message: "Interview report deleted successfully",
      });
}



//controller to generate resume pdf

async function generateResumePdfController(req,res){
      const {interviewId}=req.params
      const interviewReport= await interviewReportModel.findOne({_id:interviewId, user:req.user.id})
      if(!interviewReport){
        return res.status(404).json({
          message:"Interview report not found",
        })
      }


      const {resumeText,jobDescription,selfDescription }= interviewReport
      const pdfBuffer= await generateResumePdf({resume:resumeText,jobDescription,selfDescription})

      res.setHeader("Content-Type","application/pdf")
      res.setHeader("Content-Disposition","attachment; filename=resume.pdf")
      res.send(pdfBuffer)

}


module.exports={generateInterviewreportController,getInterviewreportController,getAllInterviewreportController,deleteInterviewreportController,generateResumePdfController}