import fetch from 'node-fetch';
import SparkMD5 from 'spark-md5';

function getClientIp(req) {
    return req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || null;
}

export default async function handler(request, response) {
    var result = {};
    var { text, type, raw } = request.query;
    raw = Number(raw);
    if (!type) type = "json";
    response.setHeader("Access-Control-Allow-Origin", "*");
    result.text = SparkMD5.hash(text, Boolean(raw));
    result.ip = getClientIp(request);
    if (type == "json") {
        return response.json(result);
    } else {
        response.setHeader("Content-Type", "text/plain");
        return response.send(result.text);
    }
}