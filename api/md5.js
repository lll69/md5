import fetch from 'node-fetch';
import SparkMD5 from 'spark-md5';

function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || null;
}

export default async function handler(request, response) {
    try {
        var result = {};
        var { text, type, raw } = request.query;
        response.setHeader("Access-Control-Allow-Origin", "*");
        if (text === undefined) {
            response.setHeader("Content-Type", "text/plain");
            response.status(200);
            return response.send("No text, use `%23` instead of `#`");
        }
        raw = Number(raw);
        if (!type) type = "json";
        result.text = SparkMD5.hash(text, Boolean(raw));
        result.ip = getClientIp(request);
        if (type == "json") {
            return response.json(result);
        } else {
            response.setHeader("Content-Type", "text/plain");
            return response.send(result.text);
        }
    } catch (err) {
        result.error = String(e);
        response.status(400);
        return response.json(result);
    }
}