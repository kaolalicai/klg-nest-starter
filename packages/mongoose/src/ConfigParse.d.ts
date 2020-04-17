export declare type MongoConfigs = {
    url: string;
    name: string;
    options?: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
    };
};
export declare function parseConfig(): {
    mongoConfigs: MongoConfigs[];
    debugMongoose: boolean;
};
