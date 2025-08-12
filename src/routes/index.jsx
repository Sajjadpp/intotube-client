import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout'; 
import { SidebarContextProvider } from '../context/sideBarContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from '../context/notificationContext';

const CreateRouter = (routes = {}) => {
  return (
    <AuthProvider>
      <SidebarContextProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PublicLayout />}>
                {routes.public.map(({ path, element: Element }, index) => (
                  <Route key={index} path={path} element={<Element />} />
                ))}
              </Route>
            </Routes>
            {/* Toast Container here */}
            <ToastContainer position="top-right" autoClose={3000} />
          </Router>
        </NotificationProvider>
      </SidebarContextProvider>
    </AuthProvider>
  );
};

export default CreateRouter;
