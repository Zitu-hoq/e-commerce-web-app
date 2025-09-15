export const Products = [
  {
    _id: "6785235e7f27154c8eebc1f5",
    sku: "zap-163054",
    name: "t-shirt",
    categories: ["men", "t-shirt", "half-sleeve"],
    price: 599,
    pictures: [
      "ZAP/t-shirt-2_1736778587063",
      "ZAP/t-shirt-1_1736778587063",
      "ZAP/t-shirt_1736778588567",
    ],
    pictureLinks: [
      "https://res.cloudinary.com/dcxmarqkg/image/upload/v1736778591/ZAP/t-shirt-2_1736778587063.jpg",
      "https://res.cloudinary.com/dcxmarqkg/image/upload/v1736778592/ZAP/t-shirt-1_1736778587063.jpg",
      "https://res.cloudinary.com/dcxmarqkg/image/upload/v1736778592/ZAP/t-shirt_1736778588567.jpg",
    ],
    description:
      "Looking for a comfortable and stylish shirt to wear out or to lounge around in? Look no further than the Keep On Smiling Shirt!\n\nThis trendy oversized vintage shirt is made from 100% cotton, which makes it comfortable to wear. It is the most versatile piece in my wardrobe.\n\nWhether you‘re running errands or just want to relax at home, this shirt is perfect for any occasion. I can also wear it to the beach with shorts, to the mall with jeans, or even to bed!\n\nIt’s super comfy and always makes me feel good when I put it on.",
    colors: ["black", "white"],
    size: ["s", "m", "L"],
    estDelivaryTime: 7,
    shipFrom: "China",
    __v: 0,
  },
];

export const Users = [
  {
    _id: "6786a9d67f953f154377483c",
    userName: "test",
    email: "test@gmail.com",
    password: "test123",
    __v: 0,
  },
  {
    _id: "6786a9fc7fcfa150b412933f",
    userName: "test1",
    email: "test1@gmail.com",
    password: "test123",
    __v: 0,
  },
];

export const UserOrders = [
  {
    _id: "6787b3d2f36e89830c7787eb",
    user: "6786a9d67f953f154377483c",
    orders: [
      {
        order_id: "6787b3d2f36e89830c7787e8",
      },
      {
        order_id: "6787b419f36e89830c7787f1",
      },
    ],
    previousOrders: [],
    __v: 1,
  },
];

export const Orders = [
  {
    shippingAddress: {
      street: "1, MatriChaya, Sundobi Pare",
      thana: "Halishahar",
      city: "Chattogram",
    },
    _id: "6787b3d2f36e89830c7787e8",
    user: "6786a9d67f953f154377483c",
    item: {
      product_id: "6785235e7f27154c8eebc1f5",
      quantity: 2,
      price: 599,
      size: "l",
      color: "black",
      _id: "6787b3d2f36e89830c7787e9",
    },
    totalPrice: 1198,
    mobile: "01838833223",
    paymentStatus: "due 198",
    paymentDetails: "paid with bkash",
    paidAmount: 1000,
    orderStatus: "Order placed!",
    adminStatus: "unseen",
    archiveOrder: "no",
    __v: 0,
  },
  {
    shippingAddress: {
      street: "1, MatriChaya, Sundobi Pare",
      thana: "Halishahar",
      city: "Chattogram",
    },
    _id: "6787b419f36e89830c7787f1",
    user: "6786a9d67f953f154377483c",
    item: {
      product_id: "6785235e7f27154c8eebc1f5",
      quantity: 1,
      price: 599,
      size: "l",
      color: "white",
      _id: "6787b419f36e89830c7787f2",
    },
    totalPrice: 599,
    mobile: "01838833223",
    paymentStatus: "due 99",
    paymentDetails: "paid with bkash",
    paidAmount: 500,
    orderStatus: "Order placed!",
    adminStatus: "unseen",
    archiveOrder: "no",
    __v: 0,
  },
];

export const Banners = [
  {
    _id: "6784fae7255dc8cf59caedda",
    title: "banner",
    img: "ZAP/home-page_img_1736768227631",
    imgLink:
      "https://res.cloudinary.com/dcxmarqkg/image/upload/v1736768233/ZAP/home-page_img_1736768227631.png",
    btnName: "click me",
    btnLink: "this is a link",
    __v: 0,
  },
];
