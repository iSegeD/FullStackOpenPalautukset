const mongoose = require("mongoose");
const dbPassword = process.argv[2];

const dbUrl = `mongodb+srv://myfullstack:${dbPassword}@fullstackopen.kw9pz.mongodb.net/testDB?retryWrites=true&w=majority&appName=FullStackOpen`;

mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

if (process.argv.length > 3) {
  const personName = process.argv.slice(3, -1).join(" ");
  const personNumber = process.argv[process.argv.length - 1];

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  person.save().then((res) => {
    const nameFormat = person.name.includes(" ")
      ? `"${person.name}"`
      : person.name;
    console.log(`Added: ${nameFormat} number: ${person.number} to phonebook.`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((people) => {
      console.log(`${people.name} ${people.number}`);
    });
    mongoose.connection.close();
  });
}
