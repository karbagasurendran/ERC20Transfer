import './App.css';
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import TransferToken from "./pages/TransferToken"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Routes>
      <Route path="/" element={<Home/> } />
      <Route path="/transfer/:address" element={<TransferToken/> } />
      </Routes>
    </div>
  );
}

export default App;
