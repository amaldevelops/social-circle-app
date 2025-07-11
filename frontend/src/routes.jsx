import Layout from "./components/Layout";
import App from "./App";
import ProjectInfo from "./components/ProjectInfo";
import Profile from "./components/Profile";
import ErrorPage from "./ErrorPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Contacts from "./components/Contacts";
import SocialFeed from "./components/SocialFeed";
import Post from "./components/Post";
import ProfileByUserName from "./components/ProfileByUserName";

const routes = [
  {
    element: <Layout />,
    children: [
      {
        path: "/social-circle-app",
        element: <App />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/projectinfo",
        element: <ProjectInfo />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/login",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/register",
        element: <Register />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/contacts",
        element: <Contacts />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/contacts/:userName",
        element: <ProfileByUserName />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/socialfeed",
        element: <SocialFeed />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/social-circle-app/:userName/post/:postId",
        element: <Post />,
        errorElement: <ErrorPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default routes;
