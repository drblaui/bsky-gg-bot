import { Octokit } from "@octokit/core";

const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});

export async function getLastId() {
	return (await octokit.request('GET /repos/{owner}/{repo}/actions/variables/{name}', {
		owner: "drblaui",
		repo: "bsky-gg-bot",
		name: "LAST",
		header: {
			'X-GitHub-Api-Version': "2022-11-28"
		}
	})).data.value;
}

export async function setLastId(id: string) {
	await octokit.request('PATCH /repos/{owner}/{repo}/actions/variables/{name}', {
		owner: "drblaui",
		repo: "bsky-gg-bot",
		name: "LAST",
		value: id,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});
}