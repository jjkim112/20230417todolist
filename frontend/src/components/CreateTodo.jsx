import axios from "axios";
import { useState } from "react";

const CreateTodo = ({ userId, setTodos, todos }) => {
  const [todo, setTodo] = useState("");
  //onchange 오류나면 빈값 넣으라고하심
  const onSubmitCreateTodo = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/todo`,
        {
          todo: todo,
          userId: userId,
        }
      );
      // getTodos 이거 데이터 낭비라고 다르게 한다고하심 그래서 기존 데이터는 그대로 펼침으로써 백엔드랑 한번 더 통신하는것을 줄인다.
      setTodos([response.data.todo, ...todos]);
      //스프레드는 순서바꾸면 그 순서뒤에 추가되는 형태로 된다. 즉 새로 추가하는게 배열 제일 처음으로 온다 이렇게쓰면
      setTodo("");
    } catch (error) {
      console.error(error);
      alert("투두 생성중 에러가 발생하였습니다.");
    }
  };

  return (
    <form className="flex mt-2" onSubmit={onSubmitCreateTodo}>
      <input
        className="grow border-2 border-pink-200 rounded-lg focus:outline-pink-400 px-2 py-1 text-lg"
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <input
        className="ml-4 px-2 py-1 bg-pink-400 rounded-lg text-gray-50"
        type="submit"
        value="새 투두 생성"
      />
    </form>
  );
};

export default CreateTodo;
