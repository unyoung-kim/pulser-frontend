import React from 'react';


interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Wrap this around main navigation pages to apply consistent padding
 * @param param0
 * @returns
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-4 bg-gray-50">
        <div className="space-y-6 p-10 pb-16">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
