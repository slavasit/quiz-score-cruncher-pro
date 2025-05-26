
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Target, BarChart3 } from 'lucide-react';

interface SummaryCardsProps {
  numQuestions: number;
  studentsCount: number;
  averageScore: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  numQuestions,
  studentsCount,
  averageScore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <p className="text-blue-100">Questions</p>
              <p className="text-2xl font-bold">{numQuestions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <div>
              <p className="text-green-100">Students</p>
              <p className="text-2xl font-bold">{studentsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <p className="text-purple-100">Avg Score</p>
              <p className="text-2xl font-bold">{averageScore}/{numQuestions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <p className="text-orange-100">Avg %</p>
              <p className="text-2xl font-bold">{Math.round((averageScore / numQuestions) * 100)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
