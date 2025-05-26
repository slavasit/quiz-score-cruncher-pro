import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Users, Target, BarChart3, Plus, Trash2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const Index = () => {
  const [numQuestions, setNumQuestions] = useState(25);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(Array(25).fill(1));
  const [students, setStudents] = useState<{ name: string; answers: number[] }[]>([
    { name: "Student 1", answers: Array(25).fill(1) }
  ]);

  // Calculate scores for each student
  const calculateScore = (studentAnswers: number[]) => {
    return studentAnswers.reduce((score, answer, index) => {
      return score + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);
  };

  // Calculate question statistics
  const getQuestionStats = () => {
    return correctAnswers.map((correctAnswer, questionIndex) => {
      const correctCount = students.reduce((count, student) => {
        return count + (student.answers[questionIndex] === correctAnswer ? 1 : 0);
      }, 0);
      return {
        question: questionIndex + 1,
        correctCount,
        totalStudents: students.length,
        percentage: students.length > 0 ? Math.round((correctCount / students.length) * 100) : 0
      };
    });
  };

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

  // Excel export function
  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Prepare data for the main sheet
    const mainData = [];
    
    // Add header row
    const headerRow = ['Student Name', 'Score', 'Percentage'];
    for (let i = 1; i <= numQuestions; i++) {
      headerRow.push(`Q${i}`);
    }
    mainData.push(headerRow);

    // Add correct answers row
    const correctRow = ['CORRECT ANSWERS', '', ''];
    correctAnswers.slice(0, numQuestions).forEach(answer => {
      correctRow.push(answer);
    });
    mainData.push(correctRow);

    // Add student data
    students.forEach(student => {
      const score = calculateScore(student.answers);
      const percentage = Math.round((score / numQuestions) * 100);
      const row = [student.name, score, `${percentage}%`];
      student.answers.slice(0, numQuestions).forEach(answer => {
        row.push(answer);
      });
      mainData.push(row);
    });

    // Create main worksheet
    const ws1 = XLSX.utils.aoa_to_sheet(mainData);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Student Name
      { wch: 10 }, // Score
      { wch: 12 }, // Percentage
    ];
    for (let i = 0; i < numQuestions; i++) {
      colWidths.push({ wch: 8 }); // Question columns
    }
    ws1['!cols'] = colWidths;

    // Add the main sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws1, 'Quiz Results');

    // Create statistics sheet
    const statsData = [];
    statsData.push(['Question', 'Correct Count', 'Total Students', 'Percentage', 'Correct Answer']);
    
    const questionStats = getQuestionStats();
    questionStats.slice(0, numQuestions).forEach((stat, index) => {
      statsData.push([
        `Question ${stat.question}`,
        stat.correctCount,
        stat.totalStudents,
        `${stat.percentage}%`,
        correctAnswers[index]
      ]);
    });

    // Add summary statistics
    statsData.push([]);
    statsData.push(['Summary Statistics']);
    statsData.push(['Total Questions', numQuestions]);
    statsData.push(['Total Students', students.length]);
    statsData.push(['Average Score', averageScore]);
    statsData.push(['Average Percentage', `${Math.round((averageScore / numQuestions) * 100)}%`]);

    const ws2 = XLSX.utils.aoa_to_sheet(statsData);
    ws2['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 }
    ];

    // Add the statistics sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws2, 'Statistics');

    // Generate filename with current date
    const date = new Date();
    const filename = `quiz_results_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, filename);
  };

  const questionStats = getQuestionStats();
  const averageScore = students.length > 0 
    ? Math.round(students.reduce((sum, student) => sum + calculateScore(student.answers), 0) / students.length * 100) / 100
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
                  <p className="text-2xl font-bold">{students.length}</p>
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

        {/* Configuration */}
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
                onChange={(e) => updateNumQuestions(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <div className="ml-auto flex space-x-2">
                <Button onClick={exportToExcel} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
                <Button onClick={addStudent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Key */}
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
                    onChange={(e) => updateCorrectAnswer(index, parseInt(e.target.value))}
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

        {/* Student Answers */}
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
                        onChange={(e) => updateStudentName(studentIndex, e.target.value)}
                        className="w-40 bg-white"
                        placeholder="Student name"
                      />
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        Score: {calculateScore(student.answers)}/{numQuestions} 
                        ({Math.round((calculateScore(student.answers) / numQuestions) * 100)}%)
                      </Badge>
                    </div>
                    {students.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStudent(studentIndex)}
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
                            onChange={(e) => updateStudentAnswer(studentIndex, questionIndex, parseInt(e.target.value))}
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

        {/* Question Statistics */}
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
      </div>
    </div>
  );
};

export default Index;
