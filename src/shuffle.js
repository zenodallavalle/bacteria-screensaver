export const shuffleArray = (array) =>
  array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const shuffleAnswers = (answers) =>
  answers
    .map((value) => ({
      value,
      sort: value[2].fixed ? value[0] : Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
