import { useEffect } from 'react';
import type { Route } from './+types/home';
import Navbar from '~/components/Navbar';
import ResumeCard from '~/components/ResumeCard';
import { usePuterStore } from '~/lib/puter';
import { type NavigateFunction, useNavigate } from 'react-router';
import { resumes } from '../../constants';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resumer' },
    { name: 'description', content: 'Feedback for your resume' },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate: NavigateFunction = useNavigate();

  return (
    <main className="bg-[url('/images/bg-main.svg')]">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings</h1>
          <h2>Make Your Resume Industry Ready</h2>
        </div>
      </section>

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
