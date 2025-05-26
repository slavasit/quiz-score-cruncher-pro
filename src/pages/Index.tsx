
import React, { useState } from 'react';
import { SummaryCards } from '@/components/quiz/SummaryCards';
import { QuizConfiguration } from '@/components/quiz/QuizConfiguration';
import { AnswerKey } from '@/components/quiz/AnswerKey';
import { StudentAnswers } from '@/components/quiz/StudentAnswers';
import { QuestionStatistics } from '@/components/quiz/QuestionStatistics';
import { calculateScore, getQuestionStats } from '@/utils/quizCalculations';
import { exportToExcel } from '@/utils/excelExport';

const Index = () => {
  const [numQuestions, setNumQuestions] = useState(25);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(Array(25).fill(1));
  const [students, setStudents] = useState<{ name: string; answers: number[] }[]>([
    { name: "Student 1", answers: Array(25).fill(1) }
  ]);

  // Update correct answer
  const updateCorrectAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...correctAnswers];
    newAnswers[questionIndex] = value;
    setCorrectAnswers(newAnswers);
  };

  // Update student answer
  const updateStudentAnswer = (studentIndex: number, questionIndex: number, value: number) => {
    const newStudents = [...students];
    newStudents[studentIndex].answers[questionIndex] = value;
    setStudents(newStudents);
  };

  // Update student name
  const updateStudentName = (studentIndex: number, name: string) => {
    const newStudents = [...students];
    newStudents[studentIndex].name = name;
    setStudents(newStudents);
  };

  // Add new student
  const addStudent = () => {
    const newStudent = {
      name: `Student ${students.length + 1}`,
      answers: Array(numQuestions).fill(1)
    };
    setStudents([...students, newStudent]);
  };

  // Remove student
  const removeStudent = (studentIndex: number) => {
    if (students.length > 1) {
      const newStudents = students.filter((_, index) => index !== studentIndex);
      setStudents(newStudents);
    }
  };

  // Update number of questions
  const updateNumQuestions = (newNum: number) => {
    if (newNum >= 1 && newNum <= 50) {
      setNumQuestions(newNum);
      
      // Adjust correct answers array
      const newCorrectAnswers = [...correctAnswers];
      if (newNum > correctAnswers.length) {
        // Add new questions with default answer 1
        for (let i = correctAnswers.length; i < newNum; i++) {
          newCorrectAnswers.push(1);
        }
      } else {
        // Trim to new length
        newCorrectAnswers.length = newNum;
      }
      setCorrectAnswers(newCorrectAnswers);

      // Adjust student answers
      const newStudents = students.map(student => {
        const newAnswers = [...student.answers];
        if (newNum > student.answers.length) {
          // Add new answers with default 1
          for (let i = student.answers.length; i < newNum; i++) {
            newAnswers.push(1);
          }
        } else {
          // Trim to new length
          newAnswers.length = newNum;
        }
        return { ...student, answers: newAnswers };
      });
      setStudents(newStudents);
    }
  };

  // Handle Excel export
  const handleExportToExcel = () => {
    exportToExcel(students, correctAnswers, numQuestions, averageScore);
  };

  const questionStats = getQuestionStats(students, correctAnswers);
  const averageScore = students.length > 0 
    ? Math.round(students.reduce((sum, student) => sum + calculateScore(student.answers, correctAnswers), 0) / students.length * 100) / 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Quiz Grading Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Automatically grade multiple-choice quizzes with real-time scoring and detailed analytics
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards 
          numQuestions={numQuestions}
          studentsCount={students.length}
          averageScore={averageScore}
        />

        {/* Configuration */}
        <QuizConfiguration
          numQuestions={numQuestions}
          onUpdateNumQuestions={updateNumQuestions}
          onExportToExcel={handleExportToExcel}
          onAddStudent={addStudent}
        />

        {/* Answer Key */}
        <AnswerKey
          correctAnswers={correctAnswers}
          numQuestions={numQuestions}
          onUpdateCorrectAnswer={updateCorrectAnswer}
        />

        {/* Student Answers */}
        <StudentAnswers
          students={students}
          correctAnswers={correctAnswers}
          numQuestions={numQuestions}
          onUpdateStudentAnswer={updateStudentAnswer}
          onUpdateStudentName={updateStudentName}
          onRemoveStudent={removeStudent}
        />

        {/* Question Statistics */}
        <QuestionStatistics
          questionStats={questionStats}
          numQuestions={numQuestions}
        />
      </div>
    </div>
  );
};

export default Index;
