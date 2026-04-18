import axios from "axios"
const api = axios.create({
    baseURL: "http://localhost:3000/api/interview",
    withCredentials: true,
})
export const generateInterviewReportApi = async ({ resume, selfDescription, jobDescription }) => {
    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)
    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
};

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)
    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data

}



export const generateInterviewReportId = async ({ interviewId }) => {
    const response= await api.get(`/${interviewId}`)

    return response.data
}



export const getAllInterviewReports = async () => {

    const response = await api.get("/")
    return response.data
}

export const deleteInterviewReport = async (interviewId) => {
    const response = await api.delete(`/${interviewId}`)
    return response.data
}


export const generateResumePdf=async ({interviewId})=>{
    const response= await api.post(`/resume/pdf/${interviewId}`,null,{
        responseType:"blob"
    })
    return response.data
}