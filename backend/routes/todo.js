const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const client = new PrismaClient();

//투두 생성
router.post("/", async (req, res) => {
  try {
    const { todo, userId } = req.body;
    //프론트앤드 즉 클라이언트한테서 받아오는 값

    if (!todo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }

    if (!userId) {
      return res.status(400).json({ ok: false, error: "Not exist userId." });
    }

    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    //유저가 account로 로그인하면 백엔드가 그 계정에대한 id값을 보내준다즉 프론트에서는 그 acoount에 대한 id를 알게 되고 이제 다시 유저가 요청할때 그 요청한 아이디에 해당하는 id값을 백엔드에게 요청할 수있게되어서 userId로 받는것처럼 작성하였다
    if (!user) {
      return res.status(400).json({ ok: false, error: "Not exist user" });
    }
    const newTodo = await client.todo.create({
      data: {
        todo: todo,
        isDone: false,
        userId: user.id,
      },
    });

    res.json({ ok: true, todo: newTodo });
  } catch (error) {
    console.error(error);
  }
});
//투두 조회
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skip } = req.query;
    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(400).json({ ok: false, error: "Not exist user." });
    }

    const todos = await client.todo.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
        //desc내림차순, asc오름차순
      },
      skip: parseInt(skip),
      take: 3,
      //이건 게시판 기능 한 페이지에 몇개만 보여줄지 parseint를 해야 한다고하심
    });

    res.json({ ok: true, todos });
  } catch (error) {
    console.error(error);
  }
});
// 투두 완료
router.put("/:id/done", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    //id를 통해서 투두가 존재하는지? 확인
    const existTodo = await client.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existTodo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (existTodo.userId !== parseInt(userId)) {
      return res.status(400).json({ ok: false, error: "U R not todo owner." });
    }

    // console.log(existTodo);
    // res.send("임시");

    //id를 통해서 투두의 상태 값을 확인

    const updatedTodo = await client.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isDone: !existTodo.isDone,
        //existTodo에는 그 todo id에 해당하는 값들이 객체가 담김 거기의 isdone에 값을 바꾸기 위해 ! 넣기
      },
    });

    res.json({ ok: true, todo: updatedTodo });
  } catch (error) {
    console.error(error);
  }
});

// 투두 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    //자기 투두가 아닌것을 삭제하는것을 방지하기 위해 userid를 받는다
    const existTodo = await client.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existTodo) {
      return res.status(400).json({ ok: false, error: "Not exist todo." });
    }
    if (existTodo.userId !== parseInt(userId)) {
      return res.status(400).json({ ok: false, error: "U R not todo owner." });
    }

    const deletedTodo = await client.todo.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ ok: true, todo: deletedTodo });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
