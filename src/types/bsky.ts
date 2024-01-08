//PostView.record is empty object for no reason
type BskyPostRecord = {
	text: string,
	'$type': string,
	langs: Array<string>,
	reply: {
		root: {
			cid: string,
			uri: string
		},
		parent: {
			cid: string,
			uri: string
		}
	},
	createdAt: string
}

type BskyPost = {
	uri: string,
	cid: string,
	record: BskyPostRecord
}


export {
	BskyPostRecord,
	BskyPost
}