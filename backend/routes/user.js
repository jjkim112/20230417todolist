const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();

const client = new PrismaClient();

//유저생성

router.post("/", async (req, res) => {
  try {
    const { account } = req.body;
    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (existUser) {
      return res
        .status(400)
        .json({ ok: false, error: "Already exist account." });
    }
    //이미 존재하는 유저 처리 안하면 즉 예외처리 안하면 백엔드 서버에서 무한 로딩이 발생한다, 어카운트가 유니크값으로 프리즈마에서 정의해서 중복으로 만들어지지는 않지만 무한로딩이 발생한다
    const user = await client.user.create({
      data: {
        account: account,
      },
    });
    res.json({ ok: true, user });
  } catch (error) {
    console.error(error);
  }
});

// // 유저임시조회
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(id);

//     res.send("임시");
//   } catch (error) {
//     console.error(error);
//   }
// });

//유저조회
router.get("/:account", async (req, res) => {
  try {
    const { account } = req.params;
    //엑시오스에서는 바디로 겟요청이 안될거라고 하심 그래서 주소로 받는 파라미터 방법을 쓴다고하심
    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        error: "Not exist user.",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
