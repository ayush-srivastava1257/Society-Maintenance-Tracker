import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

interface InsightsCardProps {
  insights: string[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  const renderFormattedInsight = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanText = part.slice(2, -2);
        return (
          <strong key={index} className="font-extrabold text-[#E88D38]">
            {cleanText}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-[#E88D38]/20 pb-3">
        <Sparkles className="w-4 h-4 text-[#E88D38]" />
        <h3 className="text-xs font-extrabold text-[#E9E3D2] uppercase tracking-wider">
          Facility AI Maintenance Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#121E2C]/80 border border-[#E88D38]/20"
          >
            <Lightbulb className="w-4 h-4 text-[#E88D38] shrink-0 mt-0.5" />
            <p className="text-xs text-[#E9E3D2] font-medium leading-relaxed">
              {renderFormattedInsight(insight)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
