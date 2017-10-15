//get event data
const ENDPOINT = "/events/search"
let map = "";
let marker= [];
function show_alert(term,location)
{

   var oArgs = {

      app_key: "vkRWVXRJFdcgFJCr",

      q: term,

      where: location, 

      //"date": "2017061000-2018062000",

      page_size: 30,

      sort_order: "popularity",

   };
   //

   EVDB.API.call(ENDPOINT, oArgs, function(oData) {
      // Note: this relies on the custom toString() methods below
      var data = oData.events.event;
      console.log(data);
      displayResults(data)
       setMaps(data, location);

      

    });

}

function displayResults(data){
  let html =`<h4>List of Events found:</h4>
  <ul>`;
  for(let i=0; i< data.length; i++){
    html += `<li class="js-data" data-id=${i}><a href='#'>${data[i].title}</a></li><br>`
  }
  html += `</ul>`;
  $("#js-displResults").html(html);
}


function initMap() {
   map = new google.maps.Map(document.getElementById("js-displaymap"), {
    center:{lat: 40.7608, lng: -111.8910},
    zoom:4,
  });
/*
  let events =["Concerts", "Festivals", "comedy", "Familly","nightlife", "performance arts", "conferances", "education", "film", "food", "museums", "technology" ];
  let i = 0;
  setInterval(function(){
    i++;
    let targetElt =document.getElementById('searchEvent');
    targetElt.text(events[i% events.length]);
  }, 2000);*/
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
    if(data[i].image && data[i].image.medium){
      if(data[i].image.medium.url){
        imgUrl = data[i].image.medium.url;
        //console.log(data[i].image.medium.url);
      }
    }

    if(data[i].description){
      desc = data[i].description;
    }

    marker[i] = new google.maps.Marker({
      position: {lat: parseFloat(data[i].latitude), lng: parseFloat(data[i].longitude)},
      map: map,
      title: data[i].title,
      clickable: true,
      animation:google.maps.Animation.DROP
    });

    let date = new Date(data[i].start_time);
    marker[i].info = new google.maps.InfoWindow({
      content: `
      <div>
      <img src= ${imgUrl} class="imageInfo">
      <h3> <a href="${data[i].url}"> ${data[i].title} </a></h3> 
      <h5>Date: ${date.toLocaleDateString() } </h5>
      <h5>Time: ${date.toLocaleTimeString() } </h5>
      <p>${desc}</p>
      </div> `
    });

    google.maps.event.addListener(marker[i], 'click', function() {
      var marker_map = this.getMap();
      this.info.open(map, this);
    });
    
  }

}
function updateMarker(index){
  console.log('index '+ index);
  for(let i=0; i < marker.length; i++){
    marker[i].setAnimation(null);
  }
  marker[index].setAnimation(google.maps.Animation.BOUNCE);
  marker[index].setMap(map);

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
  initMap();
  

  $('#js-displResults').on('click', '.js-data', function(event){
    let = index = $(event.currentTarget).attr('data-id');
    updateMarker(index);
    //alert('passed checked!!');
  })
   
});



