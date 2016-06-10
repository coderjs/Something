// Global Variables
var map = null;
var side_bar_html = "";
var gmarkers = [];
var topList = [];
//

// Initialize

var initialize = function() {
    var centerMap = new google.maps.LatLng(40.742080, -73.982692);
    var myOptions = {
        zoom: 18,
        center: centerMap,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
    
    var marker = new google.maps.Marker({
        position: centerMap,
        map: map,
        title: 'Home:  10016'
    });
    
    setMarkers(map, topList);
    console.log(topList);
    console.log(self.venueList);
}

var VenueObject = function(venue) {
    this.name = venue.name; 
    this.lat = venue.location.lat; 
    this.lng = venue.location.lng; 
    this.foodType = venue.categories[0].name; 
    this.address = venue.location.formattedAddress.join(", ");
    this.phone = venue.contact.formattedPhone;
    this.venueURL = venue.url;
    this.venueRating = venue.rating;
    this.latLng = ko.computed(function() {
       return this.lat + "," + this.lng;
    }, this);
}

var get4Square = function (self) {
    $.getJSON("https://api.foursquare.com/v2/venues/explore?ll=40.742641,-73.982462&limit=25&section=food&oauth_token=CC2VGZMOFO0FXFN1V2A0AWLXEWZQDK1153NMCI4XHBS10HIC&v=20160508", 
    function(data){
    data.response.groups[0].items.forEach(function(fsVenue) {     
        var card = new VenueObject(fsVenue.venue);
            card.marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat,this.lng),
                map: map,
                title: this.name,
                //zIndex: zindex,
                //html: html,
            });            
        topList.push(card);
        self.venueList.push(card);
		var myObservableArray = ko.observableArray();
		myObservableArray.push(card); 
		console.log(myObservableArray());
        });
       //console.log(self.venueList());
       initialize();
    })
}

var setMarkers = function (map, markers) {
    for (var i = 0; i < markers.length; i++) {
        self.venueList = markers[i];
        var siteLatLng = new google.maps.LatLng(self.venueList.lat,self.venueList.lng);
		//console.log(self.venueList);
        var marker = createMarker(
            siteLatLng, self.venueList.name, 
            "<p><b>" + self.venueList.name +
            "<\/b> <p>" + self.venueList.foodType +
            "<\/b> <p>" + self.venueList.address +
            "<\/b> <p>" + self.venueList.phone +
            "<\/b> <p>" + self.venueList.venueURL +
            "<\/b> <p>Rating: " + self.venueList.venueRating
            );
    }
    // put the assembled side_bar_html contents into the side_bar div
    document.getElementById("side_bar").innerHTML = side_bar_html;
}

var infowindow = new google.maps.InfoWindow({
   });

var createMarker = function (latLng, title, html, zindex) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        zIndex: zindex,
        html: html,
    });
    google.maps.event.addListener(marker, "click", function() {
        infowindow.setContent(marker.html);
        infowindow.open(map, marker)
    });

    // save the info we need to use later for the side_bar
    gmarkers.push(marker);
    
    // add a line to the side_bar html
    side_bar_html += '<a href="javascript:myclick(' + (gmarkers.length - 1) + ')">' + title + '<\/a><br>';
    return marker;
}

// This function picks up the click and opens the corresponding info window
var myclick = function (i) {
    google.maps.event.trigger(gmarkers[i], "click");
}

/* ======= View Model ======= */

var ViewModel = function() {
    var self = this; 
	this.myObservableArray = ko.observableArray([]);
    this.venueList = ko.observableArray([]);
    get4Square(self);
    };

ko.applyBindings(new ViewModel());