import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { Commons } from "../../utils/Common";

const ChatContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  font-size: 1.5em;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  overflow-y: auto;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
`;

const Message = styled.div`
  max-width: 60%;
  padding: 10px;
  margin: 10px;
  border-radius: 20px;
  background-color: ${(props) => (props.isSender ? "#DCF8C6" : "#E0E0E0")};
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
  border: ${(props) =>
    props.isSender ? "1px solid #DCF8C6" : "1px solid #E0E0E0"};
`;

const Input = styled.input`
  padding: 10px;
  width: 70%;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
const CloseButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Chatting = () => {
  const [socketConnected, setSocketConnected] = useState(false); // 웹소켓 연결여부
  const [inputMsg, setInputMsg] = useState(""); // 입력 메세지
  const [chatList, setChatList] = useState([]); // 채팅 목록
  const { roomId } = useParams(); // 구조분해, 채팅방 번호, 새로운 방 개설, 기존의 방에 대한 진입시도
  const [sender, setSender] = useState(""); // 보낸사람
  const [roomName, setRoomName] = useState(""); // 채팅방 이름
  const ws = useRef(null); // 웹소켓 객체생성, 소켓 연결 정보를 유지해야 하지만 렌더링과는 무관
  const navigate = useNavigate(); //
  const email = localStorage.getItem("email");

  const onChangeMsg = (e) => {
    setInputMsg(e.target.value);
  };

  // 메세지 전송
  const onClickMsgSend = (e) => {
    ws.current.send(
      JSON.stringify({
        type: "TALK",
        roomId: roomId,
        sender: sender,
        message: inputMsg,
      })
    );
    setInputMsg(""); // 전송이후 입력창 지우기
  };

  const onEnterKey = (e) => {
    // 엔터키 입력 시, 공백 제거 후 비어있지 않으면
    if (e.key === "Enter" && inputMsg.trim() !== "") {
      e.preventDefault(); // 기존 이벤트 무시
      onClickMsgSend(e);
    }
  };

  // 채팅종료
  const onClickMsgClose = () => {
    ws.current.send(
      JSON.stringify({
        type: "CLOSE",
        roomId: roomId,
        sender: sender,
        message: "종료 합니다.",
      })
    );
    ws.current.close();
    navigate("/chatList"); // 채팅 목록 이동
  };

  // 이메일로 회원 정보 가져 오기
  useEffect(() => {
    const getMember = async () => {
      try {
        const response = await AxiosApi.memberInfo(email);
        console.log(response.data.name);
        setSender(response.data.name);
      } catch (e) {
        console.log(e);
      }
    };
    getMember();
  }, []);

  // 채팅방 정보 가져오기
  useEffect(() => {
    const getChatRoom = async () => {
      try {
        const response = await AxiosApi.chatDetail(roomId);
        console.log(response.data.name);
        setRoomName(response.data.name);
      } catch (e) {
        console.log(e);
      }
    };
    getChatRoom();
  }, []);

  // 웹소켓 연결하기
  useEffect(() => {
    console.log("방번호: " + roomId);
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:8111/ws/chat");
      ws.current.onopen = () => {
        setSocketConnected(true);
      };
    }
    if (socketConnected) {
      ws.current.send(
        JSON.stringify({
          type: "ENTER",
          roomId: roomId,
          sender: sender,
          message: "입장 합니다.",
        })
      );
    }
    console.log(1);
    ws.current.onmessage = (msg) => {
      console.log(msg);
      const data = JSON.parse(msg.data);
      setChatList((prev) => [...prev, data]); // 기존의 채팅 리스트에 새로운 메세지 추가
    };
  }, [socketConnected]);

  // 화면 하단으로 자동 스트롤
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <ChatContainer>
      <ChatHeader>채팅방 {roomName}</ChatHeader>
      <MessagesContainer ref={chatContainerRef}>
        {chatList.map((chat, index) => (
          <Message key={index} isSender={chat.sender === sender}>
            {`${chat.sender} > ${chat.message}`}
          </Message>
        ))}
      </MessagesContainer>
      <div>
        <Input
          placeholder="문자 전송"
          value={inputMsg}
          onChange={onChangeMsg}
          onKeyUp={onEnterKey}
        />
        <SendButton onClick={onClickMsgSend}>전송</SendButton>
      </div>
      <CloseButton onClick={onClickMsgClose}>채팅 종료 하기</CloseButton>
    </ChatContainer>
  );
};
export default Chatting;
