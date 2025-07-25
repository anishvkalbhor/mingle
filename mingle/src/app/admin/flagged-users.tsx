'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface User {
  _id: string;
  email: string;
  username: string;
  reportedUsers: string[];
  isBanned: boolean;
}

export default function FlaggedUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/admin/flagged-users${showDeleted ? '?deleted=true' : ''}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.flaggedUsers || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch flagged users');
        setLoading(false);
      });
  }, [showDeleted]);

  const handleAction = async (userId: string, action: 'ban' | 'unban' | 'warn') => {
    let body: any = { userId };
    if (action === 'warn') body.message = 'You have received a warning from admin.';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/flagged-users/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Action failed');
      // Refresh users list
      const updated = await fetch(`${API}/admin/flagged-users`).then(r => r.json());
      setUsers(updated.flaggedUsers || []);
    } catch (err) {
      setError('Action failed');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Flagged Users</h2>
      <Button onClick={() => setShowDeleted(v => !v)} variant="outline" style={{ marginBottom: 16 }}>
        {showDeleted ? 'Show Active Flagged Users' : 'Show Deleted Flagged Users'}
      </Button>
      {users.length === 0 ? (
        <p>No flagged users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.reportedUsers.length}</td>
                <td>{user.isBanned ? 'Banned' : 'Active'}</td>
                <td>
                  <Button onClick={() => handleAction(user._id, 'ban')} disabled={user.isBanned}>Ban</Button>{' '}
                  {user.isBanned && <Button onClick={() => handleAction(user._id, 'unban')}>Unban</Button>}{' '}
                  <Button onClick={() => handleAction(user._id, 'warn')}>Warn</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 