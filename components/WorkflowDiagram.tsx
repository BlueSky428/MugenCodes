export const WorkflowDiagram = () => {
  return (
    <div className="w-full overflow-x-auto rounded-[28px] border border-ink/10 bg-white p-10 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
      <svg
        role="img"
        aria-label="Workflow from client to delivery"
        viewBox="0 0 920 160"
        className="h-32 w-full min-w-[720px] text-ink dark:text-white"
      >
        <defs>
          <linearGradient id="accentGlow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e3f1ef" />
            <stop offset="100%" stopColor="#f6f7f5" />
          </linearGradient>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6" fill="#1f6f6b" />
          </marker>
        </defs>
        <rect x="20" y="40" width="140" height="80" rx="20" fill="url(#accentGlow)" />
        <rect x="200" y="40" width="160" height="80" rx="20" fill="#ffffff" stroke="#1f6f6b" strokeWidth="1.2" />
        <rect x="400" y="40" width="160" height="80" rx="20" fill="#ffffff" stroke="#1f6f6b" strokeWidth="1.2" />
        <rect x="600" y="40" width="160" height="80" rx="20" fill="#ffffff" stroke="#1f6f6b" strokeWidth="1.2" />
        <rect x="800" y="40" width="100" height="80" rx="20" fill="url(#accentGlow)" />
        <text x="90" y="86" textAnchor="middle" fontSize="16" fill="currentColor">
          Client
        </text>
        <text x="280" y="78" textAnchor="middle" fontSize="16" fill="currentColor">
          Project Manager
        </text>
        <text x="280" y="98" textAnchor="middle" fontSize="12" fill="#5a6f6b">
          clarity and care
        </text>
        <text x="480" y="78" textAnchor="middle" fontSize="16" fill="currentColor">
          Lead Developer
        </text>
        <text x="480" y="98" textAnchor="middle" fontSize="12" fill="#5a6f6b">
          plan and quality
        </text>
        <text x="680" y="78" textAnchor="middle" fontSize="16" fill="currentColor">
          Developers
        </text>
        <text x="680" y="98" textAnchor="middle" fontSize="12" fill="#5a6f6b">
          build and test
        </text>
        <text x="850" y="86" textAnchor="middle" fontSize="16" fill="currentColor">
          Delivery
        </text>
        <line x1="160" y1="80" x2="200" y2="80" stroke="#1f6f6b" strokeWidth="1.6" markerEnd="url(#arrow)" />
        <line x1="360" y1="80" x2="400" y2="80" stroke="#1f6f6b" strokeWidth="1.6" markerEnd="url(#arrow)" />
        <line x1="560" y1="80" x2="600" y2="80" stroke="#1f6f6b" strokeWidth="1.6" markerEnd="url(#arrow)" />
        <line x1="760" y1="80" x2="800" y2="80" stroke="#1f6f6b" strokeWidth="1.6" markerEnd="url(#arrow)" />
      </svg>
    </div>
  );
};
