var lat1 = 40.431459252532;
var lat2 = 40.431459252532;
var lng1 = -111.905075311661;
var lng2 = -111.905075311661;

function initMap() {
    var loc1 = {
        lat: lat1,
        lng: lng1
    };
    var loc2 = {
        lat: lat2,
        lng: lng2
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: loc1,
        mapTypeID: 'street'
    });
    var marker1 = new google.maps.Marker({
        position: loc1,
        map: map,
        icon: {
            url: 'images/green-ball-md.png',
            scaledSize: new google.maps.Size(10,10)
        }

    });
    var marker2 = new google.maps.Marker({
        position: loc2,
        map: map,
        icon: {
            url: 'images/Red_Dot.png',
            scaledSize: new google.maps.Size(10,10)
        }
    });

}