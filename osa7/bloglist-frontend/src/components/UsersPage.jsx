import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const UsersPage = () => {
  const users = useSelector((state) => state.user);

  return (
    <div className="mt-4">
      <h2>Users</h2>
      <table className="table table-striped table-bordered table-hover mt-3">
        <thead className="table-light">
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item.id}>
              <td>
                <Nav.Link as={Link} to={`/users/${item.id}`}>
                  {item.name}
                </Nav.Link>
              </td>
              <td>{item.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
