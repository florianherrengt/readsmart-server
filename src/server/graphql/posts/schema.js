// @flow
export const schema = [
    `
    type PostResponse {
        # Number of total posts to be displayed. If count > posts.lengh other posts are in the queue to be fetched
        count: Int
        # The actual posts
        posts: [Post]
    }
    type Post {
        # Key to fetch in S3
        id: String
        # The title extracted from the post
        title: String
        # First 3 sentences
        short_text: String
        # Long raw version text only of the post with line return
        text: String
        # Main image from the post
        image: String
        # When the post was inserted in the DB
        created_at: String
        # Where this post is coming from
        url: String
        # True is this post has been sent to the queue to be processed
        isLoading: Boolean
    }
`
];
