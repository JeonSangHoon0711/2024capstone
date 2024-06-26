"use client"
"use client"
import React, { useState } from 'react';
import axios from 'axios';
import Header from "../Header/page";
import LeftSidebar from '../LeftSidebar/page';
import RightSidebar from '../RightSidebar/page';
import Footer from '../Footer/page';
import './registerpage.css';

const RegisterPage: React.FC = () => {
  // 상태 관리
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(''); // id 필드 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // 사용자 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'name') setName(value);
    else if (id === 'userId') setUserId(value); // id 필드 처리 추가
    else if (id === 'email') setEmail(value);
    else if (id === 'password') setPassword(value);
    else if (id === 'passwordConfirmation') setPasswordConfirmation(value);
  };

  // 폼 제출 처리
// 폼 제출 처리
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // 기본 제출 동작 방지
  // 비밀번호 확인
  if (password !== passwordConfirmation) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  // API 요청
  try {
    const response = await axios.post('http://localhost:8080/api/users/register', {
      name,
      id: userId, // id 필드 추가
      pw: password, // password 대신 pw 사용
    });
    console.log(response);
    alert('회원가입 성공');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError의 경우
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data;
        if (errorMessage.includes("Name is already taken")) {
          alert('이미 사용 중인 이름입니다.');
        } else if (errorMessage.includes("ID is already taken")) {
          alert('이미 사용 중인 아이디입니다.');
        } else {
          alert('회원가입 실패: ' + errorMessage);
        }
      } else {
        console.error(error);
        alert('회원가입 실패');
      }
    } else if (error instanceof Error) {
      // 일반적인 Error 인스턴스인 경우
      console.error(error.message);
      alert('회원가입 실패: ' + error.message);
    } else {
      // 그 외 알 수 없는 오류의 경우
      console.error('알 수 없는 오류', error);
      alert('알 수 없는 오류로 회원가입 실패');
    }
  }
};

  return (
    <div className="App">
      <Header />
      <div className="container">
          <LeftSidebar />
          <div className='registercontent'>
          <form className='signupForm' onSubmit={handleSubmit}>
            {/* 이름 입력 필드 */}
            <div className='formRow'>
              <label htmlFor="name">이름  </label>
              <input type="text" id="name" value={name} onChange={handleInputChange} />
            </div>
            <br/>
            {/* 아이디 입력 필드 */}
            <div className='formRow'>
              <label htmlFor="userId">아이디  </label>
              <input type="text" id="userId" value={userId} onChange={handleInputChange} />
            </div>
            <br/>
            {/* 비밀번호 입력 필드 */}
            <div className='formRow'>
              <label htmlFor="password"> 비밀번호 </label>
              <input type="password" id="password" value={password} onChange={handleInputChange} />
            </div>
            <br/>
            {/* 비밀번호 확인 입력 필드 */}
            <div className='formRow'>
              <label htmlFor="passwordConfirmation">비밀번호 확인 </label>
              <input type="password" id="passwordConfirmation" className='inputField' value={passwordConfirmation} onChange={handleInputChange} />
            </div>
            <button type="submit" className='submitButton'>
              회원가입
            </button>
          </form>
          </div>
          <RightSidebar />
      </div>
      <Footer/>
    </div>
  );
};

export default RegisterPage;
