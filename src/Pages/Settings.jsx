import React from "react";
import "../css/Settings.css";

const notificationSettings = [
  { id: 1, name: "New Club Events", enabled: true, frequency: "daily" },
  { id: 2, name: "Event Reminders", enabled: true, frequency: "real-time" },
  { id: 3, name: "Club Announcements", enabled: true, frequency: "weekly" },
  { id: 4, name: "Group Chat Messages", enabled: false, frequency: "real-time" },
];

export default function Settings() {
  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <nav className="settings-nav">
          <h2 className="nav-title">Settings</h2>
          <ul className="nav-list">
            <li>
              <a href="#" className="nav-item active">
                Notifications
              </a>
            </li>
            <li>
              <a href="#" className="nav-item">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="nav-item">
                Account
              </a>
            </li>
            <li>
              <a href="#" className="nav-item">
                Help & Support
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="settings-main">
        <div className="settings-header">
          <h1>Notifications</h1>
          <p>Choose how you'd like to be notified about activities</p>
        </div>

        <div className="notifications-table">
          <div className="table-row table-header">
            <div className="col col-name">Notification Type</div>
            <div className="col col-toggle">Status</div>
            <div className="col col-frequency">Frequency</div>
          </div>

          {notificationSettings.map((setting) => (
            <div key={setting.id} className="table-row">
              <div className="col col-name">{setting.name}</div>
              <div className="col col-toggle">
                <span className={`status ${setting.enabled ? "on" : "off"}`}>
                  {setting.enabled ? "On" : "Off"}
                </span>
              </div>
              <div className="col col-frequency">
                <select>
                  <option value="real-time">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="settings-footer">
          <button className="save-btn">Save Changes</button>
        </div>
      </main>
    </div>
  );
}
