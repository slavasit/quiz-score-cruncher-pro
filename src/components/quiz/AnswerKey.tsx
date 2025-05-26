
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnswerKeyProps {
  correctAnswers: number[];
  numQuestions: number;
  onUpdateCorrectAnswer: (questionIndex: number, value: number) => void;
}

export const AnswerKey: React.FC<AnswerKeyProps> = ({
  correctAnswers,
  numQuestions,
  onUpdateCorrectAnswer
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Answer Key (Correct Answers)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-25 gap-2">
          {correctAnswers.slice(0, numQuestions).map((answer, index) => (
            <div key={index} className="text-center">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Q{index + 1}
              </label>
              <select
                value={answer}
                onChange={(e) => onUpdateCorrectAnswer(index, parseInt(e.target.value))}
                className="w-full px-2 py-1 border rounded text-center bg-blue-50 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
