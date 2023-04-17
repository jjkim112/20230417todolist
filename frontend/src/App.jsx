import { useEffect, useState } from "react";
import Login from "./components/Login";
import TodoCard from "./components/TodoCard";
import axios from "axios";
import CreateTodo from "./components/CreateTodo";

function App() {
  const [user, setUser] = useState();
  const [todos, setTodos] = useState();

  const getTodos = async () => {
    try {
      if (!user) {
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/${user.id}`
      );

      setTodos(response.data.todos);
    } catch (error) {
      console.error(error);
      alert("투두리스트를 불러오지 못했습니다.");
    }
  };

  const onClickLogOut = () => {
    setUser(undefined);
  };

  useEffect(() => {
    //처음에는 user에 초기값이 없어서 렌더링될때 유즈이펙트가 실행되긴하는데 user정보가 없어서 리턴되서 함수 나간다.
    //근데 이것을 겟투두에 넣어도될것 같다고하셔서 안에 넣음
    //로그인을 하게되면 login.jsx에서 setUser를 통해 user정보가 생기게 된다. 근데 해당 유저정보에따른 투두리스트를
    //서버에서 가져올때 비동기 함수를 써야하는데 유즈이펙트에서는 쓰지못하므로 밖에서 정의한다

    getTodos();
    console.log(user);
  }, [user]);

  if (!user) {
    return <Login setUser={setUser} />;
  }
  //로그인 페이지 로그인 성공하면 아래 리턴값을 보여주기

  return (
    <div className="min-h-screen flex flex-col justify-start items-center pt-16">
      <h1 className="text-4xl font-bold flex items-center">
        AWESOME TO DO LIST {user.account}님 환영합니다~ 😎{" "}
        <button
          className="ml-4 px-2 py-1 bg-pink-200 hover:bg-pink-400 rounded-lg text-gray-50 text-base"
          onClick={onClickLogOut}
        >
          로그아웃
        </button>
      </h1>
      <div>
        <div className="mt-8 text-sm font-semibold">
          If I only had an hour to chop down a tree, I would spend the first 45
          minutes sharpening my axe, Abrabam Lincoln
        </div>
        <div className="text-xs">
          나무 베는데 한 시간이 주어진다면, 도끼를 가는데 45분을 쓰겠다,
          에비브러햄 링컨
        </div>
        {/* <CreateTodo userId={user.id} getTodos={getTodos} /> */}
        {/* 이렇게하면 기존 데이터도 모두 다시 다끌고와서/getTodo/ 데이터 낭비라고하심 그래서 다른방법인 아래방법으로 사용 그것은 스프레드방법 기존껀 펼치고 새로운것만 추가한다 push같은 기능*/}
        <CreateTodo userId={user.id} setTodos={setTodos} todos={todos} />
      </div>
      <div className="mt-16 flex flex-col w-1/2">
        {todos &&
          todos.map((v, i) => {
            return <TodoCard key={i} todo={v.todo} isDone={v.isDone} />;
          })}
      </div>
    </div>
  );
}

export default App;
