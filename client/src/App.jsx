import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadPage from "./components/UploadPage";
import TranscodePage from "./components/TranscodePage";
import VideoListPage from "./components/VideoListPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navbar />}>
        <Route index element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="transcode" element={<TranscodePage />} />
        <Route path="videos" element={<VideoListPage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
