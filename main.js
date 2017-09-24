//get event data
const ENDPOINT = "/events/search"
function show_alert()
{

   var oArgs = {

      app_key: "vkRWVXRJFdcgFJCr",

      q: "music",

      where: "San Diego", 

      "date": "2017061000-2018062000",

      page_size: 5,

      sort_order: "popularity",

   };
   //

   EVDB.API.call(ENDPOINT, oArgs, function(oData) {
      // Note: this relies on the custom toString() methods below
      console.log(oData);

    });

}

function myMap() {
   var mapProp= {
       center:new google.maps.LatLng(51.508742,-0.120850),
       zoom:5,
   };
   var map=new google.maps.Map($("#js-displaymap"),mapProp);
}



$(function(){
   $(".js-search").click(function(event){
      show_alert();
   });

   $(".js-map").click(function(event){
    alert("test passed!")
      myMap();
   })
});



