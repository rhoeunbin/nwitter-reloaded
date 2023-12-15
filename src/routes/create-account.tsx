import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
  Form,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CraeteAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 한 번 더 클릭하면 에러 사라짐
    if (isLoading || name === "" || email === "" || password === "") return; // name, email, password = empty => 함수 종료
    try {
      setLoading(true);
      // 계정 생성
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // firebase.ts에 이미 auth 인증사항 있음
      // createUserWithEmailAndPassword : 사용자 계정을 만드려고 시도, 성공하면 자격증명을 받음, 성공하면 사용자는 애플리케이션에 즉시 로그인하게 됌(자동 로그인)
      console.log(credentials.user);

      // 사용자의 프로필 이름 지정
      await updateProfile(credentials.user, {
        displayName: name,
      });

      // 홈페이지로 리다이렉트
      navigate("/");
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
    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
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
        <Input
          type="submit"
          value={isLoading ? "...loading" : "create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      {/* error 가 빈 문자열과 같지 않다면 에러메시지 보냄 */}
      <Switcher>
        Already an account? <Link to="/login">login</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
