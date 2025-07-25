import { useEffect, useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import Toast from "./Toast.tsx";

const LogoutPage = () => {
  const { accountId, logout } = useAuthentication();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!accountId) {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [accountId]);

  const handleLogout = () => {
    logout();
    setShowToast(true);
    localStorage.setItem("logoutSuccess", "1");
    setTimeout(() => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 64 }}>
      <h2>Logout</h2>
      <button
        style={{
          background: '#fff',
          color: '#222',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '10px 28px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 24,
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
      {showToast && (
        <Toast message="Logout successful!" color="green" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default LogoutPage;
