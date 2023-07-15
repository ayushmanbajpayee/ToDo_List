//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ayushmanbajpayee10:bMpaHotjQpr17TFA@cluster0.paelz6n.mongodb.net/todolistDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true
})


  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, function () {
      console.log("Server started on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];
// Item.insertMany(defaultItems)
//   .then(() => {
//     console.log("Successfully saved default items to DB.");
//   })
//   .catch((err) => {
//     if (err.writeErrors && err.writeErrors.length > 0) {
//       console.log(err.writeErrors);
//     } else {
//       console.log(err);
//     }
//   });
 const listSchema={
    name:String,
    items:[itemsSchema]
  };
  const List = mongoose.model("List",listSchema);
app.get("/", function (req, res) {
  Item.find({})
    .then(foundItems => {
      if(foundItems.length===0){
        Item.insertMany(defaultItems)
        .then(() => {
          console.log("Successfully saved default items to DB.");
        })
        .catch((err) => {
          if (err.writeErrors && err.writeErrors.length > 0) {
            console.log(err.writeErrors);
          } else {
            console.log(err);
          }
        });
        res.redirect("/");

      }
      // console.log(foundItems);
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    })
    .catch(error => {
      console.error("Error finding items:", error);
    });
});

app.get("/:customListName", function(req,res){
      const customListName=req.params.customListName;

      List.findOne({name: customListName},function(err,foundList){
      if(!err){
        if(!findList){
         console.log("Doesnt exist");
        }
        else{
          console.log("Exists");
        }
      }
      })




      const list =new List({
        name: customListName,
        items: defaultItems
      });

    list.save();
});
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  }); 
  item.save(); 

  res.redirect("/");

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete",function(req,res){
  //  console.log(req.body.checkbox);
   const checkedItemId=req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
    )
    .catch(error => {
      console.error("Error deleting checked item:", error);
    })
});


app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3001, function () {
  console.log("Server started on port 3000");
});
