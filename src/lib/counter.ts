import { readFileSync } from "fs";

function getBible() : string {
	return readFileSync("./src/assets/bibel_luther1912.txt").toString();
}

export function count(str: string) {
	const bible = getBible();
	let res = [];

	for(let word of str.split(" ")) {
		if(word === "") continue;
		if (bible.includes(word)) {
			let wordRegexp = new RegExp("\\s" + word + "\\s", "gi");
			let count = (bible.match(wordRegexp) || []).length;
			res.push([word, count])
		}
	}

	return res;
}