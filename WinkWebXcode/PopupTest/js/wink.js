var nLight = [];
var divLights = [];
var mySliderLight = [];
var controlWinks = [];
var	lightWinks = [];
var	switchWinks = [];
var	sensorWinks = [];
var scenesWinks = [];
var groupsWinks = [];

window.addEventListener('DOMContentLoaded',function(){
                        checkUser();
                        },false);

function logout(){
    eraseCookie("username");
    eraseCookie("pass");
    
}
function loginUser(){
    var username = document.getElementById("username").value;
    createCookie("username", username, 365);
    var password = document.getElementById("password").value;
    createCookie("pass", password, 365);
    document.getElementById("loginform").style.display = 'none';
    fillBody(username, password);
}

function checkUser(){
    if(readCookie('username')){
        var username = readCookie('username');
        if(readCookie('pass')){
            var	password = readCookie('pass');
            
            document.getElementById("loginform").style.display = 'none';
            fillBody(username, password);
            
        }else{
            
            document.getElementById("loginform").style.display = 'block';
        }
        
    }else{
        
        document.getElementById("loginform").style.display = 'block';
    }
}


function createRequest() {
    var result = null;
    if (window.XMLHttpRequest) {
        // FireFox, Safari, etc.
        result = new XMLHttpRequest();
        if (typeof result.overrideMimeType != 'undefined') {
            result.overrideMimeType('text/xml'); // Or anything else
        }
    } else if (window.ActiveXObject) {
        // MSIE
        result = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        // No known mechanism -- consider aborting the application
    }
    return result;
}

