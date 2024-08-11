require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 3000; // Default to port 3000 if not defined

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
