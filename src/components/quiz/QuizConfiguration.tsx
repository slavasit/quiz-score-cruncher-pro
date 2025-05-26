
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Download } from 'lucide-react';

interface QuizConfigurationProps {
  numQuestions: number;
  onUpdateNumQuestions: (newNum: number) => void;
  onExportToExcel: () => void;
  onAddStudent: () => void;
}

export const QuizConfiguration: React.FC<QuizConfigurationProps> = ({
  numQuestions,
  onUpdateNumQuestions,
  onExportToExcel,
  onAddStudent
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Quiz Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Number of Questions:</label>
          <Input
            type="number"
            min="1"
            max="50"
            value={numQuestions}
            onChange={(e) => onUpdateNumQuestions(parseInt(e.target.value) || 1)}
            className="w-20"
          />
          <div className="ml-auto flex space-x-2">
            <Button onClick={onExportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button onClick={onAddStudent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
