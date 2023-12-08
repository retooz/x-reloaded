import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Edit = styled.textarea`
  display: block;
  margin: 10px 0px;
  border: 2px solid gray;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const Button = styled.button`
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &.delete-button {
    background-color: tomato;
  }
  &.edit-button {
    background-color: #1d9bf0;
  }
`;

export default function Tweet({ username, photo, tweet, userID, id }: ITweet) {
  const [edit, setEdit] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [isLoading, setIsLoading] = useState(false);

  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm('정말 삭제하시겠어요?');
    if (!ok || user?.uid !== userID) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onEdit = async () => {
    if (!edit) {
      setEdit(true);
    } else {
      const ok = confirm('수정하시겠습니까?');
      if (ok) {
        setIsLoading(true);
        const docRef = doc(db, `tweets/${id}`);
        await updateDoc(docRef, {
          tweet: editTweet,
        });
      }
      setIsLoading(false);
      setEdit(false);
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {!edit ? (
          <Payload>{tweet}</Payload>
        ) : isLoading ? (
          <Edit
            rows={5}
            maxLength={180}
            onChange={onChange}
            value={editTweet}
            required
            disabled
          ></Edit>
        ) : (
          <Edit
            rows={5}
            maxLength={180}
            onChange={onChange}
            value={editTweet}
            required
          ></Edit>
        )}
        {user?.uid === userID ? (
          <>
            <Button className='edit-button' onClick={onEdit}>
              edit
            </Button>
            <Button className='delete-button' onClick={onDelete}>
              delete
            </Button>{' '}
          </>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
