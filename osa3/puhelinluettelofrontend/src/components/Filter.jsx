const Filter = ({ value, onChange }) => {
  return (
    <div>
      Filter shown with:{" "}
      <input value={value} onChange={onChange} placeholder="Find person..." />
    </div>
  );
};

export default Filter;
