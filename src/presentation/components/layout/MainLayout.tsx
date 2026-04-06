import React from 'react';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, content }) => {
  return (
    <div className="relative min-h-dvh flex bg-[var(--bg)]" id="main-layout">
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden="true" />

      {/* Sidebar container */}
      <div
        className="hidden lg:flex flex-col fixed top-0 left-0 h-dvh z-30"
        style={{ width: 'var(--sidebar-width)' }}
        id="sidebar-container"
      >
        {sidebar}
      </div>

      {/* Main content area */}
      <main
        className="flex-1 relative z-10 lg:ml-[var(--sidebar-width)] min-h-dvh pt-0 overflow-x-hidden"
        id="main-content"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 lg:py-12">
          {content}
        </div>
      </main>
    </div>
  );
};

