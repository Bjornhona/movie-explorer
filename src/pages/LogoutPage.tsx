import { useEffect, useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import "../styles/pages/LogoutPage.scss";
import Toast from "../components/Toast.tsx";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";

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
      <Card icon={"🔐"} title={"Log out"}>
        <p className="auth-message">
          If you log out you will not be able to see your wishlist. You can login again at any moment by just navigating to My Wishlist.
        </p>
        <Button text={"Logout"} onClick={handleLogout} />
      </Card>
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
