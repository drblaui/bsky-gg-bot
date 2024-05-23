import { RichText } from "@atproto/api";
import { BskyPostRecord } from "./types/bsky";
import { getMentions, getPost, reply } from "./lib/bsky";
import { count } from "./lib/counter";
import { getLastId, setLastId } from "./lib/github";


getMentions().then(async (mentions) => {
	let lastId = await getLastId();
	for(let mention of mentions) {
		if(mention.cid === lastId) break;
	
		let parentUri = "";
		let root;
		if(!("reply" in mention.record)) {
			parentUri = mention.uri;
			root = {uri: mention.uri, cid: mention.cid}

		}
		else {
			parentUri = (mention.record as BskyPostRecord).reply.parent.uri;
			root = {uri: (mention.record as BskyPostRecord).reply.root.uri, cid: (mention.record as BskyPostRecord).reply.root.cid}

		}
		
		let post = await getPost(parentUri);
		let occurrences = count(post.text);
		let text = "";

		for(let occurrence of occurrences) {
			text += `"${occurrence[0]}" ist ${occurrence[1]} mal im Grundgesetz\n`;
		}
		if(text === "") {
			text = "Keines dieser Wörter kommt im Grundgesetz vor";
		}

		let answerText = new RichText({
			text: text
		});

		await reply({
			parent: {uri: mention.uri, cid: mention.cid},
			root: root,
			text: answerText
		});
		//console.log((mention.record as BskyPostRecord).reply.parent);
	}

	await setLastId(mentions[0].cid);
});