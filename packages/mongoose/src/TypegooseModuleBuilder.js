"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TypegooseModuleBuilder_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose = require("mongoose");
const nestjs_typegoose_1 = require("nestjs-typegoose");
const ConfigParse_1 = require("./ConfigParse");
let TypegooseModuleBuilder = TypegooseModuleBuilder_1 = class TypegooseModuleBuilder {
    static forRoot() {
        let { mongoConfigs, debugMongoose } = ConfigParse_1.parseConfig();
        mongoose.set('debug', debugMongoose);
        let connections = [];
        for (let c of mongoConfigs) {
            let typegooseModule = nestjs_typegoose_1.TypegooseModule.forRoot(c.url, Object.assign({ connectionName: c.name }, c.options));
            // connections.push(...typegooseModule.imports)
            connections.push(typegooseModule);
        }
        return {
            module: TypegooseModuleBuilder_1,
            imports: connections
        };
    }
};
TypegooseModuleBuilder = TypegooseModuleBuilder_1 = __decorate([
    common_1.Module({})
], TypegooseModuleBuilder);
exports.TypegooseModuleBuilder = TypegooseModuleBuilder;
