"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const utils_1 = require("@akajs/utils");
const nestjs_typegoose_1 = require("nestjs-typegoose");
const Mock = require("mockjs");
const ConfigParse_1 = require("./ConfigParse");
let TestDateBaseHelper = class TestDateBaseHelper {
    static async genFixtures(app, template, nums, modelName, fixData) {
        if (!fixData)
            fixData = (it, index) => it;
        let model = app.get(nestjs_typegoose_1.getModelToken(modelName));
        let items = Array(10)
            .fill(0)
            .map((it) => Mock.mock(template))
            .map(fixData);
        utils_1.logger.debug('initFixtures ', items.length);
        await model.create(items);
        return items;
    }
    static async clearDatabase(app) {
        const { mongoConfigs } = ConfigParse_1.parseConfig();
        for (let c of mongoConfigs) {
            let connect = app.get(nestjs_typegoose_1.getConnectionToken(c.name));
            for (let key of Object.keys(connect.collections)) {
                utils_1.logger.debug('delete ', key);
                await connect.collections[key].deleteMany({});
            }
        }
    }
};
TestDateBaseHelper = __decorate([
    common_1.Module({})
], TestDateBaseHelper);
exports.TestDateBaseHelper = TestDateBaseHelper;
