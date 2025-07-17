
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProfileCompletionChartProps {
  percentage: number;
}

export const ProfileCompletionChart = ({ percentage }: ProfileCompletionChartProps) => {
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  const COLORS = ['#a855f7', '#e5e7eb'];

  return (
    <div className="h-64 flex items-center justify-center">
      <div className="relative">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};
