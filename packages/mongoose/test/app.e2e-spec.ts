import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {
    Body,
    Controller,
    Module,
    Post,
    INestApplication
} from '@nestjs/common';
import {InjectModel, TypegooseModule} from '../src/typegoose';
import {prop, ReturnModelType} from '@typegoose/typegoose';
import {TypegooseModuleBuilder} from "../src/typegoose.module.builder";


class MockEntity {
    @prop()
    description: string;
}

class MockEntity2 {
    @prop()
    name: string;
}

export type MockModel = ReturnModelType<typeof MockEntity>;
export type MockModel2 = ReturnModelType<typeof MockEntity2>;

@Controller()
class MockController {
    constructor(
        @InjectModel(MockEntity) private readonly model: MockModel,
        @InjectModel(MockEntity2) private readonly model2: MockModel2
    ) {
    } // In reality, it's a Model<schema of MockEntity>

    @Post('create')
    async createTask(@Body() body: { description: string }) {
        return this.model.updateOne({description: body.description}, {description: body.description}, {upsert: true})
    }

    @Post('get')
    async getTask(@Body() body: { description: string }) {
        return this.model.findOne({
            description: body.description
        });
    }
}

@Module({
    imports: [
        TypegooseModuleBuilder.forRoot(),
        TypegooseModule.forFeature([MockEntity], 'db1'),
        TypegooseModule.forFeature([MockEntity2], 'db2')
    ],
    controllers: [MockController]
})
export class MockApp {
}

// @Module({
//   imports: [
//     TypegooseModule.forFeature([      MockEntity    ])
//   ],
//   controllers: [MockController]
// })
// class MockSubModule {}

describe('App consuming TypegooseModule', () => {
    let app: INestApplication;

    beforeAll(async () => {
        // await mongod.getConnectionString();

        const moduleFixture = await Test.createTestingModule({
            imports: [MockApp]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(() => app.close());

    it('should store and get mockTask', async () => {
        await request(app.getHttpServer())
            .post('/create')
            .send({
                description: 'hello world'
            });

        const response = await request(app.getHttpServer())
            .post('/get')
            .send({
                description: 'hello world'
            });

        const body = response.body;

        expect(body._id).toBeTruthy();
        expect(body.description).toBe('hello world');
    });
});
;