function getWinkRow(wink, row) {
    strDeviceType = wink[0] + "s";
    
    
    switch(strDeviceType){
        case 'light_bulbs':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            var bPowered = wink[1].last_reading.powered;
            state.src = "png/lights/" + bPowered + ".png";
            state.alt = bPowered;
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/lights/light_bulb.png";
            img.width = 48;
            img.height = 48;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            var cell = document.getElementById("Switch" + row);
            cell.style.width = "160px";
            var wink_id_temp = wink[0] + '_id';
            var wink_id = wink[1][wink_id_temp];
            if(wink[1].last_reading.powered)
                nLight[row] = (wink[1].last_reading.brightness) * 100;
            else
                nLight[row] = 0;
            
            mySliderLight[row] = new dhtmlXSlider({
                                                  parent: "Switch" + row,
                                                  value: nLight[row],
                                                  tooltip: true,
                                                  skin: "dhx_web",
                                                  size: 150,
                                                  step: 10,
                                                  min: 0,
                                                  max: 100
                                                  });
            // Add Line Break
            var lineNext = document.createElement("BR");
            cell.appendChild(lineNext);
            var temp_bg = document.createElement("img");
            temp_bg.src = "png/lights/lightlegend.gif";
            temp_bg.style.paddingTop = "5px";
            temp_bg.style.align = "left";
            cell.appendChild(temp_bg);
            
            if(mySliderLight.length > 0)
                mySliderLight[row].attachEvent("onSlideEnd", function(newLight){
                                               var deviceTarget = strDeviceType + "/" + wink_id;
                                               if(newLight > 0)
                                               bPowered = true;
                                               else
                                               bPowered = false;
                                               value = newLight/100;
                                               var body = {
                                               "desired_state":
                                               {
                                               "powered":bPowered,"brightness":value
                                               }
                                               };
                                               setDevice(deviceTarget, body);
                                               wink[1].desired_state.powered = bPowered;
                                               wink[1].desired_state.brightness = value;
                                               wink[1].last_reading.powered = bPowered;
                                               wink[1].last_reading.brightness = value;
                                               });
            break;
            
        case 'binary_switchs':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            var bPowered = wink[1].last_reading.powered;
            state.src = "png/lights/" + bPowered + ".png";
            state.alt = bPowered;
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/lights/light_bulb.png";
            img.width = 48;
            img.height = 48;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            var cell = document.getElementById("Switch" + row);
            cell.style.align = 'center';
            var wink_id_temp = wink[0] + '_id';
            var wink_id = wink[1][wink_id_temp];
            if(wink[1].last_reading.powered)
                nPowered = 1;
            else
                nPowered = 0;
            mySliderLight[row] = new dhtmlXSlider({
                                                  parent: cell,
                                                  size: 100,
                                                  skin: "dhx_web",
                                                  tooltip: true,
                                                  vertical: false,
                                                  min: 0,
                                                  max: 1,
                                                  value: nPowered,
                                                  step: 1});
            var lineNext = document.createElement("BR");
            cell.appendChild(lineNext);
            var temp_bg = document.createElement("img");
            temp_bg.style.paddingTop = "5px";
            temp_bg.src = "png/lights/lightlegend.gif";
            temp_bg.style.align = 'left';
            cell.appendChild(temp_bg);
            mySliderLight[row].attachEvent("onSlideEnd", function(newPower){
                                           var deviceTarget = 'binary_switches' + "/" + wink_id;
                                           if(newPower > 0)
                                           nPowered = true;
                                           else
                                           nPowered = false;
                                           var body = {
                                           "desired_state":
                                           {
                                           "powered":nPowered
                                           }
                                           };
                                           setDevice(deviceTarget, body);
                                           //					wink[1].desired_settings.locked = bLocked;
                                           wink[1].last_reading.powered = nPowered;
                                           });
            break;
            
        case 'outlets':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            var bPowered = wink[1].last_reading.powered;
            state.src = "png/lights/" + bPowered + ".png";
            state.alt = bPowered;
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/lights/light_bulb.png";
            img.width = 48;
            img.height = 48;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            var cell = document.getElementById("Switch" + row);
            cell.style.align = 'center';
            var wink_id_temp = wink[0] + '_id';
            var wink_id = wink[1][wink_id_temp];
            if(wink[1].last_reading.powered)
                nPowered = 1;
            else
                nPowered = 0;
            mySliderLight[row] = new dhtmlXSlider({
                                                  parent: cell,
                                                  size: 100,
                                                  skin: "dhx_web",
                                                  tooltip: true,
                                                  vertical: false,
                                                  min: 0,
                                                  max: 1,
                                                  value: nPowered,
                                                  step: 1});
            var lineNext = document.createElement("BR");
            cell.appendChild(lineNext);
            var temp_bg = document.createElement("img");
            temp_bg.style.paddingTop = "5px";
            temp_bg.src = "png/lights/lightlegend.gif";
            temp_bg.style.align = 'left';
            cell.appendChild(temp_bg);
            mySliderLight[row].attachEvent("onSlideEnd", function(newPower){
                                           var deviceTarget = 'outlets' + "/" + wink_id;
                                           if(newPower > 0)
                                           nPowered = true;
                                           else
                                           nPowered = false;
                                           var body = {
                                           "desired_state":
                                           {
                                           "powered":nPowered
                                           }
                                           };
                                           setDevice(deviceTarget, body);
                                           //					wink[1].desired_settings.locked = bLocked;
                                           wink[1].last_reading.powered = nPowered;
                                           });
            break;
            
            
        case 'locks':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            state.src = "png/locks/"+ wink[1].last_reading.locked + ".png";
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/locks/ic_device_locks_selection.png";
            img.width = 48;
            img.height = 48;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            var cell = document.getElementById("Switch" + row);
            cell.style.align = 'center';
            var wink_id_temp = wink[0] + '_id';
            var wink_id = wink[1][wink_id_temp];
            if(wink[1].last_reading.locked)
                nLock = 1;
            else
                nLock = 0;
            mySliderLight[row] = new dhtmlXSlider({
                                                  parent: cell,
                                                  size: 100,
                                                  skin: "dhx_web",
                                                  tooltip: true,
                                                  vertical: false,
                                                  min: 0,
                                                  max: 1,
                                                  value: nLock,
                                                  step: 1});
            var lineNext = document.createElement("BR");
            cell.appendChild(lineNext);
            var temp_bg = document.createElement("img");
            temp_bg.style.paddingTop = "5px";
            temp_bg.src = "png/locks/LockLegend.png";
            temp_bg.style.align = 'left';
            cell.appendChild(temp_bg);
            mySliderLight[row].attachEvent("onSlideEnd", function(newLock){
                                           var deviceTarget = 'locks' + "/" + wink_id;
                                           if(newLock > 0)
                                           bLocked = true;
                                           else
                                           bLocked = false;
                                           var body = {
                                           "desired_state":
                                           {
                                           "locked":bLocked
                                           }
                                           };
                                           setDevice(deviceTarget, body);
                                           //					wink[1].desired_settings.locked = bLocked;
                                           wink[1].last_reading.locked = bLocked;
                                           });
            break;
            
        case 'thermostats':
            var cell = document.getElementById("State" + row);
            var nTemp = wink[1].desired_state.max_set_point;
            nTemp = (nTemp * 1.8) + 32;
            cell.appendChild(document.createTextNode(nTemp));
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/thermostat/ic_device_thermostat_selection.png";
            img.width = 48;
            img.height = 48;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            var cell = document.getElementById("Switch" + row);
            var nTemp = wink[1].desired_state.max_set_point;
            nTemp = (nTemp * 1.8) + 32;
            var wink_id_temp = wink[0] + '_id';
            var wink_id = wink[1][wink_id_temp];
            mySliderLight[row] = new dhtmlXSlider({
                                                  parent: cell,
                                                  size: 150,
                                                  skin: "dhx_web",
                                                  tooltip: true,
                                                  vertical: false,
                                                  min: 50,
                                                  max: 80,
                                                  value: nTemp,
                                                  step: 1});
            var lineNext = document.createElement("BR");
            var temp_bg = document.createElement("img");
            temp_bg.style.paddingTop = "5px";
            temp_bg.src = "png/thermostat/thermostat.gif";
            cell.appendChild(temp_bg);
            mySliderLight[row].attachEvent("onSlideEnd", function(newTemp){
                                           var deviceTarget = 'thermostats' + "/" + wink_id;
                                           //Convert to Celsius
                                           newTemp = (newTemp - 32)/1.8;
                                           var body = {
                                           "desired_state":
                                           {
                                           "mode":"heat_only","powered":true,"modes_allowed":null,"min_set_point":newTemp,"max_set_point":newTemp
                                           }
                                           };
                                           setDevice(deviceTarget, body);
                                           wink[1].desired_state.max_set_point = newTemp;
                                           wink[1].desired_state.min_set_point = newTemp;
                                           wink[1].last_reading.max_set_point = newTemp;
                                           wink[1].last_reading.min_set_point = newTemp;
                                           });
            break;
            
            /*		case 'hubs':
             updateHub(wink, row);
             //			window.setInterval(function(){updateHub(wink, row)}, 30000);
             var cell = document.getElementById("Desc" + row);
             var divDesc = document.createElement('div');
             divDesc.style.align = 'center';
             divDesc.style.width = 60;
             divDesc.style.textAlign = 'center';
             var img = document.createElement("img");
             img.src = "png/hub/hub.png";
             img.width = 48;
             img.height = 48;
             divDesc.appendChild(img);
             divDesc.appendChild(document.createElement("br"));
             divDesc.appendChild(document.createTextNode(wink.name));
             cell.appendChild(divDesc);
             break;*/
            
        case 'sensor_pods':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            state.src = "png/sensors/na.png";
            state.alt = 'N/A';
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/sensors/sensor.png";
            img.width = 64;
            img.height = 64;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            updateSensors(wink[1], row);
            break;
            
        case 'propane_tanks':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            state.src = "png/sensors/na.png";
            state.alt = 'N/A';
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/sensors/sensor.png";
            img.width = 64;
            img.height = 64;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            updateRefuel(wink[1], row);
            break;
            
        case 'smoke_detectors':
            var cell = document.getElementById("State" + row);
            var state = document.createElement("img");
            state.src = "png/sensors/true.png";
            state.alt = 'N/A';
            cell.appendChild(state);
            var cell = document.getElementById("Desc" + row);
            var divDesc = document.createElement('div');
            divDesc.style.align = 'center';
            divDesc.style.width = 60;
            divDesc.style.textAlign = 'center';
            var img = document.createElement("img");
            img.src = "png/sensors/smokealarm.png";
            img.width = 64;
            img.height = 64;
            divDesc.appendChild(img);
            divDesc.appendChild(document.createElement("br"));
            divDesc.appendChild(document.createTextNode(wink[1].name));
            cell.appendChild(divDesc);
            var cell = document.getElementById("Switch" + row);
            var imgBattery = document.createElement('img');
            if(wink[1].last_reading.battery > .8)
                imgBattery.src = 'png/battery/battery_100.png';
            if((wink[1].last_reading.battery <= .8) && (wink[1].last_reading.battery > .6))
                imgBattery.src = 'pgn/battery/battery_75.png';
            if((wink[1].last_reading.battery <= .6) && (wink[1].last_reading.battery > .3))
                imgBattery.src = 'pgn/battery/battery_50.png';
            if((wink[1].last_reading.battery <= .3) && (wink[1].last_reading.battery > .15))
                imgBattery.src = 'pgn/battery/battery_75.png';
            if((wink[1].last_reading.battery <= .15) && (wink[1].last_reading.battery > 0))
                imgBattery.src = 'pgn/battery/battery_10.png';
            imgBattery.alt = wink[1].last_reading.battery;
            cell.appendChild(imgBattery);
            
            break;
            
        default:
            break;
            /*var cell = document.getElementById("State" + row);
             var state = document.createElement("img");
             state.src = "png/lights/na.png";
             state.alt = 'not light';
             cell.appendChild(state);
             var cell = document.getElementById("Desc" + row);
             var divDesc = document.createElement('div');
             divDesc.style.align = 'center';
             divDesc.style.width = 60;
             divDesc.style.textAlign = 'center';
             var img = document.createElement("img");
             img.width = 48;
             img.height = 48;
             divDesc.appendChild(img);
             divDesc.appendChild(document.createElement("br"));
             divDesc.appendChild(document.createTextNode(wink[1].name));
             cell.appendChild(divDesc);
             var cell = document.getElementById("Switch" + row);*/
    }
    return;
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


function fillBody(username, password) {
    var xhr = createRequest();
    /*if(readCookie('username')){
     var username = readCookie('username');
     if(readCookie('pass')){
     var	password = readCookie('pass');
     
     
     }else{
     var username = prompt("please enter your wink email", "");
     createCookie("username", username, 365);
     var password = prompt("please enter your wink password", "");
     createCookie("pass", password, 365);
     }
     
     }else{
     var username = prompt("please enter your wink email", "");
     createCookie("username", username, 365);
     var password = prompt("please enter your wink password", "");
     createCookie("pass", password, 365);
     }
     */
    
    var clientid = 'quirky_wink_android_app';
    var clientsecret = 'e749124ad386a5a35c0ab554a4f2c045';
    var sendstring = "{\"client_id\":\"" + clientid + "\",\"client_secret\":\"" + clientsecret + "\",\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"grant_type\":\"password\"}";
    
    xhr.open('POST', 'https://winkapi.quirky.com/oauth2/token');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (typeof cb !== "undefined") {
                cb(this);
            }
            else {
                var result = this.responseText;
                
                obj = JSON.parse(result);
                
                AccessToken = obj.access_token;
                RefreshToken = obj.refresh_token;
                TokenType = obj.token_type;
                loadDeviceArrays();
                return;
            }
        }
    };
    xhr.send(sendstring);
    
    //document.getElementById("winkResult").innerHTML = "fillbody";
}

