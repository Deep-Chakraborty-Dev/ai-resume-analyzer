export const resumes: Resume[] = [
  {
    id: '1',
    companyName: 'Google',
    jobTitle: 'Frontend Developer',
    imagePath: '/images/resume_01.png',
    resumePath: '/resumes/resume-1.pdf',
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: '2',
    companyName: 'Microsoft',
    jobTitle: 'Cloud Engineer',
    imagePath: '/images/resume_02.png',
    resumePath: '/resumes/resume-2.pdf',
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: '3',
    companyName: 'Apple',
    jobTitle: 'iOS Developer',
    imagePath: '/images/resume_03.png',
    resumePath: '/resumes/resume-3.pdf',
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `{
  "overallScore": 0,
  "ATS": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Good ATS keyword usage" },
      { "type": "improve", "tip": "Use more relevant skills from the job description" }
    ]
  },
  "toneAndStyle": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Clear tone", "explanation": "Your resume has a professional tone." },
      { "type": "improve", "tip": "Avoid repetition", "explanation": "Some phrases are repeated across sections." }
    ]
  },
  "content": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Relevant experience", "explanation": "Your experience matches the role well." },
      { "type": "improve", "tip": "Clarify achievements", "explanation": "Use bullet points to quantify impact." }
    ]
  },
  "structure": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Organized layout", "explanation": "Sections are easy to scan." },
      { "type": "improve", "tip": "Improve section headers", "explanation": "Use consistent header formatting." }
    ]
  },
  "skills": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Relevant skills", "explanation": "Your resume lists relevant technical skills." },
      { "type": "improve", "tip": "Add certifications", "explanation": "Include certifications related to the job." }
    ]
  }
}`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Provide the feedback as valid JSON only, using these keys: overallScore, ATS, toneAndStyle, content, structure, skills.
  Match the structure in this example:
  ${AIResponseFormat}
  Return only the JSON object, without any surrounding explanation, code fences, or comments.`;
