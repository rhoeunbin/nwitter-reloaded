import { auth } from "../firebase";

export default function Home() {
  const logOut = () => {
    auth.signOut(); // 로그아웃
  };
  return (
    <h1>
      <button onClick={logOut}>logout</button>
    </h1>
  );
}
