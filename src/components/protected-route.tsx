import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

// 로그인한 사용자는 protected routes가 보이게 함  => 로그인하지 않은 경우 로그인 또는 계정 생성 페이지로 리다이렉션
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; // firebase에 유저 정보 전달
  console.log(user);
  if (user === null) {
    // 로그인 되어있지 않으면 null로 보냄
    return <Navigate to="/login" />;
  }
  return children;
}
