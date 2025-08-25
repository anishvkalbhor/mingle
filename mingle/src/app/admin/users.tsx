import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Search } from "lucide-react";

interface User {
  _id: string;
  email: string;
  username: string;
  isBanned: boolean;
  clerkId?: string;
}

interface SupportTicket {
  _id: string;
  userId: string;
  issueType: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  // const [setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [ticketsUser, setTicketsUser] = useState<User | null>(null);
  const API =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  const limit = 10;
  const { getToken } = useAuth();
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API}/admin/users?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setUsers(data.users || []);
      // setTotal(data.total || 0);
    } catch {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  const fetchSupportTickets = async () => {
    setTicketsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/support-ticket`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSupportTickets(data.tickets || []);
    } catch {}
    setTicketsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search, page]);

  const handleAction = async (
    userId: string,
    action: "ban" | "unban" | "warn"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const body: { userId: string; message?: string } = { userId };
      if (action === "warn") {
        const message = prompt("Enter warning message:");
        if (!message) {
          setLoading(false);
          return;
        }
        body.message = message;
      }
      const res = await fetch(`${API}/admin/users/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Action failed");
      fetchUsers();
    } catch {
      setError("Action failed");
    }
    setLoading(false);
  };

  const handleViewDetails = async (userId: string) => {
    setShowDetails(true);
    setDetails(null);
    setSelectedUser(null);
    try {
      const res = await fetch(`${API}/admin/users/${userId}`);
      const data = await res.json();
      setDetails(data);
      setSelectedUser(data.user);
    } catch {
      setDetails(null);
    }
  };

  const handleViewTickets = async (user: User) => {
    await fetchSupportTickets();
    setTicketsUser(user);
    setShowTicketsModal(true);
  };

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginBottom: 24,
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        All Users
      </h2>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa",
              width: 18,
              height: 18,
            }}
          />
          <input
            type="text"
            placeholder="Search by email or username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 8px 8px 32px",
              width: 300,
              marginRight: 0,
              border: "1px solid #eee",
              borderRadius: 4,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchUsers();
            }}
          />
        </div>
        <Button onClick={fetchUsers} style={{ marginLeft: 8 }}>
          Search
        </Button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && users.length === 0 && (
        <div style={{ textAlign: "center" }}>No users found.</div>
      )}
      {!loading && users.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff0fa",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 8px #f3e6f9",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  fontWeight: 700,
                }}
              >
                Email
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  fontWeight: 700,
                }}
              >
                Username
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  fontWeight: 700,
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  fontWeight: 700,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: "1px solid #f3e6f9" }}>
                <td style={{ textAlign: "center", padding: "12px 0" }}>
                  {user.email}
                </td>
                <td style={{ textAlign: "center", padding: "12px 0" }}>
                  {user.username}
                </td>
                <td style={{ textAlign: "center", padding: "12px 0" }}>
                  {user.isBanned ? "Banned" : "Active"}
                </td>
                <td style={{ textAlign: "center", padding: "12px 0" }}>
                  <Button onClick={() => handleViewDetails(user._id)}>
                    View
                  </Button>{" "}
                  {!user.isBanned && (
                    <Button
                      onClick={() => handleAction(user._id, "ban")}
                      variant="destructive"
                    >
                      Ban
                    </Button>
                  )}{" "}
                  {user.isBanned && (
                    <Button
                      onClick={() => handleAction(user._id, "unban")}
                      variant="secondary"
                    >
                      Unban
                    </Button>
                  )}{" "}
                  <Button
                    onClick={() => handleAction(user._id, "warn")}
                    variant="outline"
                  >
                    Warn
                  </Button>{" "}
                  <Button
                    onClick={() => handleViewTickets(user)}
                    variant="secondary"
                  >
                    Support Tickets
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showDetails && selectedUser && details && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 8,
              minWidth: 400,
              maxWidth: 600,
            }}
          >
            <h3>User Details</h3>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
            <p>
              <b>Username:</b> {selectedUser.username}
            </p>
            <p>
              <b>Status:</b> {selectedUser.isBanned ? "Banned" : "Active"}
            </p>
            <h4>Matches</h4>
            <ul>
              {details.matches && details.matches.length > 0 ? (
                details.matches.map(
                  (m: { fromUserId: string; toUserId: string }, i: number) => (
                    <li key={i}>
                      {m.fromUserId} ↔ {m.toUserId}
                    </li>
                  )
                )
              ) : (
                <li>No matches</li>
              )}
            </ul>
            <Button
              onClick={() => setShowDetails(false)}
              style={{ marginTop: 16 }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {showTicketsModal && ticketsUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 8,
              minWidth: 400,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>Support Tickets for {ticketsUser.email}</h3>
            {ticketsLoading ? (
              <div>Loading tickets...</div>
            ) : (
              <ul style={{ marginTop: 16 }}>
                {supportTickets.filter((t) => t.userId === ticketsUser.clerkId)
                  .length === 0 && <li>No tickets found.</li>}
                {supportTickets
                  .filter((t) => t.userId === ticketsUser.clerkId)
                  .map((ticket) => (
                    <li
                      key={ticket._id}
                      style={{
                        marginBottom: 16,
                        borderBottom: "1px solid #eee",
                        paddingBottom: 8,
                      }}
                    >
                      <b>Type:</b> {ticket.issueType} <br />
                      <b>Description:</b> {ticket.description} <br />
                      <b>Status:</b> {ticket.status} <br />
                      <b>Created:</b>{" "}
                      {new Date(ticket.createdAt).toLocaleString()}
                      <br />
                      {ticket.status !== "resolved" && (
                        <Button
                          style={{ marginTop: 8 }}
                          onClick={async () => {
                            setTicketsLoading(true);
                            const token = await getToken();
                            await fetch(
                              `${API}/support-ticket/${ticket._id}/resolve`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            await fetchSupportTickets();
                            setTicketsLoading(false);
                          }}
                          variant="secondary"
                        >
                          Resolve
                        </Button>
                      )}
                    </li>
                  ))}
              </ul>
            )}
            <Button
              onClick={() => setShowTicketsModal(false)}
              style={{ marginTop: 16 }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
