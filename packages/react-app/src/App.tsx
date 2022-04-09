import { Home } from './pages/home'
import { Nft } from './pages/nft'
import { NotFound } from './pages/notFound'
import { Routes, Route } from "react-router-dom";

function App() {

  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path=':address/:id' element={<Nft />} />
      <Route path="*" element={<NotFound />} />

    </Routes>

  );
}

export default App;
