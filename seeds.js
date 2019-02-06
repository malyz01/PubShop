const mongoose = require("mongoose");
const Item = require("./models/item");
const Comment = require("./models/comments");

const data = [
  {
    name: "Drone",
    image:
      "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
    description: "Can operate for more than 10mins but less than 20mins max"
  },
  {
    name: "Polaroid",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description: "Realiable polaroid camera. Can print photos anywhere"
  },
  {
    name: "Pen",
    image:
      "https://images.unsplash.com/photo-1531087131490-07836ca4341d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description: "Late Uncle's Pen he gave me before he passed"
  }
];

seedDB = () => {
  Item.deleteMany({}, err => {
    if (!err) {
      console.log("removed all items");
      Item.insertMany(data, (err, items) => {
        if (!err) {
          console.log(`added: ${items}`);
          Comment.create(
            {
              text: "testing 1234",
              author: "Homer"
            },
            (err, comment) => {
              if (!err) {
                items.map(item => {
                  item.comments.push(comment);
                  item.save();
                  console.log(`Added comment for each items: ${item}`);
                });
              }
            }
          );
        }
      });
    }
  });
};

module.exports = seedDB;
