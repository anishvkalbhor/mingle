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
  // Removed showDeleted state
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/admin/flagged-users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.flaggedUsers || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch flagged users');
        setLoading(false);
      });
  }, []); // Removed showDeleted dependency

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
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Flagged Users</h2>
      {/* Removed Show Deleted Flagged Users button */}
      {users.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No flagged users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff0fa', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #f3e6f9' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', padding: '16px 0', fontWeight: 700 }}>Email</th>
              <th style={{ textAlign: 'center', padding: '16px 0', fontWeight: 700 }}>Username</th>
              <th style={{ textAlign: 'center', padding: '16px 0', fontWeight: 700 }}>Reported By</th>
              <th style={{ textAlign: 'center', padding: '16px 0', fontWeight: 700 }}>Status</th>
              <th style={{ textAlign: 'center', padding: '16px 0', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #f3e6f9' }}>
                <td style={{ textAlign: 'center', padding: '12px 0' }}>{user.email}</td>
                <td style={{ textAlign: 'center', padding: '12px 0' }}>{user.username}</td>
                <td style={{ textAlign: 'center', padding: '12px 0' }}>{user.reportedUsers.length}</td>
                <td style={{ textAlign: 'center', padding: '12px 0' }}>{user.isBanned ? 'Banned' : 'Active'}</td>
                <td style={{ textAlign: 'center', padding: '12px 0' }}>
                  <Button onClick={() => handleAction(user._id, 'ban')} disabled={user.isBanned} variant="destructive">Ban</Button>{' '}
                  {user.isBanned && <Button onClick={() => handleAction(user._id, 'unban')} variant="success">Unban</Button>}{' '}
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