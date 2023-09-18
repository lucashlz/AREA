const express = require('express')
const app = express()
const port = 8080
const about = require("./routes/about")

app.use('/', about);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})