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

function addTables(data){
    addWaitingData(data.waiting);
    addOngoingData(data.ongoing);
    addCompletedData(data.completed);
}

function addWaitingData(waiting){
    var table = document.getElementById('waiting');
    table.border = '1';
    var tr = document.createElement('TR');
    table.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode('Waiting'));
    th.width = '150';
    tr.appendChild(th);
    for(var i = 0 ; i < waiting.length ; i++){

    }
}

function addOngoingData(ongoing){
    var table = document.getElementById('ongoing');
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

    }
}

function addCompletedData(completed){
    var table = document.getElementById('completed');
    table.border = '1';
    var tr = document.createElement('TR');
    table.appendChild(tr);
    var th = document.createElement('TH');
    th.width = '150';
    th.appendChild(document.createTextNode('Completed'));
    tr.appendChild(th);
    for(var i = 0 ; i < completed.length ; i++){

    }
}
