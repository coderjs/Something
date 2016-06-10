var map;

// Bootstrap Sidebar Toggle   
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

/* ======= Model ======= */



/* ======= View ======= */
var VenueObject = function(venue) {
    this.name = venue.name;
    this.lat = venue.location.lat;
    this.lng = venue.location.lng;
    this.address = venue.location.formattedAddress.join(", ");
    this.phone = venue.contact.formattedPhone;
    this.venueURL = venue.url;
    this.foodType = venue.categories[0].name;
    this.venueRating = venue.rating;
	
	// Create the map marker for this venue object
    this.mapMarker = new google.maps.Marker({
        position: {lat: this.lat, lng: this.lng},
        map: map,
        title: this.name
    });
	
	this.infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
        });

	        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" class="firstHeading">'+this.name+'</h4>'+
            '<div id="bodyContent">'+
            '<p>Food type: '+this.foodType+'</p>'+
            '<p>Address: '+this.address+'</p>'+
            '<p>Phone: '+this.phone+'</p>'+
            '<p>URL: '+this.venueURL+'</p>'+
            '<p>Rating: '+this.venueRating+'</p>'+
            '</div>'+
            '</div>';
}

var getFourSquare = function (self) {

    var arrayOfCards = [];

    $.getJSON("https://api.foursquare.com/v2/venues/explore?ll=40.742641,-73.982462&limit=25&section=food&oauth_token=CC2VGZMOFO0FXFN1V2A0AWLXEWZQDK1153NMCI4XHBS10HIC&v=20160508", 
	function(data){
    data.response.groups[0].items.forEach(function(fsVenue) {
        //console.log(fsVenue.venue);
        
		var card = new VenueObject(fsVenue.venue);
        //console.log(card);
        self.venueList.push(card);
        arrayOfCards.push(card);
        });
        //console.log(self.venueList());
        //console.log(self.venueList()[0].name);
        //console.log(self.venueList()[0].lat);
        //console.log(self.venueList()[0].lng);
        //console.log(self.venueList()[0].foodType);       
       //initMap(arrayOfCards);
	   console.log(arrayOfCards);
	})
}

// Initialize Google Map
var initMap = function (data) {
        var mapDiv = document.getElementById('map');
        map = new google.maps.Map(mapDiv, {
            center: {lat: 40.742080, lng: -73.982692},
            zoom: 18
        });

        if(data){

            var testArrayOfMarkers = [];

            data.forEach(function(item){

                testArrayOfMarkers.push([item.name, item.lat, item.lng, item.address, item.phone, item.venueURL, 'Rating : ' + item.venueRating, item.foodType]);
            });
            setMarkers(map, testArrayOfMarkers);
            //console.log(testArrayOfMarkers[0]);
        }
}

function setMarkers(map, markers) {

    markers.forEach(function(sites){
        var siteLatLng = new google.maps.LatLng(sites[1], sites[2]);

        var marker = new google.maps.Marker({
            position: siteLatLng,
            map: map,
            title: sites[0],
            //venueURL: sites[5],
            //phone: sites[4]
        });

        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" class="firstHeading">'+sites[0]+'</h4>'+
            '<div id="bodyContent">'+
            '<p>Food type: '+sites[7]+'</p>'+
            '<p>Address: '+sites[3]+'</p>'+
            '<p>Phone: '+sites[4]+'</p>'+
            '<p>URL: '+sites[5]+'</p>'+
            '<p>Rating: '+sites[6]+'</p>'+
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
        });

        //http://stackoverflow.com/questions/15111555/google-maps-api-v3-one-infowindow-open-at-a-time
        google.maps.event.addListener(marker, "click", function () {
            infowindow.close();
            //alert(this.html);
            //infowindow.setContent(this.title, this.venueURL, this.phone);
            if($('.gm-style-iw').length) {
            $('.gm-style-iw').parent().remove();
            }
            //infowindow.open(map,marker);
            infowindow.open(map,this);
        });
        // save the info we need to use later for the side_bar

        console.log(sites[0]);
    })
}


/* ======= View Model ======= */
var ViewModel = function() {
    var self = this; 
    this.city = ko.observable("New York");
    self.venueList = ko.observableArray([]);
    //self.searchTerm = ko.observable('');
    //self.searchedList = ko.observableArray(self.venueList());
    //self.city = ko.observable(defaultCity);
    getFourSquare(self);
}

ko.applyBindings(new ViewModel());