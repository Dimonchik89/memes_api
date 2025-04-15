const express = require("express")
// const fs = require("fs");
const path = require('path');
const bodyParser = require('body-parser')
const fsPromises = require("node:fs/promises");
const fs = require("node:fs")
var cors = require('cors')


const PORT = process.env.PORT || 3002;
const app = express();

app.use(cors({
	origin: "*"
}))
app.use(bodyParser.json());

app.get("/memes", async (req, res) => {
	const buffer = await fsPromises.readFile(path.join(__dirname, "db.json"));
	const dataString = JSON.parse(buffer.toString())
	res.json(dataString)
})

app.patch("/memes/:id", async (req, res) => {
	const id  = req.params.id;
	const body = req.body;
	const pathToFile = path.join(__dirname, "db.json");
	const dataString = await fsPromises.readFile(pathToFile, { encoding: "utf-8" });

	const memes = JSON.parse(dataString);
	const newData = memes.map(item => {
		if(item.id === id) {
			return {
				...item,
				...body
			}
		} else {
			return item
		}
	})
	fs.writeFileSync(pathToFile, JSON.stringify(newData, null, 2), { encoding: "utf-8" });

	const meme = newData.find(item => item.id === id);

	res.json(meme)
})

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
})