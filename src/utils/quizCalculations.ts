
export const calculateScore = (studentAnswers: number[], correctAnswers: number[]): number => {
  return studentAnswers.reduce((score, answer, index) => {
    return score + (answer === correctAnswers[index] ? 1 : 0);
  }, 0);
};

export const getQuestionStats = (students: { name: string; answers: number[] }[], correctAnswers: number[]) => {
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
