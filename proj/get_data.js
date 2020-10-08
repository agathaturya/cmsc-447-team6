
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//get data from maryland covid data api
//and put in db
function getNewestData(){
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if ((this.readyState===4) && (this.status===200))
//    console.log('xhttp.responseText = '  +xhttp.responseText);
    
    //putting in database
    postData(xhttp.responseText);
   
}

xhttp.open('GET', "https://opendata.arcgis.com/datasets/0573e90adab5434f97b082590c503bc1_0.geojson");
xhttp.send();


}
//getDataByObjId(10);
getNewestData();
//get the data for one day of covid counts by county, by obj id
function getDataByObjId(id){
    var idHttp = new XMLHttpRequest();
    idHttp.onreadystatechange = function(){
	 if ((this.readyState===4) && (this.status===200)){
             console.log('got data');
             console.log('response.responseText = '  +idHttp.responseText);
        }
    }
    idHttp.open("GET", "http://127.0.0.1:5000/get_by_id/10");
    idHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    idHttp.send();
    
}
//post data to database thru rest api
function postData(text){
    var dbHTTP = new XMLHttpRequest();
    dbHTTP.onreadystatechange = function() {
	if ((this.readyState===4) && (this.status===200)){
	    console.log('posted data');
	console.log('dbresponse.responseText = '  +dbHTTP.responseText);
	}
	//todo: print out response for other status codes?
    }
    //open
    dbHTTP.open("POST", "http://127.0.0.1:5000/md_covid_data.json");
    dbHTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    dbHTTP.send(JSON.stringify(text));
    //send
}
