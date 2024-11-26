import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import imgLogo from "../../images/kakaoLion.png"; //이미지도 import하여야 사용 가능
import Button from "../../components/ButtonComponent";
import Input from "../../components/InputComponent";
import { Container, Items } from "../../components/SignupComponent";
import AxiosApi from "../../api/AxiosApi";

const Img = styled.img`
  width: 180px;
  object-fit: cover;
`;

const Login = () => {
  // State for inputs
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");

  const navigate = useNavigate();

  // State for validation
  const [isId, setIsId] = useState(false);
  const [isPw, setIsPw] = useState(false);

  // Email and Password change handlers
  const handleInputChange = (e, setState, setValidState) => {
    setState(e.target.value);
    setValidState(e.target.value.length >= 5);
  };

  const onClickLogin = async () => {
    try {
      const rsp = await AxiosApi.login(inputEmail, inputPw);
      console.log(rsp.data);
      if (rsp.data) {
        navigate("/home");
      } else {
        alert("아이디 및 패스워드가 틀립니다.");
      }
    } catch (e) {
      alert("서버가 응답하지 않습니다.");
    }
  };

  return (
    <Container>
      <Items variant="sign">
        <Img src={imgLogo} alt="Logo" />
      </Items>

      <Items margin="10px">
        <Input
          placeholder="이메일"
          value={inputEmail}
          onChange={(e) => handleInputChange(e, setInputEmail, setIsId)}
        />
      </Items>

      <Items margin="10px">
        <Input
          type="password"
          placeholder="패스워드"
          value={inputPw}
          onChange={(e) => handleInputChange(e, setInputPw, setIsPw)}
        />
      </Items>

      <Items margin="10px">
        {isId && isPw ? (
          <Button enabled onClick={onClickLogin}>
            SIGN IN
          </Button>
        ) : (
          <Button disabled>SIGN IN</Button>
        )}
      </Items>

      <Items variant="signup">
        <Link to="/Signup" className="link_style">
          <span>Sign Up</span>
        </Link>
      </Items>
    </Container>
  );
};

export default Login;
