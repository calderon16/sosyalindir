"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * IP bazlı istek sınırlayıcı (Rate Limiter)
 * Dakikada maksimum 20 isteğe izin verir.
 */
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 dakika (60.000 ms)
    max: 20, // IP başına maksimum 20 istek
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Çok fazla istek gönderdiniz. Lütfen bir dakika bekledikten sonra tekrar deneyin.",
    },
    handler: (_req, res, _next, options) => {
        res.status(429).json(options.message);
    },
});
