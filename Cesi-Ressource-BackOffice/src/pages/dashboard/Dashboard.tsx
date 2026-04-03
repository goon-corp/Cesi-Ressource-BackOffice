import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import type { EntityPanel } from '../../components/dashboard/Sidebar';
import UsersPanel from './UsersPanel';
import RessourcesPanel from './RessourcesPanel';
import TagsPanel from './TagsPanel';
import ReportsPanel from './ReportsPanel';
import CommentsPanel from './CommentsPanel';

const panelComponents: Record<EntityPanel, React.ReactNode> = {
  users: <UsersPanel />,
  ressources: <RessourcesPanel />,
  tags: <TagsPanel />,
  reports: <ReportsPanel />,
  comments: <CommentsPanel />,
};

const Dashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<EntityPanel>('users');

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FAF9F6]">
      <Sidebar active={activePanel} onChange={setActivePanel} />

      <main className="flex-1 p-8">
        {panelComponents[activePanel]}
      </main>
    </div>
  );
};

export default Dashboard;
