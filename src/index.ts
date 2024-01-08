import { RichText } from "@atproto/api";
import { BskyPostRecord } from "./types/bsky";
import { getMentions, getPost, reply } from "./lib/bsky";
import { count } from "./lib/counter";
import { getLastId, setLastId } from "./lib/github";


getMentions().then(async (mentions) => {
	let lastId = await getLastId();
	for(let mention of mentions) {
		if(mention.cid === lastId) break;

		let parentUri = (mention.record as BskyPostRecord).reply.parent.uri;
		let post = await getPost(parentUri);
		let occurrences = count(post.text);
		let text = "";

		for(let occurrence of occurrences) {
			text += `"${occurrence[0]}" ist ${occurrence[1]} mal in der Bibel\n`;
		}
		if(text === "") {
			text = "Keines dieser Wörter kommt in der Bibel vor";
		}

		let answerText = new RichText({
			text: text
		});
		await reply({
			parent: {uri: mention.uri, cid: mention.cid},
			root: {uri: (mention.record as BskyPostRecord).reply.root.uri, cid: (mention.record as BskyPostRecord).reply.root.cid},
			text: answerText
		});
		//console.log((mention.record as BskyPostRecord).reply.parent);
	}

	await setLastId(mentions[0].cid);
});