const express = require("express");
const cors = require("cors");
const app = express();
const useRouter = require("./routes/user");
const toDoRouter = require("./routes/todo");
const port = 3010;

app.use(cors());
app.use(express.json());
app.use("/user", useRouter);
app.use("/todo", toDoRouter);
app.get("/", (req, res) => {
  res.send("hi man");
});

app.listen(port, () => {
  console.log(`Server listening on port : ${port} 🦉`);
});
