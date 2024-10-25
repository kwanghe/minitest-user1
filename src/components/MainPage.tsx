import React from 'react';
import { Survey } from '../types';
import { Play } from 'lucide-react';

interface MainPageProps {
  survey: Survey;
  onStartSurvey: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({ survey, onStartSurvey }) => {
  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-purple-600 to-indigo-800 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">{survey.title}</h1>
      <p className="text-lg mb-8 text-center">{survey.description}</p>
      <button
        onClick={onStartSurvey}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <Play size={24} className="mr-2" />
        시작하기
      </button>
    </div>
  );
};