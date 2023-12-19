// App.jsx
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import LearnEnglishComponent from "./LearnEnglishComponent.jsx";
import LearnFinnishComponent from "./LearnFinnishComponent.jsx";
import AdminComponent from "./AdminComponent.jsx";
import MismatchComponent from "./MismatchComponent";

function App() {
  return (
    <BrowserRouter>
      <div>
        <div className="topnav">
          <NavLink
            exact
            to="/"
            className="tehtava-button"
            activeClassName="active"
          >
            Learn English
          </NavLink>
          <NavLink
            to="/learnfinnish"
            className="tehtava-button"
            activeClassName="active"
          >
            Learn Finnish
          </NavLink>
          <NavLink
            to="/admin"
            className="tehtava-button"
            activeClassName="active"
          >
            Admin
          </NavLink>
        </div>

        <Routes>
          <Route path="/" element={<LearnEnglishComponent />} />
          <Route path="/learnfinnish" element={<LearnFinnishComponent />} />
          <Route path="/admin" element={<AdminComponent />} />
          <Route path="*" element={<MismatchComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
