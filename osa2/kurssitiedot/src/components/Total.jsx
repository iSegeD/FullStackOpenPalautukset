const Total = ({ value }) => {
  const totalSum = value.reduce((acc, curr) => acc + curr.exercises, 0);

  return <h4>total of {totalSum} exercises</h4>;
};

export default Total;
