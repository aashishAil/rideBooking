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

            }
            else if( this.status == 500){

            }
        }
    }

    xmlHttp.open('GET', url, true);
    xmlHttp.setRequestHeader('Content-Type', mimeType);
    xmlHttp.send(null);
}