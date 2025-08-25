import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface LikesComparisonChartProps {
  data: { month: string; given: number; received: number }[];
}

export const LikesComparisonChart = ({ data }: LikesComparisonChartProps) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Legend />
          <Bar dataKey="given" fill="#f43f5e" name="Likes Given" radius={[2, 2, 0, 0]} />
          <Bar dataKey="received" fill="#ec4899" name="Likes Received" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 