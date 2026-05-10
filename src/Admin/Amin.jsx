// Admin.jsx
import { useState } from "react";
import PasswordModal from "./components/PasswordModal";
import Sidebar from "./Sidebar";
import Header from "./Header";
import GameUploadForm from "./components/GameUploadForm";
import GamesManager from "./components/GamesManager";

const PAGE_TITLES = {
  upload: "Upload Game",
  manager: "Manage Games",
};

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [activePage, setActivePage] = useState("manager");
  const [refreshManager, setRefreshManager] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger manager refresh when new game is uploaded
    setRefreshManager(prev => prev + 1);
  };

  return (
    <div style={styles.root}>
      {!unlocked && <PasswordModal onUnlock={() => setUnlocked(true)} />}

      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div style={styles.main}>
        <Header title={PAGE_TITLES[activePage]} />

        {activePage === "upload" && (
          <GameUploadForm onUploadSuccess={handleUploadSuccess} />
        )}

        {activePage === "manager" && (
          <GamesManager refreshTrigger={refreshManager} />
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    height: "100vh",
    background: "#f0f2f8",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    overflow: "hidden",
    position: "relative",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};