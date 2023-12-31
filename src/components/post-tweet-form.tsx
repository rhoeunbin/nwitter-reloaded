import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    // 눌렸을 때
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target; // 파일을 여러개 받음 => e.target에 files가 존재
    if (files && files.length === 1) {
      // 파일이 하나만 있는지 확인(배열의 길이가 1인지)
      setFile(files[0]); // 배열의 첫번째 파일을 file state에 저장
    }
  };

  // ⭐️글 내용은 여기임!!!!!!document 작업
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 190) return; // 유저가 로그인 상태인지 확인 => 아니면 끔
    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous", // displayName이 없으면 익명
        userId: user.uid, // 해당 유저의 권한이 있는지 확인
      });

      if (file) {
        const locationRef = ref(
          storage,
          // `tweets/${user.uid}-${user.displayName}/${doc.id}`
          // 트윗을 삭제할 때 이미지도 같이 삭제하기 위해 바꿈
          `tweets /${user.uid}/${doc.id}` //TIoxlMQfv9Q7OFsTSunYFI7KeXP2-eun/ 이런식으로 저장된다
        );
        const result = await uploadBytes(locationRef, file);
        // 업로드된 파일이 저장되는 폴더명과 파일명 지정 가능
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      // 업로드 되면 리셋
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      method="POST"
      data-email="rhoeb21@gmail.com"
      action="https://script.google.com/macros/s/AKfycbwqKzSaQPyRgiZCD6oguubSea5NtIuUo21MImNQQFpQyOe4LbDsBuqO12zPBveY2QRKXQ/exec"
      target="frAttachFiles"
    >
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening??!!"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
