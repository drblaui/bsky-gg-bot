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

	const post = await agent.getPostThread({uri: uri})
	return (post.data.thread.post as BskyPost).record;
}

export async function reply(post: {parent: {uri: string, cid: string}, root: {uri: string, cid: string}, text: RichText}) {
	await login();
	await post.text.detectFacets(agent);
	await agent.post({
		text: post.text.text,
		facets: post.text.facets,
		reply: {
			root: {
				uri: post.root.uri,
				cid: post.root.cid
			},
			parent: {
				uri: post.parent.uri,
				cid: post.parent.cid
			}
		}
	})
}