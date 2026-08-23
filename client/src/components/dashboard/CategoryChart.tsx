import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, Layers } from 'lucide-react';

interface CategoryChartProps {
  data: { name: string; count: number }[];
}

const COLORS = ['#E88D38', '#5FAF9A', '#6F9FB2', '#C96A6A', '#D9A441', '#8B6BB2'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-[#0A121D]/95 backdrop-blur-xl border border-[#E88D38]/50 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-1 text-xs">
        <div className="flex items-center space-x-2 font-bold text-[#E9E3D2]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.name}</span>
        </div>
        <p className="text-[#A7B1B5] font-medium">
          Complaints Count: <strong className="text-[#E88D38] font-extrabold text-sm ml-1">{item.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-[#E88D38]/20 pb-3">
        <PieIcon className="w-4 h-4 text-[#E88D38]" />
        <h3 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider">
          Complaints by Category
        </h3>
      </div>

      <div className="h-64 w-full relative">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#A7B1B5]">
            No category distribution data.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="44%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                animationDuration={1000}
                stroke="#0A121D"
                strokeWidth={2.5}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Pie>

              {/* Center Donut Label: Total Issue Counter & Icon */}
              <text
                x="50%"
                y="39%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-serif text-2xl font-bold fill-[#E9E3D2]"
              >
                {totalCount}
              </text>
              <text
                x="50%"
                y="49%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[9px] font-extrabold uppercase tracking-widest fill-[#E88D38]"
              >
                TOTAL ISSUES
              </text>

              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#A7B1B5', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