function createRows(row){
    var result = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "10px";
    td.style.align = "center";
    td.id = "State" + row;
    result.appendChild(td);
    var td = document.createElement("td");
    td.style.width = "100px";
    td.style.align = "center";
    td.id = "Desc" + row;
    td.style.fontSize = "10px";
    result.appendChild(td);
    var td = document.createElement("td");
    td.style.width = "160px";
    td.style.align = "left";
    td.id = "Switch" + row;
    td.style.fontSize = "10px";
    result.appendChild(td);
    return result;
}

function updateSensors(wink, row){
    document.getElementById("winkResult").innerHTML = "Updating Sensor Status...";
    var cell = document.getElementById("Switch" + row);
    var divSensor = document.createElement('div');
    var imgBattery = document.createElement('img');
    if(wink.last_reading.battery > .8)
        imgBattery.src = 'png/battery/battery_100.png';
    if((wink.last_reading.battery <= .8) && (wink.last_reading.battery > .6))
        imgBattery.src = 'pgn/battery/battery_75.png';
    if((wink.last_reading.battery <= .6) && (wink.last_reading.battery > .3))
        imgBattery.src = 'pgn/battery/battery_50.png';
    if((wink.last_reading.battery <= .3) && (wink.last_reading.battery > .15))
        imgBattery.src = 'pgn/battery/battery_75.png';
    if((wink.last_reading.battery <= .15) && (wink.last_reading.battery > 0))
        imgBattery.src = 'pgn/battery/battery_10.png';
    imgBattery.alt = wink.last_reading.battery;
    divSensor.appendChild(imgBattery);
    imgOpened = document.createElement('img');
    if(wink.name.search("Door") > 0)
        if(wink.name.search("Garage") > 0){
            if(wink.last_reading.opened)
                imgOpened.src = 'png/sensors/sensors_small_garagedoor_open.png';
            else
                imgOpened.src = 'png/sensors/sensors_small_garagedoor_closed.png';
        }
        else{
            if(wink.last_reading.opened)
                imgOpened.src = 'png/sensors/sensors_small_door_open.png';
            else
                imgOpened.src = 'png/sensors/sensors_small_door_closed.png';
        }
    if(wink.name.search("Window") > 0)
        if(wink.last_reading.opened)
            imgOpened.src = 'png/sensors/sensors_small_window_open.png';
        else
            imgOpened.src = 'png/sensors/sensors_small_window_closed.png';
    if(wink.name.search("Cabinet") > 0)
        if(wink.last_reading.opened)
            imgOpened.src = 'png/sensors/sensors_small_cabinet_open.png';
        else
            imgOpened.src = 'png/sensors/sensors_small_cabinet_closed.png';
    divSensor.appendChild(imgOpened);
    cell.appendChild(divSensor);
    document.getElementById("winkResult").innerHTML = "Found "
    + controlWinks.length + " Wink devices"; // + resp;
}

