const path = require("path");
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const Campground = require("../models/campgrounds");

///// Connecting to the Databse mongodb with the user database yelp-camp

mongoose.connect("mongodb://localhost:27017/yelp-camp");

////// Checking the connectivity of Database

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: "62b15cf043d94d0c99ef3cc5",
      location: `${cities[random1000].city} ,${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum asperiores nostrum placeat omnis incidunt, iusto optio molestias, voluptate explicabo quo nisi earum eum impedit, praesentium laudantium repellendus a commodi modi.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dhl50zucw/image/upload/v1655917549/YelpCamp/ieiy3cpie85otphpsn7f.jpg",
          filename: "YelpCamp/ieiy3cpie85otphpsn7f",
        },
        {
          url: "https://res.cloudinary.com/dhl50zucw/image/upload/v1655917550/YelpCamp/ayqcxak3tqvfniglhrc3.jpg",
          filename: "YelpCamp/ayqcxak3tqvfniglhrc3",
        },
        {
          url: "https://res.cloudinary.com/dhl50zucw/image/upload/v1655917550/YelpCamp/fblalzde9oaurkiyuyjj.jpg",
          filename: "YelpCamp/fblalzde9oaurkiyuyjj",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
