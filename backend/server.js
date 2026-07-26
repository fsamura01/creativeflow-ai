require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const creativeBriefRouter = require('./routes/creativeBrief');
const scriptRouter = require('./routes/script');
const storyboardRouter = require('./routes/storyboard');
const mentorRouter = require('./routes/mentor');
const refineRouter = require('./routes/refine');

app.use('/creative-brief', creativeBriefRouter);
app.use('/generate-script', scriptRouter);
app.use('/generate-storyboard', storyboardRouter);
app.use('/mentor-review', mentorRouter);
app.use('/refine', refineRouter);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