function updateRefuel(wink, row){
    document.getElementById("winkResult").innerHTML = "Updating Refuel Status...";
    var cell = document.getElementById("Switch" + row);
    var divSensor = document.createElement('div');
    var imgBattery = document.createElement('img');
    if(wink.last_reading.battery > .8)
        imgBattery.src = 'png/battery/battery_100.png';
    if((wink.last_reading.battery <= .8) && (wink.last_reading.battery > .6))
        imgBattery.src = 'pgn/battery/battery_75.png';
    if((wink.last_reading.battery <= .6) && (wink.last_reading.battery > .3))
        imgBattery.src = 'pgn/battery/battery_50.png';
    if((wink.last_reading.battery <= .3) && (wink.last_reading.battery > .15))
        imgBattery.src = 'pgn/battery/battery_75.png';
    if((wink.last_reading.battery <= .15) && (wink.last_reading.battery > 0))
        imgBattery.src = 'pgn/battery/battery_10.png';
    imgBattery.alt = wink.last_reading.battery;
    divSensor.appendChild(imgBattery);
    var imgRefuel = document.createElement('img');
    if(wink.last_reading.remaining > .8)
        imgRefuel.src = 'png/refuel/ic_device_refuel_stroke.png';
    if((wink.last_reading.remaining <= .8) && (wink.last_reading.refuel > .6))
        imgRefuel.src = 'pgn/refuel/ic_refuel_4.png';
    if((wink.last_reading.remaining <= .6) && (wink.last_reading.refuel > .4))
        imgRefuel.src = 'pgn/refuel/ic_refuel_3.png';
    if((wink.last_reading.remaining <= .4) && (wink.last_reading.refuel > .3))
        imgRefuel.src = 'pgn/refuel/ic_refuel_2.png';
    if((wink.last_reading.remaining <= .3) && (wink.last_reading.refuel > .15))
        imgRefuel.src = 'pgn/refuel/ic_refuel_1.png';
    if((wink.last_reading.remaining <= .15) && (wink.last_reading.refuel > 0))
        imgRefuel.src = 'pgn/refuel/ic_refuel_0.png';
    imgRefuel.alt = wink.last_reading.battery;
    divSensor.appendChild(imgRefuel);
    cell.appendChild(divSensor);
    document.getElementById("winkResult").innerHTML = "Found "
    + controlWinks.length + " Wink devices"; // + resp;
}

