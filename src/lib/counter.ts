import { readFileSync } from "fs";

function getBible() : string {
	return readFileSync("./src/assets/bibel_luther1912.txt").toString();
}

export function count(str: string) {
	const bible = getBible();
	let res = [];

	for(let word of str.split(" ")) {
		if (bible.includes(word)) {
			let wordRegexp = new RegExp(word, "g");
			let count = (bible.match(wordRegexp) || []).length;
			console.log(`${word} kommt ${count} mal in der Bibel vor`)
		}
	}
}