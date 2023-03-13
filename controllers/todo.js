const TodoTask = require("../models/todoTask");

var moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

exports.get = (req, res, next) => {
  console.log("-----------!!Todo!!-----------");
  TodoTask.find({}, null, { sort: { date: -1 } })
    .then((tasks) => {
      res.render("todo", { todoTasks: tasks }); // filter : {} => 모든 데이터, projection : null => 결과값의 표시할 값 X
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/todo");
    });
};

exports.write = async (req, res, next) => {
  try {
    // 새로운 Task를 생성
    const todoTask = new TodoTask({
      content: req.body.content,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    await todoTask.save();
    console.log("==== Success!! Save New TodoTask ====");
    console.table([
      { id: todoTask._id, content: todoTask.content, data: todoTask.date },
    ]);
    res.redirect("/todo");
  } catch (err) {
    console.error("==== Fail !! Save TodoTask ====");
    res.redirect("/todo");
  }
};

exports.edit = (req, res, next) => {
  const id = req.params.id;
  TodoTask.find({}, null, { sort: { date: -1 } })
    .then((tasks) => {
      res.render("todo-edit", { todoTasks: tasks, idTask: id });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/todo");
    });
};

exports.update = (req, res, next) => {
  const id = req.params.id;
  TodoTask.findByIdAndUpdate(id, { content: req.body.content })
    .then(() => {
      console.log("==== Success!! Update TodoTask ====");
      console.log(`id: ${id} \nchanged content: ${req.body.content}`);
      res.redirect("/todo");
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/todo");
    });
};

exports.remove = (req, res, next) => {
  const id = req.params.id;
  TodoTask.findByIdAndDelete(id)
    .then(() => {
      console.log("==== Success!! Delete TodoTask ====");
      console.log(`id: ${id}`);
      res.redirect("/todo");
    })
    .catch((err) => {
      console.log("==== Fail!! Delete TodoTask ====");
      console.error(err);
      res.redirect("/todo");
    });
};
