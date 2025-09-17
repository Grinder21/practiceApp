import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://dummyjson.com/users?limit=10&select=id,firstName,lastName"
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: { users: User[] } = await res.json();
        setUsers(data.users ?? []);
      } catch (e: any) {
        setError(e?.message || "Failed to load users");
      }
    })();
  }, []);

  return (
    <>
      <div>My project</div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ listStyle: "none" }}>
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
      <p>{error}</p>
    </>
  );
}

export default App;
