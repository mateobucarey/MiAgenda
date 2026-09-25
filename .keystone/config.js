var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.js
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_config = require("dotenv/config");
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_adapter_better_sqlite3 = require("@prisma/adapter-better-sqlite3");
var keystone_default = (0, import_core.config)({
  db: {
    provider: "sqlite",
    prismaClientOptions: () => ({
      adapter: new import_adapter_better_sqlite3.PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
    })
  },
  lists: {
    KeystoneSystem: (0, import_core.list)({
      access: () => true,
      fields: {
        systemKey: (0, import_fields.text)({ validation: { isRequired: true } })
      }
    })
  },
  ui: {
    isAccessAllowed: () => true
  },
  server: {
    port: 3001
  }
});
//# sourceMappingURL=config.js.map
