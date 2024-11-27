import { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMemberList = async () => {
      try {
        const response = await AxiosApi.memberList();
        console.log(response.data);
        setMembers(response.data); // 서버에서 받은 데이터를 상태에 저장
      } catch (e) {
        alert("서버가 응답하지 않습니다." + e);
      }
    };
    fetchMemberList();
  }, []);

  return (
    <>
      <h1>Home</h1>
      <h4>회원 리스트</h4>
      <br />
      <tr>
        <th>이름</th>
        <th>이메일</th>
        <th>가입일</th>
      </tr>
      {members &&
        members.map((member) => (
          <tr key={member.email}>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.date}</td>
          </tr>
        ))}

      {/* {members.length > 0 ? (
        <ul>
          {members.map((member) => (
            <li
              key={member.id}
            >{`- 이름: ${member.name}|| 이메일: ${member.email}`}</li>
          ))}
        </ul>
      ) : (
        <p>회원 정보가 없습니다.</p>
      )} */}
    </>
  );
};

export default Home;
