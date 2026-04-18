const {  GoogleGenAI } = require("@google/genai");
const {z}= require("zod" )
const {zodToJsonSchema}= require("zod-to-json-schema");
const { $ZodCheckLengthEquals } = require("zod/v4/core");
const puppeteer = require("puppeteer");



const ai =new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema= z.object({

    matchScore:z.number().describe("a score between 0 to 100 indicating how well the candidate's profile matches with the job description"),


    technicalQuestions:z.array(
        z.object({
            question:z.string().describe("the technical questions that can be asked in the interview"),   
            intention:z.string().describe("the intention of interviewer behind the question"),
            answer:z.string().describe("How to answer this questions, what are the points to cover, what to avoid,what approach to take, what follow-up questions might be asked")
        })
    ).describe("technical questions that can be asked in the interview along with their intention and how to answeer them"),
    
    
    
    behavioralQuestions:z.array(
        z.object({
            question:z.string().describe("the behavioral questions that can be asked in the interview"),   
            intention:z.string().describe("the intention of interviewer behind the question"),
            answer:z.string().describe("How to answer this questions, what are the points to cover, what to avoid,what approach to take, what follow-up questions might be asked")
        })
    ).describe("behavioral questions that can be asked in the interview along with their intention and how to answeer them"),
    
    
    skillGap:z.array(
        z.object({
            skill:z.string().describe("the skills that are missing in the resume"),
            severity:z.enum(["high","medium","low"]).describe("the severity of the skill gap"),

        })
    ).describe("list of skill gaps in the candidate's profile along with their severity  "),
    
    
    preparationPlan:z.array(
        z.object({
            day:z.number().describe("the day in the preparation plan, starting from day 1 to the day untill the preparation ends"),
            focus:z.string().describe("the focus of the preparation plans, e.g data structure, system design"),
            tasks:z.array(z.string()).describe("list of the tasks to be done in the preparation plans, assigning 2 to 3 tasks a day depending on hardness and vastness")
        })
    ).describe("list of the preparation plan for the candidate to prepare for the intervieew effectively")  ,
    title:z.string().describe("the title of the job for which the interview report is generated ")  
})

async function generateInterviewReport({resume,selfDescription,jobDescription}){

    const prompt=`Generate an interview report for the candidate based on the following information:
    
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    You MUST return the output explicitly and strictly as a raw JSON object. Do not hallucinate any keys. The JSON object must strictly match the following structure with these exact keys:
    {
      "matchScore": 85,
      "technicalQuestions": [
        // Generate at least 5 distinct technical questions covering the core required tech stack.
        {
          "question": "Example technical question?",
          "intention": "What the interviewer wants to know.",
          "answer": "How the candidate should answer."
        }
      ],
      "behavioralQuestions": [
        // Generate exactly 5 distinct behavioral questions targeting leadership, teamwork, and problem-solving.
        {
          "question": "Example behavioral question?",
          "intention": "What the interviewer wants to know.",
          "answer": "How the candidate should answer."
        }
      ],
      "skillGap": [
        // Identify and list ALL missing skills based on the gap between the Resume and Job Description.
        // Be highly specific and prominent with the skill names (e.g., "Message Queues (Kafka/RabbitMQ)", "Advanced DevOps (CI/CD workflows)", "Distributed Systems experience").
        {
          "skill": "Specific, prominent technical skill missing",
          "severity": "high" // must be high, medium, or low
        }
      ],
      "preparationPlan": [
        // Create a comprehensive, structured day-by-day preparation plan addressing ALL identified skill gaps.
        // DO NOT stop at Day 3. Continue generating day objects (e.g. Day 1 out to Day 14 or more) until all gaps are covered.
        // For each day, assign exactly 2 to 3 distinct, highly actionable tasks. Balance the hardness and vastness of the topics daily.
        // Mix theoretical reading, hands-on coding, and practical review.
        {
          "day": 1,
          "focus": "Focus area for the day (e.g. Advanced Database Optimization)",
          "tasks": [
            "Theory: Deep dive into MongoDB Aggregation pipelines and indexing strategies.",
            "Practical: Build a small API endpoint that utilizes a complex $lookup and compound index.",
            "Review: Complete 2 Leetcode problems focused on data filtering."
          ]
        }
      ]
    }
    `


const response=await ai.models.generateContent({




    model:"gemini-3-flash-preview",
    contents:prompt,
    config:{

        responseMimeType:"application/json"

    }
})


return JSON.parse(response.text)


}


async function generatePdfFromHtml(htmlContent) {
  const browser= await puppeteer.launch()
  const page= await browser.newPage()
  await page.setContent(htmlContent,{
    waitUntil:"networkidle0"
  })


  const pdfBuffer= await page.pdf({format:"A4",margin:{
    top:"1cm",
    bottom:"1cm",
    left:"1cm",
    right:"1cm"
  }

  })

  await browser.close()
  return pdfBuffer
  
}

async function generateResumePdf({resume, selfDescription,jobDescription}){
  const resumepdfScheme= z.object({
    html:z.string().describe("the html code of the resume which can be converted to pdf using any library like puppeteer or html-pdf   ")
  })


  const prompt=`Generate resume for the candidate based on the following information:
    
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
   
    the response should be a json object with a single field "html" which contains the html code of the resume, which can be converted to pdf using any library like puppeteer or html-pdf   
    the resume should be tailored for the given job  description and
    the content of the resume should be not sound like it sgenerated by ai and close as possible to be reaal human written resume, you can highlight the content using some colors or different font style but the over design d=should be aimple and professional
    thr content should be ats friendly, i.e it should be easily parsable by ats systems, resume should be 1 to 2 pages long, focus on quality rather than quantity and make sure to include all the relevant information that can incrrease candidate's chane of getting an interview call for the given job description
    
    `


const response=await ai.models.generateContent({




    model:"gemini-3-flash-preview",
    contents:prompt,
    config:{

        responseMimeType:"application/json",
        responseSchema:zodToJsonSchema(resumepdfScheme),

    }
})


const jsonContent = JSON.parse(response.text)
const pdfBuffer= await generatePdfFromHtml(jsonContent.html)

return pdfBuffer


}

module.exports={generateInterviewReport,generateResumePdf}