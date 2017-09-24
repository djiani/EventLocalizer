//get event data
const ENDPOINT = "/events/search"
let map = "";
function show_alert(term,location)
{

   var oArgs = {

      app_key: "vkRWVXRJFdcgFJCr",

      q: term,

      where: location, 

      //"date": "2017061000-2018062000",

      page_size: 60,

      sort_order: "popularity",

   };
   //

   EVDB.API.call(ENDPOINT, oArgs, function(oData) {
      // Note: this relies on the custom toString() methods below
      var data = oData.events.event;
      console.log(data);
       setMaps(data, location); 
      

    });

}

function myMap() {
   map = new google.maps.Map(document.getElementById("js-displaymap"), {
    center:{lat: 40.7608, lng: -111.8910},
    zoom:4,
  });
}


function setMaps(data, location){
  let geocoder = new google.maps.Geocoder(); 
  map = new google.maps.Map(document.getElementById("js-displaymap"), {
    center:{lat: 40.7608, lng: -111.8910},
    zoom:4,
  });

  geocoder.geocode({
    'address': location
  }, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(10);
    }
    else {  //location is not found
      console.log('status error: ' + status);
    }
  });

  
  for(var i=0; i< data.length; i++){
    let imgUrl = "";
    let desc = "";
    if(!data[i].image){
      console.log("data not defined");
    }
    else{
      if(data[i].image.medium.url != null){
        imgUrl = data[i].image.medium.url;
        console.log(data[i].image.medium.url);
      }

      if(data[i].description != null){
        desc = data[i].description;
      }

      var marker = new google.maps.Marker({
          position: {lat: parseFloat(data[i].latitude), lng: parseFloat(data[i].longitude)},
          map: map,
          title: data[i].title,
          clickable: true
        }
      );

      let date = new Date(data[i].start_time);
      marker.info = new google.maps.InfoWindow({
        content: `
        <div>
        <img src= ${imgUrl} class="imageInfo">
        <h3> <a href="${data[i].url}"> ${data[i].title} </a></h3> 
        <h5>Date: ${date.toLocaleDateString() } </h5>
        <h5>Time: ${date.toLocaleTimeString() } </h5>
        <p>${desc}</p>
        </div> `
      });

      google.maps.event.addListener(marker, 'click', function() {
        var marker_map = this.getMap();
        this.info.open(map, this);
      });
    }
  }

}



$(function(){
   $("form").submit(function(event){
    event.preventDefault();
    let searchTerm = $("#searchEvent").val();
    let location = $("#location").val();
    console.log(searchTerm+ "  "+location);
    show_alert(searchTerm, location);
   
   });
   //initial display maps
  myMap();
   
});



