import React from 'react';
import { Question } from '../types';
import { ChevronRight } from 'lucide-react';

interface QuestionPageProps {
  question: Question;
  surveyId: number;
  onNextQuestion: () => void;
  currentRound: number;
  totalQuestions: number;
  selectedOption: string | undefined;
  onSelection: (questionId: number, selection: string) => void;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  surveyId,
  onNextQuestion,
  currentRound,
  totalQuestions,
  selectedOption,
  onSelection,
}) => {
  const isTwoOptions = question.options.length === 2;
  const hasImages = question.options.some(opt => opt.option_image_path);
  const imageCount = question.options.filter(opt => opt.option_image_path).length;
  const singleImageWithTwoOptions = isTwoOptions && imageCount === 1;
  const imageOption = question.options.find(opt => opt.option_image_path);

  const handleSubmit = async () => {
    if (selectedOption) {
      try {
        const token = localStorage.getItem('cachedToken');
        const response = await fetch('https://gn50.aixstudio.kr/minitest/minitest_answer.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            survey_id: surveyId,
            question_id: question.question_id,
            answer_text: selectedOption,
            current_round: currentRound,
            weight_adjustment: {},
          }),
        });
        const data = await response.json();
        if (data.status === 'success') {
          onNextQuestion();
        } else {
          console.error('Failed to submit answer:', data.error);
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  };

  const renderOptions = () => {
    if (!question.options || question.options.length === 0) {
      return <p className="text-white">No options available for this question.</p>;
    }

    // For two options with single image
    if (singleImageWithTwoOptions && imageOption) {
      return (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="w-full max-w-2xl aspect-video mb-8 overflow-hidden rounded-lg">
            <img
              src={imageOption.option_image_path!}
              alt={imageOption.option_text}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
          </div>
          <div className="w-full max-w-2xl grid grid-cols-2 gap-6">
            {question.options.map((option) => (
              <button
                key={option.option_order}
                onClick={() => onSelection(question.question_id, option.option_text)}
                className={`w-full p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedOption === option.option_text
                    ? 'ring-4 ring-green-400 bg-white text-gray-800'
                    : 'bg-white/90 text-gray-800 hover:bg-white'
                }`}
              >
                <p className="text-lg font-medium text-center">{option.option_text}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // For multiple images
    if (hasImages && !singleImageWithTwoOptions) {
      return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {question.options.map((option) => (
            <button
              key={option.option_order}
              onClick={() => onSelection(question.question_id, option.option_text)}
              className={`w-full p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                selectedOption === option.option_text
                  ? 'ring-4 ring-green-400 bg-white text-gray-800'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
            >
              {option.option_image_path && (
                <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-lg">
                  <img
                    src={option.option_image_path}
                    alt={option.option_text}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}
              <p className="text-lg font-medium text-center">{option.option_text}</p>
            </button>
          ))}
        </div>
      );
    }

    // For text-only questions with two options
    if (isTwoOptions) {
      return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {question.options.map((option) => (
            <button
              key={option.option_order}
              onClick={() => onSelection(question.question_id, option.option_text)}
              className={`flex-1 p-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                selectedOption === option.option_text
                  ? 'ring-4 ring-green-400 bg-white text-gray-800'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
            >
              <p className="text-xl font-medium text-center">{option.option_text}</p>
            </button>
          ))}
        </div>
      );
    }

    // For multiple text options
    return (
      <div className="w-full max-w-4xl space-y-4">
        {question.options.map((option) => (
          <button
            key={option.option_order}
            onClick={() => onSelection(question.question_id, option.option_text)}
            className={`w-full p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              selectedOption === option.option_text
                ? 'ring-4 ring-green-400 bg-white text-gray-800'
                : 'bg-white/90 text-gray-800 hover:bg-white'
            }`}
          >
            <p className="text-lg font-medium text-center">{option.option_text}</p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-blue-500 to-purple-600 text-white">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-8 text-center w-full">
          <div className="w-full h-2 bg-white/30 rounded-full mb-4">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${(currentRound / totalQuestions) * 100}%` }}
            />
          </div>
          <p className="text-sm font-medium">
            Question {currentRound} of {totalQuestions}
          </p>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{question.question_text}</h2>
        
        {renderOptions()}
        
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`mt-8 bg-green-500 text-white font-bold py-3 px-6 rounded-full text-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 ${
            !selectedOption && 'opacity-50 cursor-not-allowed'
          }`}
        >
          다음
          <ChevronRight size={24} className="ml-2" />
        </button>
      </div>
    </div>
  );
};