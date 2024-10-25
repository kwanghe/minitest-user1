import React from 'react';
import { PartyPopper, Home } from 'lucide-react';

interface CompletionPageProps {
  onRestart: () => void;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <PartyPopper size={64} className="text-yellow-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          설문이 완료되었습니다!
        </h2>
        
        <p className="text-gray-600 mb-8">
          참여해 주셔서 감사합니다. 귀하의 응답이 성공적으로 제출되었습니다.
        </p>
        
        <button
          onClick={onRestart}
          className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <Home size={20} className="mr-2" />
          새로운 설문 시작하기
        </button>
      </div>
    </div>
  );
};