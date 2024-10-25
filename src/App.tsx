import React, { useState, useEffect } from 'react';
import { CodeInput } from './components/CodeInput';
import { MainPage } from './components/MainPage';
import { QuestionPage } from './components/QuestionPage';
import { CompletionPage } from './components/CompletionPage';
import { Survey, Question } from './types';

function App() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});

  useEffect(() => {
    const cachedSurvey = localStorage.getItem('cachedSurvey');
    const cachedSelections = localStorage.getItem('userSelections');
    const cachedIndex = localStorage.getItem('currentQuestionIndex');
    const cachedCompleted = localStorage.getItem('isCompleted');
    const currentToken = localStorage.getItem('cachedToken');

    if (cachedSurvey && currentToken) {
      setSurvey(JSON.parse(cachedSurvey));
      if (cachedSelections) {
        setUserSelections(JSON.parse(cachedSelections));
      }
      if (cachedIndex) {
        setCurrentQuestionIndex(Number(cachedIndex));
      }
      if (cachedCompleted) {
        setIsCompleted(JSON.parse(cachedCompleted));
      }
    }
  }, []);

  const handleSurveyFetched = (newSurvey: Survey) => {
    setSurvey(newSurvey);
    localStorage.setItem('cachedSurvey', JSON.stringify(newSurvey));
  };

  const handleStartSurvey = async () => {
    if (survey) {
      try {
        const response = await fetch('https://gn50.aixstudio.kr/minitest/minitest_detail_list.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ survey_id: survey.survey_id }),
        });
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.questions)) {
          const sortedQuestions = data.questions.sort((a: Question, b: Question) => a.question_number - b.question_number);
          setQuestions(sortedQuestions);
          setCurrentQuestionIndex(0);
          setIsCompleted(false);
          setError(null);
          // Clear previous selections when starting a new survey
          setUserSelections({});
          localStorage.removeItem('userSelections');
          localStorage.removeItem('currentQuestionIndex');
          localStorage.removeItem('isCompleted');
        } else {
          setError('Failed to fetch questions. Please try again.');
          console.error('Failed to fetch questions:', data.error || 'Unexpected response format');
        }
      } catch (error) {
        setError('An error occurred while fetching questions. Please try again.');
        console.error('Error fetching questions:', error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      localStorage.setItem('currentQuestionIndex', String(nextIndex));
    } else {
      setIsCompleted(true);
      localStorage.setItem('isCompleted', 'true');
    }
  };

  const handleRestart = () => {
    setSurvey(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setUserSelections({});
    localStorage.removeItem('cachedSurvey');
    localStorage.removeItem('cachedToken');
    localStorage.removeItem('userSelections');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('isCompleted');
  };

  const handleSelection = (questionId: number, selection: string) => {
    const newSelections = { ...userSelections, [questionId]: selection };
    setUserSelections(newSelections);
    localStorage.setItem('userSelections', JSON.stringify(newSelections));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!survey ? (
        <CodeInput onSurveyFetched={handleSurveyFetched} />
      ) : questions.length === 0 ? (
        <MainPage survey={survey} onStartSurvey={handleStartSurvey} />
      ) : !isCompleted ? (
        <QuestionPage
          question={questions[currentQuestionIndex]}
          surveyId={survey.survey_id}
          onNextQuestion={handleNextQuestion}
          currentRound={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedOption={userSelections[questions[currentQuestionIndex].question_id]}
          onSelection={handleSelection}
        />
      ) : (
        <CompletionPage onRestart={handleRestart} />
      )}
      {error && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;