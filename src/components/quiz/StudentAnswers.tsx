
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { calculateScore } from '@/utils/quizCalculations';

interface StudentAnswersProps {
  students: { name: string; answers: number[] }[];
  correctAnswers: number[];
  numQuestions: number;
  onUpdateStudentAnswer: (studentIndex: number, questionIndex: number, value: number) => void;
  onUpdateStudentName: (studentIndex: number, name: string) => void;
  onRemoveStudent: (studentIndex: number) => void;
}

export const StudentAnswers: React.FC<StudentAnswersProps> = ({
  students,
  correctAnswers,
  numQuestions,
  onUpdateStudentAnswer,
  onUpdateStudentName,
  onRemoveStudent
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Student Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student, studentIndex) => (
            <div key={studentIndex} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Input
                    value={student.name}
                    onChange={(e) => onUpdateStudentName(studentIndex, e.target.value)}
                    className="w-40 bg-white"
                    placeholder="Student name"
                  />
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    Score: {calculateScore(student.answers, correctAnswers)}/{numQuestions} 
                    ({Math.round((calculateScore(student.answers, correctAnswers) / numQuestions) * 100)}%)
                  </Badge>
                </div>
                {students.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveStudent(studentIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-25 gap-2">
                {student.answers.slice(0, numQuestions).map((answer, questionIndex) => {
                  const isCorrect = answer === correctAnswers[questionIndex];
                  return (
                    <div key={questionIndex} className="text-center">
                      <label className="text-xs text-gray-600 block mb-1">
                        Q{questionIndex + 1}
                      </label>
                      <select
                        value={answer}
                        onChange={(e) => onUpdateStudentAnswer(studentIndex, questionIndex, parseInt(e.target.value))}
                        className={`w-full px-2 py-1 border rounded text-center focus:ring-2 focus:border-transparent ${
                          isCorrect 
                            ? 'bg-green-100 border-green-300 text-green-800 focus:ring-green-500' 
                            : 'bg-red-100 border-red-300 text-red-800 focus:ring-red-500'
                        }`}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