function getGroupRow(wink, row) {
    var cell = document.getElementById("State" + row);
    var state = document.createElement("img");
    bPowered = false;
    if(wink.reading_aggregation.powered.true_count > 0)
        bPowered = true;
    state.src = "png/lights/" + bPowered + ".png";
    state.alt = bPowered;
    cell.appendChild(state);
    var cell = document.getElementById("Desc" + row);
    var divDesc = document.createElement('div');
    divDesc.style.align = 'center';
    divDesc.style.width = 60;
    divDesc.style.textAlign = 'center';
    var img = document.createElement("img");
    img.src = "png/lights/light_bulb.png";
    img.width = 48;
    img.height = 48;
    divDesc.appendChild(img);
    divDesc.appendChild(document.createElement("br"));
    divDesc.appendChild(document.createTextNode(wink.name));
    cell.appendChild(divDesc);
    var cell = document.getElementById("Switch" + row);
    cell.style.width = "160px";
    var wink_id = wink.group_id;
    if(wink.reading_aggregation.powered.or)
        nLight[row] = (wink.reading_aggregation.brightness.average) * 100;
    else
        nLight[row] = 0;
    mySliderLight[row] = new dhtmlXSlider({
                                          parent: "Switch" + row,
                                          value: nLight[row],
                                          tooltip: true,
                                          skin: "dhx_web",
                                          size: 150,
                                          step: 10,
                                          min: 0,
                                          max: 100
                                          });
    // Add Line Break
    var lineNext = document.createElement("BR");
    cell.appendChild(lineNext);
    var temp_bg = document.createElement("img");
    temp_bg.src = "png/lights/lightlegend.gif";
    temp_bg.style.paddingTop = "5px";
    temp_bg.style.align = "left";
    cell.appendChild(temp_bg);
    if(mySliderLight.length > 0)
        mySliderLight[row].attachEvent("onSlideEnd", function(newLight){
                                       var deviceTarget = "groups/" + wink_id + "/activate";
                                       if(newLight > 0)
                                       bPowered = true;
                                       else
                                       bPowered = false;
                                       value = newLight/100;
                                       var body = {
                                       "desired_state":
                                       {
                                       "powered":bPowered,"brightness":value
                                       }
                                       };
                                       setGroup(deviceTarget, body);
                                       //			wink[1].desired_state.powered = bPowered;
                                       //			wink[1].desired_state.brightness = value;
                                       wink.reading_aggregation.powered.or = bPowered;
                                       wink.reading_aggregation.brightness.average = value;
                                       updateGroupDevices(wink, value);
                                       });
}

