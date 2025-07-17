
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Eye } from 'lucide-react';

const events = [
  {
    id: 1,
    type: 'match',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b39b5413?w=150&h=150&fit=crop&crop=face',
    time: '2 hours ago',
    action: 'New match!'
  },
  {
    id: 2,
    type: 'message',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    time: '5 hours ago',
    action: 'Sent you a message'
  },
  {
    id: 3,
    type: 'view',
    name: 'Jessica Wilson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    time: '1 day ago',
    action: 'Viewed your profile'
  },
  {
    id: 4,
    type: 'like',
    name: 'Ashley Brown',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    time: '2 days ago',
    action: 'Liked your photo'
  }
];

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
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Avatar className="w-10 h-10">
            <AvatarImage src={event.avatar} alt={event.name} />
            <AvatarFallback>{event.name.charAt(0)}</AvatarFallback>
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