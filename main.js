//get event data
const ENDPOINT = "/events/search"
let map = "";
let marker= [];
let timerInterval;
let modal_timerInter;
let windowHeight = 0;
let defaultLocation ="";

function show_alert(term,location)
{

   var oArgs = {

      app_key: "vkRWVXRJFdcgFJCr",

      q: term,

      where: location, 

      page_size: 50,

      sort_order: "popularity",

   };
   //

   EVDB.API.call(ENDPOINT, oArgs, function(oData) {
      // Note: this relies on the custom toString() methods below
      console.log(oData.events)
      if(oData.events != null){
        var data = oData.events.event;
        console.log(data);
        if(data.length>0){
          $(".resetZoom").show("show");
          $("#js-displResults").show();
          console.log("width= "+$(window).width());
          if($(window).width()<768){

            console.log("set js-displaymap with to 100%")
            $("#js-displaymap").css({"width":"100%"});
          }else{
            console.log("set js-displaymap with to 70%")
            $("#js-displaymap").css({"width":"70%"});
          }
          displayResults(data, term, location);
          setMaps(data, location);
        }
        else{
          //alert("No results found!, Revise your search and resubmit it!")
          $("#myModal").modal();
          $(".resetZoom").hide();
          $("#js-displResults").hide();
          $("#js-displaymap").css({"width":"100%"});
        }
      }else{
        $("#myModal").modal();
        $(".resetZoom").hide();
        $("#js-displResults").hide();
        $("#js-displaymap").css({"width":"100%"});
      }
      $("#WaitForEvent").modal("hide");
      clearInterval(modal_timerInter);
      centerMap();
    });

}

function centerMap(){
  if (defaultLocation != ""){
    console.log(defaultLocation);
    map.setCenter({lat: parseFloat(defaultLocation.latitude), lng: parseFloat(defaultLocation.longitude)});
    map.setZoom(10);
  }
      

}
function displayResults(data, searchTerm, location){
  let html =`<h5>List of ${searchTerm} found near ${location}:</h5>
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
    zoom:5,
    MapTypeId: google.maps.MapTypeId.TERRAIN
  });
  let events =["Concerts", "Festivals", "Comedy", "Family", "Nightlife", "Performance arts", "Conferences", "Education", "Film", "Food", "Museums", "Technology" ];
  let i = 0;
  timerInterval = setInterval(function(){
    i++;
    $('#searchEvent').attr("placeholder", events[i% events.length]);
    //console.log('index '+ i% events.length)
  
  }, 2000);
  $(".resetZoom").hide();
  $("#js-displResults").hide();
  $("#js-displaymap").css({"width":"100%"});
  windowHeight = $(window).height(); 
  $("#js-displaymap").css({"height": (windowHeight-180)+"px"});
  $("#js-displResults").css({"height": (windowHeight-180)+"px"});
}

function trackWindowHeight(){
  $(window).resize(function(){
   if(windowHeight !== $(window).height()){
    //console.log(windowHeight);
    $("#js-displaymap").css({"height": (windowHeight-180)+"px"});
    $("#js-displResults").css({"height": (windowHeight-180)+"px"});

    }
    //console.log("width= "+$(window).width());
    if($(window).width()<768){
      console.log("set js-displaymap with to 100%");
      $("#js-displaymap").css({"width":"100%"});
    }else{
      //console.log("set js-displaymap with to 70%");
      $("#js-displaymap").css({"width":"70%"});
    }
  centerMap();
  });
}

function setMaps(data, location){
  let geocoder = new google.maps.Geocoder(); 
  
  geocoder.geocode({
    'address': location
  }, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      //map.setCenter(results[0].geometry.location);
      map.setZoom(10);
    }
    else {  //location is not found
      console.log('status error: ' + status);
    }
  });

defaultLocation = data[0];
  
  for(var i=0; i< data.length; i++){
    let imgUrl = "";
    let desc = "";
    if(data[i].image && data[i].image.medium){
      if(data[i].image.medium.url){
        imgUrl = (data[i].image.medium.url).replace('http', 'https');
        //console.log(imgUrl);
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
      <div class="markerInfo">
        <img src= ${imgUrl} class="img-responsive img-thumbnail imageInfo">
        <h4> <a href="${(data[i].url).replace('http', 'https')}" target="myIframe" class="js-page_venue"> ${data[i].title} </a></h4> 
        <h6>When: ${date.toLocaleDateString() } At: ${date.toLocaleTimeString() }</h6>
        <h6>Where:<a href="${(data[i].venue_url).replace('http', 'https')}"  class="js-page_venue" > ${data[i].venue_name}</a></h6>
        <h6>Address: ${data[i].venue_address} ${data[i].city_name}, ${data[i].region_abbr} ${data[i].postal_code}</h6>
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
  //console.log('index '+ index);
  for(let i=0; i < marker.length; i++){
    marker[i].setAnimation(null);
  }
  map.setCenter(marker[index].getPosition());
  map.setZoom(17);
  marker[index].setAnimation(google.maps.Animation.BOUNCE);
  marker[index].setMap(map);

}

function resetZoomEvents(){
  $(".resetZoom").click(function(){
    centerMap();
    map.setZoom(10);
  });
}

function animate_Modal(){
  let events =[".", "..", "..."];
  let i = 0;
  modal_timerInter = setInterval(function(){
    i++;
    console.log(i)
    $('.loading_data').html(events[i% events.length]);
    }, 500);
}

$(function(){
 
   $("form").submit(function(event){
    event.preventDefault();
    //clear timer interval
    clearInterval(timerInterval);
    $("#WaitForEvent").modal("show");
    animate_Modal(); 
    let searchTerm = $("#searchEvent").val();
    let location = $("#location").val();
    //console.log(searchTerm+ "  "+location);
    show_alert(searchTerm, location);


   
   });
   //initial display maps
  initMap();
  trackWindowHeight();
  resetZoomEvents();
  $('#js-displResults').on('click', '.js-data', function(event){
    let = index = $(event.currentTarget).attr('data-id');
    updateMarker(index);

  })

  

});



