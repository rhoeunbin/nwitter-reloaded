import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Title = styled.h1`
  font-size: 42px;
`;
const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

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
    </Wrapper>
  );
}
