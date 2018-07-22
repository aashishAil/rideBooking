window.onload = function (){
    getData();
};

function getData() {
    var xmlHttp = new XMLHttpRequest();
    var url = 'http://192.168.0.4:5432/api/requests/' + document.getElementById('driverId').innerHTML;
    var mimeType = "application/json";

    xmlHttp.onreadystatechange = function(){
        if(this.readyState == 4){
            if (this.status == 200){
                addTables(JSON.parse(this.response));
            }
            else if( this.status == 500){
                document.getElementById('waiting').innerHTML = "Some error occured";
            }
        }
    };

    xmlHttp.open('GET', url, true);
    xmlHttp.setRequestHeader('Content-Type', mimeType);
    xmlHttp.send(null);
}

function acceptRequest(){
    var xmlHttp = new XMLHttpRequest();
    var url = 'http://192.168.0.4:5432/api/requests/' + this.id;
    var mimeType = "application/json";
    var sendData = {
      driverId : document.getElementById('driverId').innerHTML
    };

    xmlHttp.onreadystatechange = function(){
        if(this.readyState == 4){
            if (this.status == 200){
                window.alert('Request successfully accepted');
                location.reload();
            }
            else if( this.status == 400){
                window.alert(this.responseText);
            }
            else if( this.status == 404){
                window.alert(this.responseText);
                location.reload();
            }
            else if( this.status == 202){
                window.alert(this.responseText);
                location.reload();
            }
            else if( this.status == 500){
                window.alert(this.responseText);
            }
        }
    };

    xmlHttp.open('POST', url, true);
    xmlHttp.setRequestHeader('Content-Type', mimeType);
    xmlHttp.send(JSON.stringify(sendData));
}

function addTables(data){
    addWaitingData(data.waiting);
    addOngoingData(data.ongoing);
    addCompletedData(data.completed);
}

function addWaitingData(waiting){
    var table = document.getElementById('waiting');
    table.innerHTML = null;
    table.border = '1';
    var tr = document.createElement('TR');
    table.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode('Waiting'));
    th.width = '150';
    tr.appendChild(th);
    for(var i = 0 ; i < waiting.length ; i++){
        tr = document.createElement('TR');
        var td = document.createElement('TD');
        tr.appendChild(td);
        var masterdiv = document.createElement('DIV');
        td.appendChild(masterdiv);
        var div1 = document.createElement('DIV');
        var div2 = document.createElement('DIV');
        var div3 = document.createElement('DIV');
        masterdiv.appendChild(div1);
        masterdiv.appendChild(div2);
        masterdiv.appendChild(div3);
        var leftSpan = document.createElement('SPAN');
        var rightSpan = document.createElement('SPAN');
        div1.appendChild(leftSpan);
        div1.appendChild(rightSpan);
        leftSpan.appendChild(document.createTextNode('Req. id: ' + waiting[i].requestId));
        rightSpan.appendChild(document.createTextNode(' Cust. id: '+ waiting[i].customerId));
        div2.appendChild(document.createTextNode(waiting[i].requestTime + "ago"));
        var button = document.createElement('BUTTON');
        div3.appendChild(button);
        button.innerHTML = 'Select';
        button.id = waiting[i].requestId;
        button.onclick = acceptRequest;
        table.appendChild(tr);
    }
}

function addOngoingData(ongoing){
    var table = document.getElementById('ongoing');
    table.innerHTML = null;
    table.border = '1';
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode('Ongoing'));
    th.width = '150';
    tr.appendChild(th);
    for(var i = 0 ; i < ongoing.length ; i++){
        tr = document.createElement('TR');
        var td = document.createElement('TD');
        tr.appendChild(td);
        var masterdiv = document.createElement('DIV');
        td.appendChild(masterdiv);
        var div1 = document.createElement('DIV');
        var div2 = document.createElement('DIV');
        var div3 = document.createElement('DIV');
        masterdiv.appendChild(div1);
        masterdiv.appendChild(div2);
        masterdiv.appendChild(div3);
        var leftSpan = document.createElement('SPAN');
        var rightSpan = document.createElement('SPAN');
        div1.appendChild(leftSpan);
        div1.appendChild(rightSpan);
        leftSpan.appendChild(document.createTextNode('Req. id: ' + ongoing[i].requestId));
        rightSpan.appendChild(document.createTextNode(' Cust. id: '+ ongoing[i].customerId));
        div2.appendChild(document.createTextNode('Request : '+ ongoing[i].requestTime + "ago"));
        div3.appendChild(document.createTextNode('Picked : '+ ongoing[i].pickedUpTime + "ago"));
        table.appendChild(tr);
    }
}

function addCompletedData(completed){
    var table = document.getElementById('completed');
    table.innerHTML = null;
    table.border = '1';
    var tr = document.createElement('TR');
    table.appendChild(tr);
    var th = document.createElement('TH');
    th.width = '150';
    th.appendChild(document.createTextNode('Completed'));
    tr.appendChild(th);
    for(var i = 0 ; i < completed.length ; i++){
        tr = document.createElement('TR');
        var td = document.createElement('TD');
        tr.appendChild(td);
        var masterdiv = document.createElement('DIV');
        td.appendChild(masterdiv);
        var div1 = document.createElement('DIV');
        var div2 = document.createElement('DIV');
        var div3 = document.createElement('DIV');
        var div4 = document.createElement('DIV');
        masterdiv.appendChild(div1);
        masterdiv.appendChild(div2);
        masterdiv.appendChild(div3);
        masterdiv.appendChild(div4);
        var leftSpan = document.createElement('SPAN');
        var rightSpan = document.createElement('SPAN');
        div1.appendChild(leftSpan);
        div1.appendChild(rightSpan);
        leftSpan.appendChild(document.createTextNode('Req. id: ' + completed[i].requestId));
        rightSpan.appendChild(document.createTextNode(' Cust. id: '+ completed[i].customerId));
        div2.appendChild(document.createTextNode('Request : '+ completed[i].requestTime + "ago"));
        div3.appendChild(document.createTextNode('Picked : '+ completed[i].pickedUpTime + "ago"));
        div4.appendChild(document.createTextNode('Completed : '+ completed[i].completedTime + "ago"));
        table.appendChild(tr);
    }
}
