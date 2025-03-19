import Header from "./Header";
import Part from "./Part";
import Total from "./Total";

const Content = ({ courses }) => {
  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map((item) => (
        <div key={item.id}>
          <Header title={item.name} />
          {item.parts.map((part) => (
            <Part key={part.id} part={part} />
          ))}
          <Total value={item.parts} />
        </div>
      ))}
    </>
  );
};

export default Content;
