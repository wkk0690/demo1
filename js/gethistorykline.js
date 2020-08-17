let WebSocket = require('ws');
let pako = require('pako');
var fs = require("fs")

let symbol = 'btcusdt';
let period = '60min'
const socket = new WebSocket('wss://api.huobi.pro/ws'); 
socket.binaryType = 'arraybuffer';

socket.onopen = function (event) {
    console.log('WebSocket connect at time: ' + new Date());
    //上午的时间
    //socket.send(JSON.stringify({'req': 'market.' + symbol + '.kline.' + period,'id': 'kline' + new Date(), 'from': 1507610100, 'to': 1507613820}));
    //socket.send(JSON.stringify({'req': 'market.' + symbol + '.kline.' + period,'id': 'kline' + new Date(), 'from': 1507592100, 'to': 1507610100}));

    //下午的时间
    // socket.send(JSON.stringify({'req': 'market.' + symbol + '.kline.' + period,'id': 'kline' + new Date(), 'from': 1512057600, 'to': 1512059400}));
    socket.send(JSON.stringify({'req': 'market.' + symbol + '.kline.' + period,'id': 'kline' + new Date(), 'from': 1521331200, 'to': 1521360000}));
};

socket.onmessage = function (event) {
    let raw_data = event.data;
    let json = pako.inflate(new Uint8Array(raw_data), {to: 'string'});
    let data = JSON.parse(json);

    console.log('WebSocket receive message at time: ' + new Date());
    console.log('datas-start')
    console.log(data);
    console.log('datas-end')
    console.log('写入文件')
    // fs.writeFile('test.txt', JSON.stringify(data),  function(err) {
        //if (err) {
        //    return console.error(err);
        //}
        // console.log("数据写入成功！");
        // console.log("--------我是分割线-------------")
        // console.log("读取写入的数据！");
        // fs.readFile('input.txt', function (err, data) {
        //    if (err) {
        //       return console.error(err);
        //    }
        //    console.log("异步读取文件数据: " + data.toString());
        // });
    //});
    console.log('完成文件')

    /* deal with server heartbeat */
    if (data['ping']) {
        console.log('WebSocket receive ping and return pong at time: ' + new Date());
        socket.send(JSON.stringify({'pong': data['ping']}));
    }
};

socket.onclose = function(event) {
    console.log('WebSocket close at time: ' + new Date());
};