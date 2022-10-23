const express = require("express");
const router = express.Router();
const Boba = require("../models/boba");
const Temperature = require("../models/temperature");

/* GET home page. */
router.get("/", async (req, res) => {
  //res.send("bobas home");
  const bobas = await Boba.find({}).populate("temperature").exec();
  res.render("bobas/index", { bobas: bobas });
});

// add new boba router
router.get("/new", async (req, res) => {
  try {
    // must async await anything coming from mongoDB, or it will fail to pass through
    const categories = await Temperature.find({});
    res.render("bobas/new", { boba: new Boba(), categories: categories });
  } catch (error) {
    console.log(error);
  }
});

// add new boba post req to mongodb
router.post("/", async (req, res) => {
  const boba = new Boba({
    name: req.body.name,
    description: req.body.description,
    temperature: req.body.temperature,
  });
  try {
    const newBoba = await boba.save();
    //res.redirect(`bobas/${newBoba.id}`)
    res.redirect("bobas");
  } catch (err) {
    const bobas = await Boba.find({}).populate("temperature").exec();

    console.log(err);
    res.render("/bobas/index", { bobas: bobas, error: err });
  }
});

// show individual boba router

router.get("/:id", async (req, res) => {
  try {
    const boba = await Boba.findById(req.params.id)
      .populate("temperature")
      .exec();
    //console.log(boba);
    res.render("bobas/show.ejs", { boba: boba });
  } catch {
    res.redirect("/");
  }
});

// edit boba router
router.get("/:id/edit", async (req, res) => {
  try {
    const categories = await Temperature.find({});
    const boba = await Boba.findById(req.params.id)
      .populate("temperature")
      .exec();
    res.render("bobas/edit", { boba: boba, categories: categories });
  } catch {
    res.redirect("/");
  }
});

// update boba router
router.put("/:id", async (req, res) => {
  let boba;

  try {
    boba = await Boba.findById(req.params.id);
    boba.name = req.body.name;
    boba.temperature = req.body.temperature;
    boba.description = req.body.description;
    await boba.save();
    res.redirect(`/bobas/${boba.id}`);
  } catch (err) {
    console.log(err);
    res.redirect("/bobas");
  }
});

// delete confirmation page router
router.get("/:id/deleteconfirm", async (req, res) => {
  try {
    const boba = await Boba.findById(req.params.id);
    res.render("bobas/deleteConfirmation", { boba: boba });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// delete boba request
router.delete("/:id", async (req, res) => {
  let boba;
  try {
    boba = await Boba.findById(req.params.id);
    await boba.remove();
    res.redirect("/bobas");
  } catch {
    res.redirect("/");
  }
});

module.exports = router;
