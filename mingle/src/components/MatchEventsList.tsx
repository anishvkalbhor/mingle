import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Eye } from 'lucide-react';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'match':
      return <Heart className="w-4 h-4 text-rose-500" />;
    case 'message':
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'view':
      return <Eye className="w-4 h-4 text-green-500" />;
    default:
      return <Heart className="w-4 h-4 text-purple-500" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'match':
      return 'bg-rose-100 text-rose-700';
    case 'message':
      return 'bg-blue-100 text-blue-700';
    case 'view':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-purple-100 text-purple-700';
  }
};

export const MatchEventsList = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/users/${user.id}/recent-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isLoaded, isSignedIn, user, getToken]);

  if (!isLoaded || loading) {
    return <div className="text-center text-gray-500 py-6">Loading events...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-6">{error}</div>;
  }
  if (!events.length) {
    return <div className="text-center text-gray-500 py-6">No recent events.</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Avatar className="w-10 h-10">
            <AvatarImage src={event.avatar} alt={event.name} />
            <AvatarFallback>{event.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 truncate">{event.name}</p>
              <Badge variant="secondary" className={getEventColor(event.type)}>
                {getEventIcon(event.type)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{event.action}</p>
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap">
            {event.time}
          </div>
        </div>
      ))}
    </div>
  );
}; 