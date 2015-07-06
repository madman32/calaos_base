"use strict";function popuplateApiList(){var a=0;$("#api_list").append($("<option />").val(a++).html("Custom request"));for(var b=1;b<apiList.length;b++){var c=JSON.parse(apiList[b]).msg;"set_state"==c&&(c=c+" "+JSON.parse(apiList[b]).data.type),("audio"==c||"audio_db"==c)&&(c=c+" "+JSON.parse(apiList[b]).data.audio_action),$("#api_list").append($("<option />").val(a++).html(c))}$("#api_list").change(function(){var a=$("#api_list option:selected").val(),b=apiList[parseInt(a)];""!=$("#username").val()&&(b=b.replace("USERNAME",$("#username").val())),""!=$("#passwd").val()&&(b=b.replace("PASSWORD",$("#passwd").val())),$("#message").val(JSON.stringify(JSON.parse(b),null,"    "))}),$("#api_list").change()}function addLog(a,b){b="undefined"!=typeof b?b:!1;var c=loginfos.length,d=$("<p></p>");loginfos.push(a),$(".log").append(d),"connected"==a.type?(d.append($('<span class="glyphicon glyphicon-ok">')),d.append("Connected")):"disconnected"==a.type?(d.append($('<span class="glyphicon glyphicon-remove">')),d.append("Disconnected")):"error"==a.type?(d.append($('<span class="glyphicon glyphicon-remove-sign">')),d.append(a.type)):b?(d.append($('<span class="glyphicon glyphicon-export">')),d.append(""==a.type?'Empty "msg"':a.type)):(d.append($('<span class="glyphicon glyphicon-import">')),d.append(""==a.type?'Empty "msg"':a.type)),$(".badge").html(loginfos.length),d.on("click",function(){var a,b=loginfos[c];try{a=JSON.stringify(JSON.parse(b.json),null,"    ")}catch(d){a=b.json}$("#answer").html(a),$("pre code").each(function(a,b){hljs.highlightBlock(b)})})}function clearLog(){loginfos=[],$(".log").html(""),$(".badge").html("0")}var apiList=['{ "msg": "" }','{ "msg": "login", "msg_id": "1234", "data": { "cn_user": "USERNAME", "cn_pass": "PASSWORD" } }','{ "msg": "get_home", "msg_id": "1234" }','{ "msg": "get_state", "msg_id": "1234", "data": { "inputs": ["input_0"], "outputs": ["output_0", "output_1"], "audio_players": ["0"] } }','{ "msg": "set_state", "msg_id": "1234", "data": { "type": "output", "id": "output_0", "value": "true" } }','{ "msg": "set_state", "msg_id": "1234", "data": { "type": "input", "id": "input_0", "value": "true" } }','{ "msg": "set_state", "msg_id": "1234", "data": { "type": "audio", "player_id": "0", "value": "volume 75" } }','{ "msg": "set_state", "msg_id": "1234", "data": { "type": "camera", "camera_id": "0", "camera_action": "move", "value": "left" } }','{ "msg": "get_playlist", "msg_id": "1234", "data": { "player_id": "0" } }','{ "msg": "get_io", "msg_id": "1234", "data": { "inputs": ["input_0"], "outputs": ["output_0", "output_1"] } }','{ "msg": "audio_db", "msg_id": "1234", "data": { "audio_action": "get_stats", "player_id": "0" } }','{ "msg": "audio", "msg_id": "1234", "data": { "audio_action": "get_playlist_size", "player_id": "0" } }','{ "msg": "audio", "msg_id": "1234", "data": { "audio_action": "get_time", "player_id": "0" } }','{ "msg": "audio", "msg_id": "1234", "data": { "audio_action": "get_playlist_item", "item": "0", "player_id": "0" } }','{ "msg": "audio_db", "msg_id": "1234", "data": { "audio_action": "get_album_item", "from": "0", "count": "1", "player_id": "0" } }','{ "msg": "audio_db", "msg_id": "1234", "data": { "audio_action": "get_artist_album", "from": "0", "count": "1", "artist_id": "0", "player_id": "0" } }','{ "msg": "audio_db", "msg_id": "1234", "data": { "audio_action": "get_year_albums", "from": "0", "count": "1", "year": "2000", "player_id": "0" } }','{ "msg": "audio_db", "msg_id": "1234", "data": { "audio_action": "get_genre_artists", "from": "0", "count": "1", "genre": "0", "player_id": "0" } }'],ws=new Object,loginfos=[];$(document).ready(function(){popuplateApiList(),$("#urlinput").val("ws://"+window.location.host+"/api"),$("#btdisconnect").on("click",function(){ws.close()}),$("#btsend").on("click",function(){var a=$("#message").val();if(!("readyState"in ws&&ws.readyState==ws.OPEN))return console.log("sending error"),void addLog({type:"error",msg_id:"",json:"Websocket connection closed"});ws.send(a);var b=JSON.parse(a),c="",d="UNKNOWN!!";b.hasOwnProperty("msg_id")&&(c=b.msg_id),b.hasOwnProperty("msg")&&(d=b.msg),addLog({type:d,msg_id:c,json:a},!0)}),$("#btclear").on("click",function(){clearLog()}),$("#btconnect").on("click",function(){ws=new WebSocket($("#urlinput").val()),ws.onopen=function(){$("#status_con").removeClass("label-danger"),$("#status_con").addClass("label-success"),$("#status_con").html("Connected"),addLog({type:"connected",msg_id:"",json:"OPEN"})},ws.onclose=function(){$("#status_con").removeClass("label-success"),$("#status_con").addClass("label-danger"),$("#status_con").html("Disconnected"),addLog({type:"disconnected",msg_id:"",json:"CLOSED"})},ws.onmessage=function(a){console.log(a.data);var b=JSON.parse(a.data),c="",d="UNKNOWN!!";b.hasOwnProperty("msg_id")&&(c=b.msg_id),b.hasOwnProperty("msg")&&(d=b.msg),addLog({type:d,msg_id:c,json:a.data})},ws.onerror=function(a){$("#status_con").removeClass("label-success"),$("#status_con").addClass("label-danger"),$("#status_con").html("Disconnected"),addLog({type:"error",msg_id:"",json:a.data})}})});