import axios from "axios";
const KH_DOMAIN = "http://localhost:8111";

const AxiosApi = {
  login: async (email, pw) => {
    console.log("이메일: ", email);
    console.log("비밀번호: ", pw);
    const login = {
      email: email,
      password: pw,
    };
    return await axios.post(KH_DOMAIN + "/auth/login", login);
  },
  // 가입 여부 확인
  regCheck: async (email) => {
    return await axios.get(KH_DOMAIN + `/auth/exists/${email}`);
  },
  signup: async (email, pw, name) => {
    console.log("이메일: ", email);
    console.log("비밀번호: ", pw);
    console.log("이름: ", name);
    const member = {
      email: email,
      password: pw,
      name: name,
    };
    return await axios.post(KH_DOMAIN + `/auth/signup`, member);
  },
  memberList: async () => {
    return await axios.get(KH_DOMAIN + "/auth/memberAll");
  },
  // 개별 회원 조회
  memberInfo: async (email) => {
    return await axios.get(KH_DOMAIN + `/auth/${email}`);
  },
};

export default AxiosApi;
