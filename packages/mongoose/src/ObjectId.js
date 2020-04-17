"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function ObjectId(id) {
    return mongoose_1.Types.ObjectId(id);
}
exports.ObjectId = ObjectId;
