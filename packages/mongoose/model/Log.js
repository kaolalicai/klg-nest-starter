"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
class BaseLog {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], BaseLog.prototype, "time", void 0);
__decorate([
    typegoose_1.prop({ sparse: true }),
    __metadata("design:type", String)
], BaseLog.prototype, "userId", void 0);
__decorate([
    typegoose_1.prop({ sparse: true }),
    __metadata("design:type", String)
], BaseLog.prototype, "orderId", void 0);
__decorate([
    typegoose_1.prop({ index: true, enum: ['in', 'out'], required: true }),
    __metadata("design:type", String)
], BaseLog.prototype, "type", void 0);
__decorate([
    typegoose_1.prop({ index: true }),
    __metadata("design:type", String)
], BaseLog.prototype, "server", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], BaseLog.prototype, "useTime", void 0);
__decorate([
    typegoose_1.prop({ index: true }),
    __metadata("design:type", String)
], BaseLog.prototype, "interfaceName", void 0);
__decorate([
    typegoose_1.prop({ index: true }),
    __metadata("design:type", String)
], BaseLog.prototype, "url", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], BaseLog.prototype, "httpMethod", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], BaseLog.prototype, "body", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], BaseLog.prototype, "response", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], BaseLog.prototype, "responseAsync", void 0);
exports.BaseLog = BaseLog;
