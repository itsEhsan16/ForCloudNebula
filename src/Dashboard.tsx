import React, { useEffect, useMemo, useState } from "react";

interface User {
  id: number;
  name: string;
  age: number;
}

const usersData: User[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  age: 18 + (i % 40),
}));

export default function Dashboard() {
  const [users] = useState<User[]>(usersData);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // FIX: functional update prevents stale closure — each click schedules an
  // independent +1 regardless of when the callback fires relative to other clicks.
  const increment = () => {
    setTimeout(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  // FIX: memoize the filter so it only re-runs when search or the users array
  // changes, not on every unrelated render (e.g. counter increments).
  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  // FIX: named handler so removeEventListener can match the exact reference;
  // cleanup prevents listener accumulation across Strict Mode double-mounts.
  useEffect(() => {
    const handleResize = () => console.log(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 border p-4 md:p-6">
        <UserList
          users={filteredUsers}
          search={search}
          onSearch={setSearch}
          onSelect={setSelectedUser}
        />

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">Dashboard</h1>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="border p-6 w-full sm:w-[250px]">
              <h3 className="text-lg font-semibold">Counter</h3>
              <p className="text-3xl mt-4">{count}</p>
              <button
                onClick={increment}
                className="bg-black text-white px-4 py-2 mt-4"
              >
                Increment
              </button>
            </div>

            <div className="border p-6 flex-1">
              <h3 className="text-lg font-semibold mb-4">Selected User</h3>
              {selectedUser ? (
                <div>
                  <p>Name: {selectedUser.name}</p>
                  <p>Age: {selectedUser.age}</p>
                </div>
              ) : (
                <p>No user selected</p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <AnalyticsPanel users={filteredUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserList({
  users,
  search,
  onSearch,
  onSelect,
}: {
  users: User[];
  search: string;
  onSearch: (value: string) => void;
  onSelect: (user: User) => void;
}) {
  return (
    <div className="w-full md:w-[300px] md:border-r md:pr-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <input
        type="text"
        placeholder="Search user..."
        className="border p-2 w-full mb-4"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="h-64 md:h-[500px] overflow-y-scroll">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className="p-2 border mb-2 cursor-pointer hover:bg-gray-100"
          >
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// FIX: React.memo prevents re-renders when the parent re-renders for unrelated
// reasons (e.g. counter increments). The component only re-renders when the
// users array reference changes, which only happens when the search filter
// produces a new result set.
const AnalyticsPanel = React.memo(function AnalyticsPanel({
  users,
}: {
  users: User[];
}) {
  const totalAge = useMemo(
    () => users.reduce((acc, user) => acc + user.age, 0),
    [users]
  );

  return (
    <div className="border p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <p>Total Users: {users.length}</p>
      <p>Total Age Sum: {totalAge}</p>
    </div>
  );
});
