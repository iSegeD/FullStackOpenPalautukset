import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserPage = () => {
  const { id } = useParams();
  const user = useSelector((state) =>
    state.user.find((item) => item.id === id)
  );

  if (!user) {
    return null;
  }
  return (
    <div className="p-4 border rounded bg-light mt-4">
      <h2>{user.name}</h2>
      <h4 className="mt-3">Added blogs :</h4>
      <ul className="list-group mt-2">
          {user.blogs.map((item) => (
            <li key={item.id} className="list-group-item mt-2">
              {item.title}
            </li>
          ))}
        </ul>
    </div>
  );
};

export default UserPage;
