var express = require("express");
const users = require("../../models/user");
const verifyToken = require('../../middlewares/verifyToken')

var router = express.Router();







//post user data

router.post("/user", async (req, res) => {
  const user = req.body;

  const query = { email: user.email };
  const existingUser = await users.findOne(query);
  if (existingUser) {
    return res.send({ message: "user already exits", insertedId: null });
  }

  try {
    const result = await users.create(user);
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all user data

router.get("/users", verifyToken, async (req, res) => {

  const { page, limit } = req.query;

  // sort newest-first so a brand-new signup shows up on page 1
  // instead of being buried on a later page
  const cursor = await users.find().sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
  res.send(cursor);
});

//get single user data

router.get("/user/:email", async (req, res) => {
  const result = await users.findOne({ email: req.params.email });
  res.send(result);
});

// get donor info with search
router.get("/userDonor", async (req, res) => {
  const data = req.query;

  const filter = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== "")
  );

  const result = await users
    .find({ ...filter, role: "Donor" })
    .sort({ blood: 1 })
    .exec();
  res.send(result);
});

//user donor request

router.patch("/user/donorReq/:id", async (req, res) => {
  const userDonorReq = req.body;
  console.log(userDonorReq);
  const result = await users.updateOne(
    { _id: req.params.id },
    {
      $set: {
        roleStatus: userDonorReq.roleStatus,
      },
    }
  );
  // console.log(result);
  res.send(result);
});
//user Volunteer request

router.patch("/user/volunteerReq/:id", async (req, res) => {
  const userDonorReq = req.body;
  console.log(userDonorReq);
  const result = await users.updateOne(
    { _id: req.params.id },
    {
      $set: {
        roleStatus: userDonorReq.roleStatus,
      },
    }
  );
  console.log(result);
  res.send(result);
});

//admin section

router.get("/user/admin/:email", verifyToken, async (req, res) => {
  const user = await users.findOne({ email: req.params.email });
  let admin = false;
  if (user) {
    admin = user?.role === "Admin";
  }
  console.log(admin);

  res.send({ admin });
});

//get volunteer
router.get("/user/volunteer/:email", verifyToken, async (req, res) => {
  const user = await users.findOne({ email: req.params.email });
  let volunteer = false;
  if (user) {
    volunteer = user?.role === "Volunteer";
  }

  res.send({ volunteer });
});

//admin
// user request donor aprroval
router.patch("/user/admin/donorReq/:id", async (req, res) => {
  const result = await users.updateOne(
    { _id: req.params.id },
    {
      $set: {
        role: "Donor",
        roleStatus: "Approved",
      },
    }
  );
  res.send(result);
});
// user request Volunteer aprroval
router.patch("/user/admin/volunteerReq/:id", async (req, res) => {
  const result = await users.updateOne(
    { _id: req.params.id },
    {
      $set: {
        role: "Volunteer",
        roleStatus: "Approved",
      },
    }
  );
  res.send(result);
});

//patch user role update
router.patch("/user/admin/:id", async (req, res) => {
  const roleData = req.body;

  const result = await users.updateOne(
    { _id: req.params.id },
    {
      $set: {
        role: roleData.role,
        roleStatus: roleData.roleStatus,
      },
    }
  );
  res.send(result);
});

//patch user status update
router.patch("/user/status/:id", async (req, res) => {
  const currentStatus = req.body;
  console.log(currentStatus.status);
  const result = await users.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: currentStatus.status,
      },
    }
  );
  res.send(result);
});

// user profile update

router.patch("/user/updateProfile/:id", async (req, res) => {
  const updateData = req.body;

  const result = await users.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: updateData?.name,
        phone: updateData?.phone,
        profileImg: updateData?.profileImg,
        coverImg: updateData?.coverImg,
        blood: updateData?.blood,
        districts: updateData?.districts,
        upuzilla: updateData?.upuzilla,
      },
    }
  );
  res.send(result);
});

module.exports = router;
