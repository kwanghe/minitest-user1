import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Survey } from '../types';

interface CodeInputProps {
  onSurveyFetched: (survey: Survey) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onSurveyFetched }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://gn50.aixstudio.kr/minitest/minitest_surveyTokens.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `token=${encodeURIComponent(code)}`,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.survey) {
        localStorage.setItem('cachedToken', code);
        onSurveyFetched(data.survey);
      }
    } catch (err) {
      setError('An error occurred while fetching the survey.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      <h1 className="text-3xl font-bold text-white mb-8">미니테스트</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            className="w-full px-4 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-200 text-center">{error}</p>}
    </div>
  );
};