import React from 'react';

export default function SectionHeader({ title, highlightedText, align = 'center' }) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <div className={`${alignClass} mb-6`}>
      <h2 className="text-3xl md:text-4xl font-bold text-[#10324A]">
        {title} <span className="text-[#00B2FF]">{highlightedText}</span>
      </h2>
    </div>
  );
}