function updateGroupDevices(wink, value){
    for(i = 0; i < wink.members.length; i++){
        for(j = 0; j < lightWinks.length; j++){
            if(wink.members[i].object_id == lightWinks[j][1].light_bulb_id){
                lightWinks[j][1].last_reading.brightness = value;
                if(value > 0)
                    lightWinks[j][1].last_reading.powered = true;
                else
                    lightWinks[j][1].last_reading.powered = false;
            }
        }
    }
}

function getSceneRow(wink, row) {
    var cell = document.getElementById("State" + row);
    var state = document.createElement("img");
    cell.appendChild(state);
    var cell = document.getElementById("Desc" + row);
    var divDesc = document.createElement('div');
    var targetScene = 'scenes/' + wink.scene_id + '/activate';
    divDesc.style.align = 'center';
    divDesc.style.width = 60;
    divDesc.style.textAlign = 'center';
    var img = document.createElement("img");
    img.src = "png/lights/light_bulb.png";
    img.width = 48;
    img.height = 48;
    img.onclick = function(){
        setScene(targetScene);
        updateSceneDevices(wink);
    }
    divDesc.appendChild(img);
    divDesc.appendChild(document.createElement("br"));
    divDesc.appendChild(document.createTextNode(wink.name));
    cell.appendChild(divDesc);
    
}

function updateSceneDevices(wink){
    for(i = 0; i < wink.members.length; i++){
        for(j = 0; j < lightWinks.length; j++){
            if(wink.members[i].object_id == lightWinks[j][1].light_bulb_id){
                lightWinks[j][1].last_reading.brightness = wink.members[i].desired_state.brightness;
                lightWinks[j][1].last_reading.powered = wink.members[i].desired_state.powered;
            }
        }
    }
}

/*
 function updateHub(wink, row){
	document.getElementById("winkResult").innerHTML = "Updating Hub Status...";
	if('WebSocket' in window){
 var ws = new WebSocket("ws://" + wink.last_reading.ip_address);
 ws.onerror = function(error){
 ws.close();
 ws = null;
 var cell = document.getElementById("State" + row);
 cell.innerHTML = "";
 var state = document.createElement("img");
 state.src = "png/hub/true.png";
 state.alt = "On-Line";
 cell.appendChild(state);
 };
 setTimeout(function(){
 if(ws != null){
 ws.close();
 ws = null;
 var cell = document.getElementById("State" + row);
 cell.innerHTML = "";
 var state = document.createElement("img");
 state.src = "png/hub/false.png";
 state.alt = "Off-Line";
 cell.appendChild(state);
 }
 }, 2000);
	}
	else
 alert("WebSocket are not supported");
	document.getElementById("winkResult").innerHTML = "Found "
 + controlWinks.length + " Wink devices"; // + resp;
 }
 
 */

