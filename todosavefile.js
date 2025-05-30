const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

var todo = [{
  id: 0,
  Job: "Washing Clothes",
  Description: "Wash the clothes",
  Completed: true
}];

// Load from file if exists
const rawData = fs.readFileSync("data.json", "utf8");
if (rawData.trim() !== "") {
  todo = JSON.parse(rawData);
}


// Save to file function
function saveToFile() {
  fs.writeFileSync("data.json", JSON.stringify(todo, null, 2), "utf8");
}

app.get("/todos", function (req, res) {
  res.json({ todo });
});

app.get("/todos/:id", function (req, res) {
  const id = req.params.id;
  var tem;
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].id == id) {
      tem = todo[i];
    }
  }
  if (!tem) {
    res.status(404).json({
      error: "ID not found"
    });
  } else {
    res.json({ tem });
  }
});

app.post("/todos", function (req, res) {
  const data = req.body;
  var tem = todo.length + 1;
  todo.push({
    id: tem,
    Job: data.title,
    Description: data.description,
    Completed: data.completed
  });
  saveToFile();
  res.json({
    msg: `Created with id ${tem}`
  });
});

app.put("/todos/:id", function (req, res) {
  const id = req.params.id;
  const data = req.body;
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].id == id) {
      todo[i].Job = data.title;
      todo[i].Completed = data.completed;
      saveToFile();
      return res.json({
        msg: "Done!"
      });
    }
  }
  return res.json({
    error: "Desired Id is not Found"
  });
});

app.delete("/todos/:id", function (req, res) {
  const id = req.params.id;
  var ew = [];
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].id == id) {
      continue;
    } else {
      ew.push(todo[i]);
    }
  }
  todo = ew;
  saveToFile();
  res.json({ msg: "Deleted (if existed)" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
