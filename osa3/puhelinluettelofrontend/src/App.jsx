import { useEffect, useState } from "react";
import phoneService from "./services/phonebook";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    phoneService.getAll().then((jsonData) => {
      setPersons(jsonData);
    });
  }, []);

  const dataReset = () => {
    setNewName("");
    setNewNumber("");
  };

  const notification = (message, duration = 5000) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, duration);
  };

  const addPerson = (e) => {
    e.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const currentUser = persons.find(
      (item) => item.name.toLowerCase() === newName.toLowerCase()
    );

    if (currentUser) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatePerson = { ...currentUser, number: newNumber };
        phoneService
          .update(currentUser.id, updatePerson)
          .then((jsonData) => {
            setPersons(
              persons.map((item) =>
                item.id !== currentUser.id ? item : jsonData
              )
            );
            dataReset();
            notification(`Updated: ${newName}`);
          })
          .catch((error) => {
            notification(
              `Information of ${newName} has already been removed from server`
            );
          });
      }
    } else {
      phoneService
        .create(newPerson)
        .then((jsonData) => {
          setPersons([...persons, jsonData]);
          dataReset();
          notification(`Added: ${newName}`);
        })
        .catch((error) => {
          notification(`Error: ${error.response.data.error}`);
        });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      phoneService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((item) => item.id !== id));
          notification(`Deleted: ${name}`);
        })
        .catch((error) => {
          notification(
            `Information of ${name} has already been removed from server`
          );
        });
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterName(e.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter value={filterName} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        inputs={{ newName, newNumber }}
        handlers={{ handleNameChange, handleNumberChange }}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterName={filterName}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
