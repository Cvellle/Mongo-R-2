const Data = require("../models/Data");

module.exports = function (app) {
  app.get("/api/datas", function (req, res) {
    Data.find({})
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post("/api/datas", function (req, res) {
    Data.create(req.body)
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.put("/api/datas", (req, res) => {
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, (err) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });

  app.delete("/api/datas", (req, res) => {
    const { id } = req.body;
    Data.findOneAndDelete(id, (err) => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
  });
};
