const PersonForm = ({ onSubmit, inputs, handlers }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{" "}
        <input
          value={inputs.newName}
          onChange={handlers.handleNameChange}
          placeholder="Enter name..."
        />
      </div>
      <div>
        number:{" "}
        <input
          value={inputs.newNumber}
          onChange={handlers.handleNumberChange}
          placeholder="Enter phone..."
        />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default PersonForm;
