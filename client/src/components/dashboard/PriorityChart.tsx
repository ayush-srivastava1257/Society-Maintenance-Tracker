import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface PriorityChartProps {
  data: { name: string; count: number }[];
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: '#C96A6A',
  MEDIUM: '#E88D38',
  LOW: '#5FAF9A',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const color = PRIORITY_COLORS[item.payload.name] || '#E88D38';
    return (
      <div className="bg-[#0A121D]/95 backdrop-blur-xl border border-[#E88D38]/50 p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-1 text-xs">
        <div className="flex items-center space-x-2 font-bold text-[#E9E3D2]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span>{item.payload.name} Priority</span>
        </div>
        <p className="text-[#A7B1B5] font-medium">
          Total Complaints: <strong className="text-[#E88D38] font-extrabold text-sm ml-1">{item.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const PriorityChart: React.FC<PriorityChartProps> = ({ data }) => {
  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-[#E88D38]/20 pb-3">
        <BarChart3 className="w-4 h-4 text-[#E88D38]" />
        <h3 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider">
          Complaints by Priority Level
        </h3>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#A7B1B5]">
            No priority data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#A7B1B5" fontSize={11} fontWeight="bold" />
              <YAxis stroke="#A7B1B5" fontSize={11} allowDecimals={false} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(232, 141, 56, 0.08)', rx: 8 }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} animationDuration={1000}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PRIORITY_COLORS[entry.name] || '#E88D38'}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
                  fill="#E9E3D2"
                  fontSize={12}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