function showDevices(device_array){
    var tbody = document.createElement("tbody");
    for (var i = 0; i < device_array.length; i++) {
        tbody.appendChild(createRows(i));
    }
    var winkTable = document.getElementById("winkTable");
    try {
        
        winkTable.replaceChild(tbody, document.getElementById("winkDevices"));
    }
    catch (e) {
        
        winkTable.replaceChild(tbody, document.getElementById("winkDevicesScenes"));
    }
    tbody.setAttribute("id", "winkDevices");
    for (var i = 0; i < device_array.length; i++) {
        getWinkRow(device_array[i], i);
    }
    
}

function showGroups(){
    var tbody = document.createElement("tbody");
    for (var i = 0; i < groupsWinks.length; i++) {
        tbody.appendChild(createRows(i));
    }
    var winkTable = document.getElementById("winkTable");
    try {
        
        winkTable.replaceChild(tbody, document.getElementById("winkDevices"));
    }
    catch (e) {
        
        winkTable.replaceChild(tbody, document.getElementById("winkDevicesScenes"));
    }
    tbody.setAttribute("id", "winkDevices");
    for (var i = 0; i < groupsWinks.length; i++) {
        getGroupRow(groupsWinks[i], i);
    }
}

function showScenes(){
    var tbody = document.createElement("tbody");
    for (var i = 0; i < scenesWinks.length; i++) {
        tbody.appendChild(createRows(i));
    }
    var winkTable = document.getElementById("winkTable");
    winkTable.replaceChild(tbody, document.getElementById("winkDevices"));
    tbody.setAttribute("id", "winkDevicesScenes");
    for (var i = 0; i < scenesWinks.length; i++) {
        getSceneRow(scenesWinks[i], i);
    }
}

function loadDeviceArrays(){
    controlWinks = [];
    lightWinks = [];
    switchWinks = [];
    sensorWinks = [];
    scenesWinks = [];
    groupsWinks = [];
    var xhr = createRequest();
    xhr.open('GET', 'https://winkapi.quirky.com/users/me/wink_devices');
    xhr.setRequestHeader("Authorization","Bearer " + AccessToken);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4)
            if (xhr.status != 200) {
                // Handle request failure here...
                document.getElementById("winkResult").innerHTML = "Error Calling Wink REST API "
                + xhr.status + " " + xhr.statusText;
                
                document.getElementById("loginform").style.display = 'block';
                return;
            }
            else {
                var text = this.responseText;
                obj = JSON.parse(text);
                document.getElementById("winkResult").innerHTML = "Calling Wink REST API";
                
                // Request successful, read the response
                var resp = xhr.responseText;
                // ... and use it as needed by your app.
                var winks = JSON.parse(resp);
                device_type = "";
                for (var i = 0; i < winks.data.length; i++) {
                    for(var j = 0; j < Object.keys(winks.data[i]).length; j++){
                        if(Object.keys(winks.data[i])[j] == 'outlets'){
                            switchWinks.push(["outlet", winks.data[i].outlets[0]]);
                            switchWinks.push(["outlet", winks.data[i].outlets[1]]);
                            break;
                            
                        }
                        else if(Object.keys(winks.data[i])[j - 1] != 'powerstrip_id' && Object.keys(winks.data[i])[j] == 'name'){
                            var device_type = Object.keys(winks.data[i])[j - 1];
                            break;
                        }
                    }
                    device_type_short = device_type.substring(0, device_type.length - 3);
                    if(device_type_short != 'hub'){
                        switch(device_type){
                            case 'light_bulb_id': //Array for light bulbs
                                lightWinks.push([device_type_short, winks.data[i]]);
                                break;
                            case 'binary_switch_id':  //Array for switches
                                switchWinks.push([device_type_short, winks.data[i]]);
                                break;
                                
                            case 'outlet_id':  //Array for switches
                                break;
                            case 'sensor_pod_id':  //Array for various sensors
                            case 'smoke_detector_id':
                            case 'propane_tank_id':
                                sensorWinks.push([device_type_short, winks.data[i]]);
                                break;
                            default:  //Array for devices that don't fall into other spaces that can be controlled
                                controlWinks.push([device_type_short, winks.data[i]]);
                                break;
                        }
                    }
                }
                
                loadGroupArray();
            }
    };
    document.getElementById("winkResult").innerHTML = "Loading Devices...";
    xhr.send();
}

