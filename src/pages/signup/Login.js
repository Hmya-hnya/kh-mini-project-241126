import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "axios";
import { Button, TextField } from "@material-ui/core";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-top: 10px;
    width: 300px;
  }
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 20px;
    width: 300px;
  }
`;

const Login = () => {
  // 키보드 입력에 대한 상태관리

  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");

  // 간단한 유효성 검사
  const [isEmail, setIsEmail] = useState(false);
  const [isPw, setIsPw] = useState(false);

  const navigate = useNavigate(); // 페이지 이동을 위한 객체 생성

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setInputEmail(email);
    setIsEmail(emailRegex.test(email));
  };

  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const onChangePw = (e) => {
    const password = e.target.value;
    setInputPw(password);
    setIsPw(passwordRegex.test(password));
  };

  const onClickLogin = async (e) => {
    e.preventDefault();
    // 로그인을 위해 axios호출
    try {
      const rsp = await AxiosApi.memberLogin(inputEmail, inputPw);
      console.log(rsp.data);
      if (rsp.data) {
        localStorage.setItem("email", inputEmail);
        localStorage.setItem("isLogin", "TRUE");
        navigate("/home");
      } else {
        // 서버의 응답을 줬지만 성공이 아닌 경우
        alert("아이디 및 패스워드를 다시 확인 해 주세요.");
      }
    } catch (e) {
      // 서버가 응답하지 않는 경우
      alert("서버가 응답하지 않습니다.");
    }
  };
  return (
    <Container>
      <StyledTextField
        value={inputEmail}
        placeholder="이메일"
        onChange={onChangeEmail}
      />
      <br />
      <StyledTextField
        value={inputPw}
        placeholder="비밀번호"
        onChange={onChangePw}
        type="password"
      />
      <br />
      {isEmail && isPw ? (
        <StyledButton onClick={onClickLogin}>확인</StyledButton>
      ) : (
        <StyledButton disabled onClick={onClickLogin}>
          확인
        </StyledButton>
      )}
    </Container>
  );
};
export default Login;
