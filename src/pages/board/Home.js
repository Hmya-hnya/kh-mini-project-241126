import { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi";

const Home = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMemberList = async () => {
      const response = await AxiosApi.memberList();
      setMembers(response.data); // 서버에서 받은 데이터를 상태에 저장
    };
    fetchMemberList();
  }, []);
  return (
    <div>
      <h1>Home</h1>
      <p>여기가 Home입니다.</p>
      {members.length > 0 ? (
        <ul>
          {members.map((member) => (
            <li key={member.id}>{`${member.name} (${member.email})`}</li>
          ))}
        </ul>
      ) : (
        <p>회원 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default Home;
