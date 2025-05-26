
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestionStatisticsProps {
  questionStats: {
    question: number;
    correctCount: number;
    totalStudents: number;
    percentage: number;
  }[];
  numQuestions: number;
}

export const QuestionStatistics: React.FC<QuestionStatisticsProps> = ({
  questionStats,
  numQuestions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionStats.slice(0, numQuestions).map((stat) => (
            <div key={stat.question} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Question {stat.question}</span>
                <Badge 
                  variant={stat.percentage >= 70 ? "default" : stat.percentage >= 50 ? "secondary" : "destructive"}
                >
                  {stat.percentage}%
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {stat.correctCount} of {stat.totalStudents} students correct
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stat.percentage >= 70 
                      ? 'bg-green-500' 
                      : stat.percentage >= 50 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
