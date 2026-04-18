const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
const interviewRouter = express.Router();



/**
 * @route POST  /api/interview/
 * @description generate new interview report on the basis of user self descriptrion, resum pdf and job Description
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewreportController)


/**
 * GET /api/interview/:interviewId
 * @description get all interview reports by interview id
 * @access private
 */
interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getInterviewreportController)

/**
 * GET /api/interview/
 * @description get all interview reports for the logged in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewreportController)





/**
 * DELETE /api/interview/:interviewId
 * @description Delete an interview report by ID
 * @access private
 */
interviewRouter.delete("/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewreportController)

// get - /api/interview/:interviewId/resume
// @description get resume pdf
// @access private

interviewRouter.post("/resume/pdf/:interviewId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter;
