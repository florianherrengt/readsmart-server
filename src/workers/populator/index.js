// @flow
import config from '../../../config';
import md5 from 'md5';

export type Params = {
    s3: any,
    agent: any,
    bucket: string,
};

export class Populator {
    s3: any;
    agent: any;
    bucket: string;
    constructor(params: Params) {
        Object.assign(this, params);
        return this._populate.bind(this);
    }
    async _saveToS3(body: any) {
        const key = `${md5(body.url)}.json`;
        const textAsArray = body.text.split('. ').filter(t => t);
        body.short_text = textAsArray.reduce((result, t) => {
            if (result.length > 200) return result;
            return result + t + '\n\n';
        }, '');
        body.text = body.text.split('. ').join('.\n\n');
        body.id = key;
        body.created_at = new Date();
        return new Promise((resolve, reject) => {
            this.s3.putObject(
                {
                    Bucket: this.bucket,
                    Key: key,
                    Body: JSON.stringify(body),
                    ContentType: 'application/json',
                },
                error => {
                    error ? reject(error) : resolve();
                },
            );
        });
    }
    async _populate(params: { url: string, title: string }) {
        const { extractorUrl } = config;
        if (!extractorUrl) {
            throw new Error('config.extractorUrl is undefined');
        }
        const { url, title } = params;
        const { body } = await this.agent.get(`${extractorUrl}?url=${url}`);
        body.title = title || body.title;
        await this._saveToS3(body);
    }
}
