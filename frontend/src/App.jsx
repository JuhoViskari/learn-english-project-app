// App.jsx
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import MainComponent from "./MainComponent";
import EnglishComponent from "./EnglishComponent.jsx";
import AdminComponent from "./AdminComponent.jsx";
import MismatchComponent from "./MismatchComponent";

function App() {
  return (
    <BrowserRouter>
      <div>
        <div className="topnav">
          <NavLink exact to="/" className="nav-button" activeClassName="active">
            Learn English
          </NavLink>
          <NavLink
            to="/english"
            className="nav-button"
            activeClassName="active"
          >
            Learn Finnish
          </NavLink>
          <NavLink to="/staff" className="nav-button" activeClassName="active">
            Staff
          </NavLink>
        </div>

        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/english" element={<EnglishComponent />} />
          <Route path="/staff" element={<AdminComponent />} />
          <Route path="*" element={<MismatchComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
