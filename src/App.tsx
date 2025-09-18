import { useEffect, useMemo, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

function highlight(fullName: string, query: string) {
  if (!query) {
    return <>{fullName}</>;
  }

  const lowerFull = fullName.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const index = lowerFull.indexOf(lowerQuery);

  if (index === -1) {
    return <>{fullName}</>;
  }

  const before = fullName.slice(0, index);
  const match = fullName.slice(index, index + query.length);
  const after = fullName.slice(index + query.length);

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeIds, setActiveIds] = useState<Set<number>>(new Set());

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  const setActive = (id: number) => {
    setActiveIds((prev) => new Set(prev).add(id));
  };

  return (
    <>
      <div>My project</div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul style={{ listStyle: "none" }}>
        {filtered.map((u) => {
          const isActive = activeIds.has(u.id);
          return (
            <li key={u.id}>
              {isActive ? "🟢" : null}
              {highlight(`${u.firstName} ${u.lastName}`, query)}{" "}
              {!isActive && (
                <button onClick={() => setActive(u.id)}>set active</button>
              )}
            </li>
          );
        })}
      </ul>
      <p>{error}</p>
    </>
  );
}

export default App;
