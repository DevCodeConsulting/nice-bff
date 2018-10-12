const express = require('express')
const port = 4500
const app = express()

app.listen(port, () => {
  console.log(`now listening to requests on port ${port}`)
})