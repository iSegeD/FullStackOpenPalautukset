const Persons = ({ persons, filterName, deletePerson }) => {
  return (
    <>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filterName.toLowerCase())
        )
        .map((item) => (
          <div key={item.id}>
            {item.name} ph: {item.number}
            <button onClick={() => deletePerson(item.id, item.name)}>
              Delete
            </button>
          </div>
        ))}
    </>
  );
};

export default Persons;
