import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="outerDiv d-flex">
      <Sidebar/>
      <Dashboard/>
    </div>
  );
}

export default App;
