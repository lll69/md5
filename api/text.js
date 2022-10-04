import fetch from 'node-fetch';
import SparkMD5 from 'spark-md5';

function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || null;
}

export default async function handler(request, response) {
    try {
        var result = {};
        var { text, type } = request.query;
        response.setHeader("Access-Control-Allow-Origin", "*");
        result.ip = getClientIp(request);
        result.userAgent = request.headers["user-agent"];
        if (text === undefined) {
            throw new Error("No text, use `%23` instead of `#`");
        }
        if (!type) type = "json";
        result.md5 = SparkMD5.hash(text, false);
        result.raw = SparkMD5.hash(text, true);
        if (type == "json") {
            response.setHeader("Content-Type", "text/json; charset=utf-8");
            return response.json(result);
        } else {
            response.setHeader("Content-Type", "text/plain; charset=utf-8");
            return response.send(result.md5);
        }
    } catch (e) {
        result.error = String(e);
        response.status(400);
        response.setHeader("Content-Type", "text/json; charset=utf-8");
        return response.json(result);
    }
}
