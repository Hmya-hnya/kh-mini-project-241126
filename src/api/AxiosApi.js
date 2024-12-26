import axios from "axios";
const KH_DOMAIN = "http://localhost:8111";

const AxiosApi = {
  login: async (email, pw) => {
    console.log("이메일: ", email);
    console.log("비밀번호: ", pw);
    const login = {
      email: email,
      pwd: pw,
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
      pwd: pw,
      name: name,
      imgPath: "",
    };
    return await axios.post(KH_DOMAIN + `/auth/signup`, member);
  },
  // 전체 회원 조회
  memberList: async () => {
    return await axios.get(KH_DOMAIN + "/members/memberList");
  },
  // 개별 회원 조회
  memberInfo: async (email) => {
    return await axios.get(KH_DOMAIN + `/members/${email}`);
  },
  // 채팅방 목록 가져오기
  chatList: async () => {
    return await axios.get(KH_DOMAIN + "/chat/list");
  },
  // 채팅방 생성하기
  chatCreate: async (email, name) => {
    const chat = {
      emial: email,
      name: name,
    };
    return await axios.post(KH_DOMAIN + "/chat/new", chat);
  },
};

export default AxiosApi;
