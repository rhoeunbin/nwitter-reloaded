import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
  Form,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 한 번 더 클릭하면 에러 사라짐
    if (isLoading || email === "" || password === "") return; // name, email, password = empty => 함수 종료
    try {
      setLoading(true);
      // login
      await signInWithEmailAndPassword(auth, email, password);

      // success => redirect to home
      navigate("/"); // home에 머물러야 함
    } catch (e) {
      // setError
      if (e instanceof FirebaseError) {
        // cmd+click으로 확인 가능
        // console.log(e.code, e.message);
        setError(e.message); // 사용자에게 보여주기
      }
    } finally {
      setLoading(false);
    }
    console.log(email, password);
  };

  return (
    <Wrapper>
      <Title>Login to X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "...loading" : "Login"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      {/* error 가 빈 문자열과 같지 않다면 에러메시지 보냄 */}
      <Switcher>
        Don't jave an account? <Link to="/create-account">create one</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
