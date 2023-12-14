import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CraeteAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ), // 인증된 사용자만 레이아웃 보이게 함 // => 로그인한 경우에만 보임!
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  // 로그인 하면 layout 안 보이게 하려고 밖으로 뺌
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CraeteAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    // wait for firebase=
    await auth.authStateReady(); // 인증 상태가 준비되었는지 기다리는 함수
    // auth.을 하면 다양한 함수가 나옴 => 로그인, 로그아웃 등 가능

    // setTimeout(() => setLoading(false), 2000); // 2초 뒤에 로딩 화면
    setTimeout(() => setLoading(false));
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      {/* 로딩화면 다음에 라우터 나오게 */}
    </Wrapper>
  );
}

export default App;
