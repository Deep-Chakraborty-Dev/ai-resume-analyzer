import { type FormEvent, useState } from 'react';
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { extractFeedbackText, generateUUID, parseFeedback } from '~/lib/utils';
import { prepareInstructions } from '../../constants';

const Upload = () => {
  const { fs, ai, kv, puterReady } = usePuterStore();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);

      // Validate inputs
      if (!companyName.trim()) {
        setStatusText('Please enter a company name');
        setIsProcessing(false);
        return;
      }
      if (!jobTitle.trim()) {
        setStatusText('Please enter a job title');
        setIsProcessing(false);
        return;
      }
      if (!jobDescription.trim()) {
        setStatusText('Please enter a job description');
        setIsProcessing(false);
        return;
      }

      setStatusText('Uploading PDF...');
      console.log('Uploading file:', file.name);

      const uploadedFile = await fs.upload([file]);
      console.log('Upload result:', uploadedFile);

      if (!uploadedFile) {
        setStatusText('Failed to upload PDF - Puter FS may not be initialized');
        setIsProcessing(false);
        return;
      }

      setStatusText('Converting PDF to image...');
      const imageFile = await convertPdfToImage(file);
      console.log('Image conversion result:', imageFile);

      if (!imageFile.file) {
        setStatusText(imageFile.error || 'Failed to convert PDF');
        setIsProcessing(false);
        return;
      }

      setStatusText('Uploading image...');
      const uploadedImage = await fs.upload([imageFile.file]);
      console.log('Image upload result:', uploadedImage);

      if (!uploadedImage) {
        setStatusText('Failed to upload image - Puter FS may not be initialized');
        setIsProcessing(false);
        return;
      }

      setStatusText('Preparing data...');
      const uuid = generateUUID();

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: {},
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      console.log('Data saved to KV store');

      setStatusText('Analyzing resume with AI...');

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({
          jobTitle,
          jobDescription,
        }),
      );
      console.log('AI feedback:', feedback);

      if (!feedback) {
        setStatusText('Failed to analyze resume - AI may not be initialized');
        setIsProcessing(false);
        return;
      }

      const feedbackText = extractFeedbackText(feedback);

      if (!feedbackText) {
        setStatusText('Analysis completed but no feedback was returned');
        data.feedback = parseFeedback('{}');
      } else {
        data.feedback = parseFeedback(feedbackText);
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      console.log('Final data saved:', data);

      setStatusText('Analysis complete! Redirecting...');
      setTimeout(() => {
        navigate(`/resume/${uuid}`);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error during analysis:', error);
      setStatusText(`Error: ${errorMessage}`);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!puterReady) {
      setStatusText('Waiting for Puter runtime to initialize...');
      return;
    }

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const companyName = (formData.get('company-name') as string) || '';
    const jobTitle = (formData.get('job-title') as string) || '';
    const jobDescription = (formData.get('job-description') as string) || '';

    if (!file) {
      alert('Please upload a PDF first');
      return;
    }

    if (!companyName.trim() || !jobTitle.trim() || !jobDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }

    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>

              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score</h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>

                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>

                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>

                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>

                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
