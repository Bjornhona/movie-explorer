import { useEffect, useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import '../styles/pages/LogoutPage.scss';
import Toast from "../components/Toast.tsx";

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
    <div className="logout-component">
      <h2>Logout</h2>
      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
      {showToast && (
        <Toast
          message="Logout successful!"
          color="green"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default LogoutPage;
