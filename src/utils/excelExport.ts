
import * as XLSX from 'xlsx';
import { calculateScore, getQuestionStats } from './quizCalculations';

export const exportToExcel = (
  students: { name: string; answers: number[] }[],
  correctAnswers: number[],
  numQuestions: number,
  averageScore: number
) => {
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
    correctRow.push(answer.toString());
  });
  mainData.push(correctRow);

  // Add student data
  students.forEach(student => {
    const score = calculateScore(student.answers, correctAnswers);
    const percentage = Math.round((score / numQuestions) * 100);
    const row = [student.name, score.toString(), `${percentage}%`];
    student.answers.slice(0, numQuestions).forEach(answer => {
      row.push(answer.toString());
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
  
  const questionStats = getQuestionStats(students, correctAnswers);
  questionStats.slice(0, numQuestions).forEach((stat, index) => {
    statsData.push([
      `Question ${stat.question}`,
      stat.correctCount.toString(),
      stat.totalStudents.toString(),
      `${stat.percentage}%`,
      correctAnswers[index].toString()
    ]);
  });

  // Add summary statistics
  statsData.push([]);
  statsData.push(['Summary Statistics']);
  statsData.push(['Total Questions', numQuestions.toString()]);
  statsData.push(['Total Students', students.length.toString()]);
  statsData.push(['Average Score', averageScore.toString()]);
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
