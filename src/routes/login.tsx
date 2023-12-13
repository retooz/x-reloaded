import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-btn';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '' || password === '') return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name='email'
          value={email}
          placeholder='Email'
          type='email'
          required
        />
        <Input
          onChange={onChange}
          name='password'
          value={password}
          placeholder='Password'
          type='password'
          required
        />
        <Input
          type='submit'
          value={isLoading ? '로딩중...' : '로그인'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으세요? {' '}
        <Link to='/create-account'>계정 생성하기 &rarr;</Link>
      </Switcher>
      <GithubButton/>
    </Wrapper>
  );
}
