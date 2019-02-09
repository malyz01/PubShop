const mongoose = require("mongoose");
const Item = require("./models/item");

const data = [
  {
    name: "Dumbells",
    price: "20",
    image:
      "https://images.unsplash.com/photo-1493690283958-32df2c86326e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1348&q=80",
    description: "8kg Dumbells",
    createdAt: 1549678442656,
    author: {
      id: "5c5b5f012beda875f037ef4e",
      username: "matt"
    }
  },
  {
    name: "Bike",
    price: "150",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "Barely used",
    createdAt: 1549678441656,
    author: {
      id: "5c5b5f012beda875f037ef4e",
      username: "matt"
    }
  },
  {
    name: "Scooter",
    price: "499",
    image:
      "https://images.unsplash.com/photo-1495608312049-285ae516323d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
    description: "Smooth ride!",
    createdAt: 1549698440656,
    author: {
      id: "5c5b5f012beda875f037ef4e",
      username: "matt"
    }
  },

  {
    name: "Camera",
    price: "799",
    image:
      "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "picture perfect!",
    createdAt: 1549688444656,
    author: {
      id: "5c5bcaa6da53787d94ac4c01",
      username: "champ"
    }
  },
  {
    name: "Cellphone",
    price: "899",
    image:
      "https://images.unsplash.com/photo-1439219970881-3727d2e3402a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "Used but feels new",
    createdAt: 1549677445656,
    author: {
      id: "5c5bcaa6da53787d94ac4c01",
      username: "champ"
    }
  },
  {
    name: "Laptop",
    price: "1599",
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80",
    description: "Specs: i7 Intel 8th Generation, 770gtx Nvidia GPU",
    createdAt: 1549648446656,
    author: {
      id: "5c5d329b045be79704509e20",
      username: "user123"
    }
  },
  {
    name: "Table",
    price: "80",
    image:
      "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1336&q=80",
    description: "New! not yet used!",
    createdAt: 1549673447656,
    author: {
      id: "5c5d329b045be79704509e20",
      username: "user123"
    }
  },
  {
    name: "Calculator",
    price: "20",
    image:
      "https://images.unsplash.com/photo-1544761634-dc512f2238a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "Scientific calculator",
    createdAt: 1549671448656,
    author: {
      id: "5c5d3395045be79704509e24",
      username: "shopaholic"
    }
  },
  {
    name: "Watch",
    price: "140",
    image:
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "Stylish design",
    createdAt: 1549679449656,
    author: {
      id: "5c5d3395045be79704509e24",
      username: "shopaholic"
    }
  }
];

seedDB = () => {
  Item.deleteMany({}, err => {
    if (!err) {
      console.log("removed all items");
      Item.insertMany(data, (err, items) => {
        if (!err) {
          console.log(`added: ${items}`);
        }
      });
    }
  });
};

module.exports = seedDB;
