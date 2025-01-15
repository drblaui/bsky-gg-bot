import { BskyAgent, RichText } from "@atproto/api";

import "dotenv/config";
import { BskyPost } from "../types/bsky";

const agent = new BskyAgent({service: "https://bsky.social/"});

async function login() {
	await agent.login({
		identifier: process.env.BSKY_MAIL || "",
		password: process.env.BSKY_PASS || ""
	});
}

export async function getMentions() {
	await login();

	const notifications = await agent.listNotifications(); 
	return notifications.data.notifications.filter((notification) => notification.reason == "mention");
}

export async function getPost(uri: string) {
	await login();
	try {
		const post = await agent.getPostThread({uri: uri})
		return (post.data.thread.post as BskyPost).record;
	}
	catch(e) {
		return null
	}
}

function generateSkeets(text: string) {
	let lines = text.split("\n");
	let i = 0;
	let skeets = [""]
	for(let line of lines) {
		if(line === "") continue;
		//299 is a magic number for 300 - \n
		if(skeets[i].length + line.length < 299) {
			skeets[i] = skeets[i] + line + "\n";
		}
		else {
			i++
			skeets.push(line + "\n");
		}
	}

	return skeets;
}

export async function reply(post: {parent: {uri: string, cid: string}, root: {uri: string, cid: string}, text: RichText}) {
	await login();
	await post.text.detectFacets(agent);

	let skeets = generateSkeets(post.text.text);

	let lastParent = post.parent;

	for(let skeet of skeets) {
		let posted = await agent.post({
			text: skeet,
			facets: post.text.facets,
			reply: {
				root: {
					uri: post.root.uri,
					cid: post.root.cid
				},
				parent: {
					uri: lastParent.uri,
					cid: lastParent.cid
				}
			}
		});

		lastParent = {uri: posted.uri, cid: posted.cid};
	} 
}
