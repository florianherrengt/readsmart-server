// @flow
export const schema = [
    `
    enum SourceType {
        reddit
        medium
        hackernews
        rss
    }
    type AllSourcesResponse {
        count: Int
        sources: [Source]
    }
    type Source {
        id: String
        # Url of the source
        url: String
        type: SourceType
        name: String
    }
`,
];
