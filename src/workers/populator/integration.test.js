// @flow
import { handler } from './lambda';

describe('The populator worker', () => {
    it('should publish a message to IoT when done', done => {
        handler(
            {
                Records: [
                    {
                        Sns: {
                            Message: JSON.stringify({
                                posts: [
                                    {
                                        url: 'http://google.com'
                                    }
                                ]
                            })
                        }
                    }
                ]
            },
            {},
            error => {
                console.log(error);
                done(0);
            }
        );
    });
});
