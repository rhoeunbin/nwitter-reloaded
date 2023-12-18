import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const NickName = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const EditButton = styled.button`
  background-color: #ff9447;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.displayName);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      // avatars라는 폴더에 유저 id로 사진을 업로드 => 유저가 새로운 유저 이미지를 업로드할 때 해당 이미지를 덮어쓰기 가능
      const result = await uploadBytes(locationRef, file);
      // 사진을 업로드 했을 때 url을 가져오고
      const avatarUrl = await getDownloadURL(result.ref);
      // url을 state 에 할당
      setAvatar(avatarUrl);
      // 유저 이미지가 바뀜
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  // 프로필에서 현재 로그인한 사용자의 글들만 가져오는 기능
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"), // 모든 트윗 중에서
      where("userId", "==", user?.uid), // 현재 로그인한 사용자와 같다면 => 다양한 연산자 사용 가능
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  // 낙네임 수정
  const onEdit = async () => {
    if (!user) {
      return;
    }
    if (edit) {
      await updateProfile(user, {
        displayName: name,
      });
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

  return (
    <Wrapper>
      {/* 파일 열기 가능 */}
      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar) ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      ></AvatarInput>
      <NickName>
        {edit ? (
          <input value={name || ""} onChange={(e) => setName(e.target.value)} />
        ) : (
          <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name>
        )}
        <EditButton onClick={onEdit}>{edit ? "save" : "edit"}</EditButton>
      </NickName>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
