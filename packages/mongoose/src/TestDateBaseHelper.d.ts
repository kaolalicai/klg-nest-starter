import { INestApplication } from '@nestjs/common';
export declare class TestDateBaseHelper {
    static genFixtures(app: INestApplication, template: object, nums: number, modelName: string, fixData?: (it: object, i: number) => any): Promise<any[]>;
    static clearDatabase(app: INestApplication): Promise<void>;
}
