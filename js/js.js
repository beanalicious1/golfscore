// AIzaSyAfC6LzT-QR72KZF9y_cfFjY8Yz6ji9DHs

var courses = {};
var courseInfo = {};
var lat1 = 40.431459252532;
var lat2 = 40.431459252532;
var lng1 = -111.905075311661;
var lng2 = -111.905075311661;
var getCoords = {};
navigator.geolocation.getCurrentPosition(function (location) {
    getCoords.latitude = location.coords.latitude;
    getCoords.longitude = location.coords.longitude;
});
var golfers = 0;

function initMap() {
    var loc1 = {
        lat: lat1,
        lng: lng1
    };
    var loc2 = {
        lat: lat2,
        lng: lng2
    };

    var map = new google.maps.Map(document.getElementById('googleMap'), {
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


function listOfCourses() {
    return new Promise(function (resolve) {
        var xhttp = new XMLHttpRequest();
        var body;
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
                var data = JSON.parse(xhttp.responseText);
                courses = data.courses;
                resolve(courses);

            }
        };
        xhttp.open("POST", "https://golf-courses-api.herokuapp.com/courses/", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        if (getCoords.latitude == null) {
            body = {
                "latitude": 40.431459252532,
                "longitude": -111.905075311661,
                "radius": 30
            };
        } else {
            body = {
                "latitude": getCoords.latitude,
                "longitude": getCoords.longitude,
                "radius": 30
            }
        }
        xhttp.send(JSON.stringify(body));
    });
}


function findCourseInfo(id) {
    return new Promise(function (resolve) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
                courseInfo = JSON.parse(xhttp.responseText);
                lat1 = courseInfo.course.holes[0].green_location.lat;
                lng1 = courseInfo.course.holes[0].green_location.lng;
                lat2 = courseInfo.course.holes[0].tee_boxes[0].location.lat;
                lng2 = courseInfo.course.holes[0].tee_boxes[0].location.lng;
                initMap();
                resolve(courseInfo);
            }
        };
        xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + id, true);
        xhttp.send();
    });
}

function teeList() {
    document.getElementById('teeLoc').innerHTML = "<option>Handicap?</option>";
    var len = courseInfo.course.tee_types.length;
    for (var i = 0; i < len; i++)
        document.getElementById('teeLoc').innerHTML += '<option value="' + i + '">' + courseInfo.course.tee_types[i].tee_type + '</option>';


}

function holes() {
    document.getElementById('total').innerHTML = '<option>How Many Holes?</option>';
    if (courseInfo.course.hole_count == 18) {
        document.getElementById('total').innerHTML += '<option value="front9">First 9 Holes</option>';
        document.getElementById('total').innerHTML += '<option value="back9">Last 9 Holes</option>';
        document.getElementById('total').innerHTML += '<option value="playAll">All 18 Holes</option>';
    } else if (courseInfo.course.hole_count == 9) {
        document.getElementById('total').innerHTML += '<option value="front9">All 9 Holes</option>'
        teeList();
    }
}

function newCourses() {
    document.getElementById('courses').innerHTML = '<option>What course do you fancy?</option>'
    courses.forEach(function (course) {
        document.getElementById('courses').innerHTML += '<option value="' + course.id + '">' + course.name + '</option>'
    });

}

function nearMe() {
    listOfCourses().then(newCourses);
    document.getElementById('total').innerHTML = '<option>How many holes?</option>';
    document.getElementById('teeLoc').innerHTML = "<option>Handicap?</option>";

}

listOfCourses().then(newCourses);

function begin(id) {
    findCourseInfo(id).then(function (coursePullDown) {
        console.log(coursePullDown.course.name)
    });
    document.getElementById('total').innerHTML = '<option>What course do you fancy?</option>';
    document.getElementById('teeLoc').innerHTML = "<option>Handicap?</option>";
    document.getElementById('entry').innerHTML = '';
    document.getElementById('courseInf').innerHTML = '';
    document.getElementById('courseAdd').innerHTML = '';
    document.getElementById('addPlayer').innerHTML = '';
    findCourseInfo(id).then(holes).then(teeList);
}

function holeList(holeNumber) {
    var teeId = document.getElementById('teeLoc').value;
    lat1 = courseInfo.course.holes[holeNumber].green_location.lat;
    lng1 = courseInfo.course.holes[holeNumber].green_location.lng;
    lat2 = courseInfo.course.holes[holeNumber].tee_boxes[teeId].location.lat;
    lng2 = courseInfo.course.holes[holeNumber].tee_boxes[teeId].location.lng;
    initMap();

}


function scoreKeep(golfPlay) {
    var score = 0;
    for (var i = 0; i < 9; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('golfer' + golfPlay + 'total').innerHTML = score;
    for (var i = 0; i < 9; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value == "") {
            return;
        }
    }
    var teetotaler = document.getElementById('teeLoc').value;
    var par = courseInfo.course.tee_types[teetotaler].par;
    var mostPar = score - par;
    var complete = par - score;
    var golfer = document.getElementById('playerName' + golfPlay).value;


}

function scoreTotal(golfPlay) {
    var score = 0;
    for (var i = 9; i < 18; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('golfer' + golfPlay + 'total').innerHTML = score;
    for (var i = 9; i < 18; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value == "") {
            return;
        }
    }
    var teetotaler = document.getElementById('teeLoc').value;
    var par = courseInfo.course.tee_types[teetotaler].par;
    var mostPar = score - par;
    var complete = par - score;
    var golfer = document.getElementById('playerName' + golfPlay).value;


}

function finalScore(golfPlay) {
    var score = 0;
    for (var i = 0; i < 9; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('golfer' + golfPlay + 'fronttotal').innerHTML = score;
    for (var i = 9; i < 18; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('golfer' + golfPlay + 'total').innerHTML = score;
        for (var i = 0; i < 18; i++) {
        if (document.getElementById('golfer' + golfPlay + 'hole' + (i + 1)).value == "") {
            return;
        }
    }
    var teetotaler = document.getElementById('teeLoc').value;
    var par = courseInfo.course.tee_types[teetotaler].par;
    var mostPar = score - par;
    var complete = par - score;
    var golfer = document.getElementById('playerName' + golfPlay).value;
}





