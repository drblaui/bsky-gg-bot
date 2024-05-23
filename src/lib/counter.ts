import { readFileSync } from "fs";

function getBible() : string {
	return readFileSync("./src/assets/gg.txt").toString();
}

export function count(str: string) {
	const bible = getBible();
	let res = [];

	for(let word of str.split(" ")) {
		if(word === "" || word.replace(/\W/g, "") === "") continue;
		if (bible.includes(word.replace(/\W/g, ""))) {
			let wordRegexp = new RegExp("\\s" + word.replace(/\W/g, "") + "\\s", "gi");
			let count = (bible.match(wordRegexp) || []).length;
			if(count <= 0) continue;
			res.push([word, count])
		}
	}

	return res;
}