function loadGroupArray(){
    var xhr = createRequest();
    xhr.open('GET', 'https://winkapi.quirky.com/users/me/groups');
    xhr.setRequestHeader("Authorization","Bearer " + AccessToken);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4)
            if (xhr.status != 200) {
                // Handle request failure here...
                document.getElementById("winkResult").innerHTML = "Error Calling Wink REST API "
                + xhr.status + " " + xhr.statusText;
                return;
            }
            else {
                var text = this.responseText;
                obj = JSON.parse(text);
                document.getElementById("winkResult").innerHTML = "Calling Wink REST API";
                
                // Request successful, read the response
                var resp = xhr.responseText;
                // ... and use it as needed by your app.
                var winks = JSON.parse(resp);
                for (var i = 0; i < winks.data.length; i++) {
                    groupsWinks.push(winks.data[i]);
                }
                document.getElementById("winkResult").innerHTML = "Found "
                + groupsWinks.length + " Wink groups"; // + resp;
                var winkTable = document.getElementById("winkTable");
                loadSceneArray();
            }
    };
    document.getElementById("winkResult").innerHTML = "Loading Groups...";
    xhr.send();
}

function loadSceneArray(){
    var xhr = createRequest();
    xhr.open('GET', 'https://winkapi.quirky.com/users/me/scenes');
    xhr.setRequestHeader("Authorization","Bearer " + AccessToken);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4)
            if (xhr.status != 200) {
                // Handle request failure here...
                document.getElementById("winkResult").innerHTML = "Error Calling Wink REST API "
                + xhr.status + " " + xhr.statusText;
                return;
            }
            else {
                var text = this.responseText;
                obj = JSON.parse(text);
                document.getElementById("winkResult").innerHTML = "Calling Wink REST API";
                
                // Request successful, read the response
                var resp = xhr.responseText;
                // ... and use it as needed by your app.
                var winks = JSON.parse(resp);
                for (var i = 0; i < winks.data.length; i++) {
                    //Remove hubs and sensors from device list
                    scenesWinks.push(winks.data[i]);
                }
                document.getElementById("winkResult").innerHTML = "";
                var winkTable = document.getElementById("winkTable");
                showDevices(lightWinks);
            }
    };
    document.getElementById("winkResult").innerHTML = "Loading Shortcuts...";
    xhr.send();
    //loadDeviceArrays();
    //window.setTimeout(function(){loadDeviceArrays()},60000);
}

function setDevice(deviceTarget, body) {
    var xhr = new XMLHttpRequest();
    // Create the callback:
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
            return; // Not there yet
        if (xhr.status != 200) {
            // Handle xhruest failure here...
            document.getElementById("winkResult").innerHTML = "Error Calling Wink REST API "
            + xhr.status;
            return;
        }
        // Request successful, read the response
        var resp = xhr.responseText;
        document.getElementById("winkResult").innerHTML = "Seting Device State";
    }
    xhr.open("PUT", 'https://winkapi.quirky.com/' + deviceTarget);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization","Bearer " + AccessToken);
    xhr.send(JSON.stringify(body));
}

function setScene(sceneTarget) {
    var xhr = new XMLHttpRequest();
    // Create the callback:
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
            return; // Not there yet
        if (xhr.status != 200) {
            // Handle xhruest failure here...
            document.getElementById("winkResult").innerHTML = "Error Calling Wink REST API "
            + xhr.status;
            return;
        }
        // Request successful, read the response
        var resp = xhr.responseText;
        document.getElementById("winkResult").innerHTML = "Seting Device State";
    }
    xhr.open("POST", 'https://winkapi.quirky.com/' + sceneTarget);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization","Bearer " + AccessToken);
    xhr.send(null);
}

function setGroup(groupTarget, body) {
    var xhr = new XMLHttpRequest();
    // Create the callback:
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
            return; // Not there yet
        if (xhr.status != 200) {
            // Handle xhruest failure here...
            document.getElementById("winkResult").innerHTML = "Error Calling Wink REST API "
            + xhr.status;
            return;
        }
        // Request successful, read the response
        var resp = xhr.responseText;
        document.getElementById("winkResult").innerHTML = "Seting Device State";
    }
    xhr.open("POST", 'https://winkapi.quirky.com/' + groupTarget);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization","Bearer " + AccessToken);
    xhr.send(JSON.stringify(body));
}