import { createContext, useEffect, useState } from "react";
export const UserContext = createContext(null);

const UserStore = (props) => {
  // 배경색에 대한 전역 상태 관리, 새로고침 문제를 해결하기 위해 localStorage 사용
  const [color, setColor] = useState(
    localStorage.getItem("bgcolor") || "orange"
  );
  const [name, setName] = useState(
    localStorage.getItem("name") || "이름을 입력 해 주세요"
  );
  // 색상 변경 -> useEffect에서 감지 -> local에 저장? 이후 읽을 때 localStorage의 값을 먼저 읽음
  useEffect(() => {
    localStorage.getItem("bgcolor", color);
  }, [color]);
  // 동일하게 name이 변경 될 경우 작용
  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);
  return (
    <UserContext.Provider value={{ color, setColor, name, setName }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default UserStore;
