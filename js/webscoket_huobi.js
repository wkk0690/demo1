var nowTime = Date.parse(new Date());//用于生成websocket的send方法中的ID

if(typeof(WebSocket) == "undefined") {
    alert("您的浏览器不支持WebSocket");
    //return;
}

var socket;
var socketOpen = false;
socket = new WebSocket("wss://api.huobipro.com/ws");
socket.connectionTimeout = 6000;
socket.binaryType = "arraybuffer";
socket.onerror = function () {
    socketOpen = false;
    console.log("error");
    console.log(arguments);
};
socket.onclose = function (event) {
    socketOpen = false;
    console.log("WebSocket close at time: " + new Date());
};
socket.onopen = function (event) {
    socketOpen = true;
    socket.binaryType = "arraybuffer";
    console.log("WebSocket onopen at time: " + new Date());
};
let lastDate = new Date();
socket.onmessage = function (event) {
    lastDate = new Date();
    var raw_data = event.data;
    //var json = pako.inflate(new Uint8Array(raw_data), { to: "string" });//火币
    var json = pako.inflate((raw_data), { to: "string" });
    var data = JSON.parse(json);
    console.log(data);
    if (data.ch && data.ch.indexOf("kline.day") > -1) {//k线
        var symbol = data.ch.split('.')[1]
        initMarket(symbol, data.tick)
    }else if(data.rep && data.rep.indexOf("kline.day") > -1){ //K线请求
        var kreq = data.data
        var symbol = data.rep.split('.')[1]
    }else if(data.rep && data.rep.indexOf("trade.detail") > -1){//实时交易请求
        // dealTradeDetail(data,1)
    }else if(data.ch && data.ch.indexOf("trade.detail") > -1){//实时交易订阅
        // dealTradeDetail(data,2)
    }else if(data.ch && data.ch.indexOf("depth") > -1){//深度
        // dealTradeDepth(data)
    }else if (data.rep && data.rep.indexOf(".kline") > -1) {//k线请求数据
        KlineData = json;
        var symbol = data.rep.split('.')[1]
        // initMarket1(symbol, data.tick)
    }
    var ps = data.ping;
    if(ps !=null){
        socket.send(JSON.stringify({"pong":ps}))
    }
}

submarketkline('btcusdt')


//发送K线参数
function submarketkline(symbol) {
    if (!socketOpen) {
        setTimeout(function () {
            submarketkline(symbol);
        }, 100);
        return;
    }
    // socket.send( //K线请求
    //     JSON.stringify({
    //             req: 'market.' + symbol + '.kline.1day',
    //             id: nowTime
    //     })
    // )
    socket.send( //k线订阅
        JSON.stringify({
            sub: 'market.' + symbol + '.kline.1day',
            id: nowTime
        })
    )
}

//发送订阅卖5买5
function marketDepth(symbol) {

    if (!socketOpen) {
        setTimeout(function () {
            marketDepth(symbol);
        }, 100);
        return;
    }

    // socket.send( //请求买5卖5
    //     JSON.stringify({
    //         req: "market."+symbol+".depth.step0",
    //         id: nowTime
    //     })
    // );

    socket.send(
        JSON.stringify({ //订阅买5卖5
            sub: 'market.' + symbol + '.depth.step0',
            id: nowTime
        })
    );

    socket.send(
        JSON.stringify({ //订阅买5卖5
            sub: 'market.' + symbol + '.depth.step1',
            id: nowTime
        })
    );

    socket.send(
        JSON.stringify({ //订阅买5卖5
            sub: 'market.' + symbol + '.depth.step2',
            id: nowTime
        })
    );
}

//实时交易的参数
function tradeDetail(symbol) {
    if (!socketOpen) {
        setTimeout(function () {
            tradeDetail(symbol);
        }, 100);
        return;
    }
    // socket.send(
    //     JSON.stringify({
    //         req: 'market.' + symbol + '.trade.detail',
    //         id: nowTime
    //     })
    // )
    socket.send(
        JSON.stringify({
            sub: 'market.' + symbol + '.trade.detail',
            id: nowTime
        })
    )
}

//Market Detail
function marketDetail(symbol) {
    if (!socketOpen) {
        setTimeout(function () {
            marketDetail(symbol);
        }, 100);
        return;
    }
    // socket.send(
    //     JSON.stringify({
    //         req: 'market.' + symbol + '.detail',
    //         id: nowTime
    //     })
    // )
    socket.send(
        JSON.stringify({
            sub: 'market.' + symbol + '.detail',
            id: nowTime
        })
    )
}

