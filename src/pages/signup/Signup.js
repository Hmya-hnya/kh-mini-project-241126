import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi.js";
import {
  Input,
  Button,
  Container,
  Items,
} from "../../component/signup/LoginComponent";

const Signup = () => {
  const navigate = useNavigate();

  // 입력값 상태
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // 검증 메시지 상태
  const [validationMessages, setValidationMessages] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 검증 상태
  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    name: false,
  });

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    switch (name) {
      case "email":
        validateEmail(value);
        break;
      case "password":
        validatePassword(value);
        break;
      case "confirmPassword":
        validateConfirmPassword(value);
        break;
      case "name":
        setIsValid((prevValid) => ({
          ...prevValid,
          name: value.trim().length > 0,
        }));
        break;
      default:
        break;
    }
  };

  // 검증 함수
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        email: "이메일 형식이 올바르지 않습니다.",
      }));
      setIsValid((prevValid) => ({ ...prevValid, email: false }));
    } else {
      memberRegCheck(email);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegex.test(password)) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        password: "숫자+영문자 조합으로 8자리 이상 입력해주세요!",
      }));
      setIsValid((prevValid) => ({ ...prevValid, password: false }));
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        password: "안전한 비밀번호에요 : )",
      }));
      setIsValid((prevValid) => ({ ...prevValid, password: true }));
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== formData.password) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        confirmPassword: "비밀 번호가 일치하지 않습니다.",
      }));
      setIsValid((prevValid) => ({ ...prevValid, confirmPassword: false }));
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        confirmPassword: "비밀 번호가 일치 합니다. )",
      }));
      setIsValid((prevValid) => ({ ...prevValid, confirmPassword: true }));
    }
  };

  // 회원 가입 여부 확인
  const memberRegCheck = async (email) => {
    try {
      const resp = await AxiosApi.memberRegCheck(email);
      if (resp.data === true) {
        setValidationMessages((prevMessages) => ({
          ...prevMessages,
          email: "사용 가능한 이메일 입니다.",
        }));
        setIsValid((prevValid) => ({ ...prevValid, email: true }));
      } else {
        setValidationMessages((prevMessages) => ({
          ...prevMessages,
          email: "중복된 이메일 입니다.",
        }));
        setIsValid((prevValid) => ({ ...prevValid, email: false }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 회원 가입 처리
  const handleRegistration = async () => {
    const { email, password, name } = formData;
    try {
      const memberReg = await AxiosApi.memberReg(email, password, name);
      if (memberReg.data === true) {
        navigate("/");
      } else {
        alert("회원 가입에 실패 했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Items className="sign">
        <span>Sign Up</span>
      </Items>

      <Items className="item2">
        <Input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleInputChange}
        />
        {formData.email && (
          <span className={`message ${isValid.email ? "success" : "error"}`}>
            {validationMessages.email}
          </span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="password"
          name="password"
          placeholder="패스워드"
          value={formData.password}
          onChange={handleInputChange}
        />
        {formData.password && (
          <span className={`message ${isValid.password ? "success" : "error"}`}>
            {validationMessages.password}
          </span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="password"
          name="confirmPassword"
          placeholder="패스워드 확인"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {formData.confirmPassword && (
          <span
            className={`message ${
              isValid.confirmPassword ? "success" : "error"
            }`}
          >
            {validationMessages.confirmPassword}
          </span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Items>

      <Items className="item2">
        {isValid.email &&
        isValid.password &&
        isValid.confirmPassword &&
        isValid.name ? (
          <Button onClick={handleRegistration}>NEXT</Button>
        ) : (
          <Button disabled>NEXT</Button>
        )}
      </Items>
    </Container>
  );
};

export default Signup;
