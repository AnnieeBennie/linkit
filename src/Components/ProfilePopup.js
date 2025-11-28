import Parse from "parse";
import "../css/ProfilePopup.css";

export default function ProfilePopup({ onClose }) {
  const user = Parse.User.current();

  return (
    <div className="profile-popup-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        <h2>Account</h2>

        {user && (
          <>
            <p>You are logged in as:</p>
            <p className="username">{user.get("username")}</p>

            <button
              className="logout-btn"
              onClick={async () => {
                await Parse.User.logOut();
                window.location.reload();
              }}
            >
              Log out
            </button>
          </>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}