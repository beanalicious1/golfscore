// I need to get my api.
// https://golf-courses-api.herokuapp.com/courses",local_obj, function(data,status){

// https://golf-courses-api.herokuapp.com/courses/ + id


// GOOGLE MAPS API KEY
// AIzaSyAmiXBLuqOYrtXAdM_e5SBm9WfHBABKb-0

var courses = {};
var courseData = {};
var lat1 = 40.431459252532;
var lat2 = 40.431459252532;
var lng1 = -111.905075311661;
var lng2 = -111.905075311661;
var place = {};
var placeName;
var placeInfo = {};
var getCoords = {};
navigator.geolocation.getCurrentPosition(function (location) {
    getCoords.latitude = location.coords.latitude;
    getCoords.longitude = location.coords.longitude;
});
var numPlayers = 0;
// Adding and initializing google maps API
function initMap() {
    var loc1 = {
        lat: lat1,
        lng: lng1
    };
    var loc2 = {
        lat: lat2,
        lng: lng2
    };
    //var loc1 = {lat: 40.431459252532, lng: -111.905075311661};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: loc1,
        mapTypeID: 'satellite'
    });
    var marker1 = new google.maps.Marker({
        position: loc1,
        map: map,
        icon: {
            url: 'resources/images/golf-ball.png'
        }

    });
    var marker2 = new google.maps.Marker({
        position: loc2,
        map: map,
        icon: {
            url: 'resources/images/golf-flag.png',
            scaledSize: new google.maps.Size(30,30)
        }
    });

}


function getCourses() {
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


function getCourseData(id) {
    return new Promise(function (resolve) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
                courseData = JSON.parse(xhttp.responseText);
                lat1 = courseData.course.holes[0].green_location.lat;
                lng1 = courseData.course.holes[0].green_location.lng;
                lat2 = courseData.course.holes[0].tee_boxes[0].location.lat;
                lng2 = courseData.course.holes[0].tee_boxes[0].location.lng;
                initMap();
                resolve(courseData);
            }
        };
        xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + id, true);
        xhttp.send();
    });
}

function placeTeeInfo() {
    document.getElementById('teeOff').innerHTML = "<option>--Please Select--</option>";
    var len = courseData.course.tee_types.length;
    for (var i = 0; i < len; i++)
        document.getElementById('teeOff').innerHTML += '<option value="' + i + '">' + courseData.course.tee_types[i].tee_type + '</option>';


}

function placeHoleInfo() {
    document.getElementById('lengthSelect').innerHTML = '<option>--Please Select--</option>';
    if (courseData.course.hole_count == 18) {
        document.getElementById('lengthSelect').innerHTML += '<option value="front9">Front 9</option>';
        document.getElementById('lengthSelect').innerHTML += '<option value="back9">Back 9</option>';
        document.getElementById('lengthSelect').innerHTML += '<option value="playAll">Full 18</option>';
    } else if (courseData.course.hole_count == 9) {
        document.getElementById('lengthSelect').innerHTML += '<option value="front9">All 9</option>'
        placeTeeInfo();
    }
}

function appendCourseList() {
    document.getElementById('courseSelect').innerHTML = '<option>--Please Select--</option>'
    courses.forEach(function (course) {
        document.getElementById('courseSelect').innerHTML += '<option value="' + course.id + '">' + course.name + '</option>'
    });
    document.getElementById('geoButton').innerHTML = '<button class="btn btn-success" type="submit" onclick="updateGeo()">Use Current Loc</button>';

}

function updateGeo() {
    getCourses().then(appendCourseList);
    document.getElementById('lengthSelect').innerHTML = '<option>--Please Select--</option>';
    document.getElementById('teeOff').innerHTML = "<option>--Please Select--</option>";
    document.getElementById('playerEntry').innerHTML = '<div class="col-xs-12 playerContainer" id="playerContainer"><h3>Please select a course, how many holes you would like to play, and your preferred tee.</h3></div>';
    document.getElementById('playerEntry2').innerHTML = '';
    document.getElementById('courseEntry').innerHTML = '';
    document.getElementById('courseEntry2').innerHTML = '';
    document.getElementById('playerButton').innerHTML = '';
}

getCourses().then(appendCourseList);

function runCourse(id) {
    getCourseData(id).then(function (courseData) {
        console.log(courseData.course.name)
    });    
    document.getElementById('lengthSelect').innerHTML = '<option>--Please Select--</option>';
    document.getElementById('teeOff').innerHTML = "<option>--Please Select--</option>";
    document.getElementById('playerEntry').innerHTML = '<div class="col-xs-12 playerContainer" id="playerContainer"><h3>Please select a course, how many holes you would like to play, and your preferred tee.</h3></div>';
    document.getElementById('playerEntry2').innerHTML = '';
    document.getElementById('courseEntry').innerHTML = '';
    document.getElementById('courseEntry2').innerHTML = '';
    document.getElementById('playerButton').innerHTML = '';
    getCourseData(id).then(placeHoleInfo).then(placeTeeInfo);
}

function holeMap(holeNum) {
    var teeId = document.getElementById('teeOff').value;
    lat1 = courseData.course.holes[holeNum].green_location.lat;
    lng1 = courseData.course.holes[holeNum].green_location.lng;
    lat2 = courseData.course.holes[holeNum].tee_boxes[teeId].location.lat;
    lng2 = courseData.course.holes[holeNum].tee_boxes[teeId].location.lng;
    initMap();

}


function inScore(playerNumber) {
    var score = 0;
    for (var i = 0; i < 9; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('player' + playerNumber + 'total').innerHTML = score;
    for (var i = 0; i < 9; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value == "") {
            return;
        }
    }
    var teeId = document.getElementById('teeOff').value;
    var totPar = courseData.course.tee_types[teeId].front_nine_par;
    var diffPar = score - totPar;
    var parReport = totPar - score;
    var player = document.getElementById('playerName' + playerNumber).value;
    if (diffPar > 0) {
        toastr.error('Better luck next time, ' + player + '. You were ' + diffPar + ' over par!');
    } else {
        toastr.success('Way too good there, ' + player + '! You were' + parReport + 'under par!');
    }

}

function outScore(playerNumber) {
    var score = 0;
    for (var i = 9; i < 18; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('player' + playerNumber + 'total').innerHTML = score;
    for (var i = 9; i < 18; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value == "") {
            return;
        }
    }
    var teeId = document.getElementById('teeOff').value;
    var totPar = courseData.course.tee_types[teeId].back_nine_par;
    var diffPar = score - totPar;
    var parReport = totPar - score;
    var player = document.getElementById('playerName' + playerNumber).value;
    if (diffPar > 0) {
        toastr.error('Better luck next time, ' + player + '. You were ' + diffPar + ' over par!');
    } else {
        toastr.success('Way too good there, ' + player + '! You were ' + parReport + ' under par!');
    }

}

function totalScore(playerNumber) {
    var score = 0;
    for (var i = 0; i < 9; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('player' + playerNumber + 'fronttotal').innerHTML = score;
    for (var i = 9; i < 18; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value != null) {
            score += Number(document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value);
        }
    }
    document.getElementById('player' + playerNumber + 'total').innerHTML = score;
        for (var i = 0; i < 18; i++) {
        if (document.getElementById('player' + playerNumber + 'hole' + (i + 1)).value == "") {
            return;
        }
    }
    var teeId = document.getElementById('teeOff').value;
    var totPar = courseData.course.tee_types[teeId].par;
    var diffPar = score - totPar;
    var parReport = totPar - score;
    var player = document.getElementById('playerName' + playerNumber).value;
    if (diffPar > 0) {
        toastr.error('Better luck next time, ' + player + '. You were ' + diffPar + ' over par!');
    } else {
        toastr.success('Way too good there, ' + player + '! You were ' + parReport + ' under par!');
    }


}





function resetPage() {
    location.reload();
}
// Alright. So I have a way to calculate total, calculate par, SEE SCORE-SERVICE
//Gotta build my infocard
function initPlayers(numHoles) {
    numPlayers = 0;
    var teeId = document.getElementById('teeOff').value;
    document.getElementById('courseEntry').innerHTML = '<div class="col-xs-2"><div class="courseNum">Hole</div><div class="yardage">Yardage</div><div class="par">Par</div></div>';
    document.getElementById('playerContainer').innerHTML = '';

    if (numHoles == 'front9') {
        document.getElementById('playerButton').innerHTML = '<div class="col-xs-2"><button class="btn btn-success" type="submit" onclick="addPlayer(0)">Add Player</button></div><div class="col-xs-1"><button class="btn btn-danger" type="submit" onclick="resetPage()">Reset</button></div>'
        for (var i = 0; i < 9; i++) {
            document.getElementById('courseEntry').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeMap(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseData.course.holes[i].tee_boxes[teeId].yards + '</div><div class="par text-center" >' + courseData.course.holes[i].tee_boxes[teeId].par + '</div></div>';
        }
        document.getElementById('courseEntry').innerHTML += '<div class="col-xs-1"><div class="text-center courseNum">Total</div><div class="text-center yardage">' + courseData.course.tee_types[teeId].front_nine_yards + '</div><div class="par text-center" id="par">' + courseData.course.tee_types[teeId].front_nine_par + '</div></div>';
    } else if (numHoles == 'back9') {
        document.getElementById('playerButton').innerHTML = '<div class="col-xs-2"><button class="btn btn-success" type="submit" onclick="addPlayer(1)">Add Player</button></div><div class="col-xs-1"><button class="btn btn-danger" type="submit" onclick="resetPage()">Reset</button></div>'
        for (var i = 9; i < 18; i++) {
            document.getElementById('courseEntry').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeMap(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseData.course.holes[i].tee_boxes[teeId].yards + '</div><div class="par text-center">' + courseData.course.holes[i].tee_boxes[teeId].par + '</div></div>';
        }
        document.getElementById('courseEntry').innerHTML += '<div class="col-xs-1"><div class="courseNum text-center">Total</div><div class="yardage text-center">' + courseData.course.tee_types[teeId].back_nine_yards + '</div><div class="par" id="par">' + courseData.course.tee_types[teeId].back_nine_par + '</div></div>';

    } else {
        document.getElementById('playerButton').innerHTML = '<div class="col-xs-2"><button class="btn btn-success" type="submit" onclick="addPlayer(2)">Add Player</button></div><div class="col-xs-1"><button class="btn btn-danger" type="submit" onclick="resetPage()">Reset</button></div>'
        document.getElementById('courseEntry2').innerHTML = '<div class="col-xs-2"><div class="courseNum">Hole</div><div class="yardage">Yardage</div><div class="par">Par</div></div>';

        for (var i = 0; i < 9; i++) {
            document.getElementById('courseEntry').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeMap(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseData.course.holes[i].tee_boxes[teeId].yards + '</div><div class="par text-center" >' + courseData.course.holes[i].tee_boxes[teeId].par + '</div></div>';
        }
        document.getElementById('courseEntry').innerHTML += '<div class="col-xs-1"><div class="courseNum">Total</div><div class="yardage">' + courseData.course.tee_types[teeId].front_nine_yards + '</div><div class="par" id="par">' + courseData.course.tee_types[teeId].front_nine_par + '</div></div>';
        for (var i = 9; i < 18; i++) {
            document.getElementById('courseEntry2').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeMap(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseData.course.holes[i].tee_boxes[teeId].yards + '</div><div class="par text-center">' + courseData.course.holes[i].tee_boxes[teeId].par + '</div></div>';
        }
        document.getElementById('courseEntry2').innerHTML += '<div class="col-xs-1"><div class="courseNum text-center">Total</div><div class="yardage text-center">' + (courseData.course.tee_types[teeId].front_nine_yards + courseData.course.tee_types[teeId].back_nine_yards) + '</div><div class="par text-center" id="par2">' + (courseData.course.tee_types[teeId].front_nine_par + courseData.course.tee_types[teeId].back_nine_par) + '</div></div>';

    }
}

function addPlayer(holeId) {
    numPlayers++
    if (numPlayers <= 4) {
        document.getElementById('playerContainer').innerHTML += '<div class="row" id="player' + numPlayers + '"></div>';
        var teeId = document.getElementById('teeOff').value;
        document.getElementById('player' + numPlayers).innerHTML = '<div class="col-xs-2"><input class="form-control" type="text" placeholder="Name"  id="playerName' + numPlayers + '"></div>';
        if (holeId == 0) {
            for (var i = 0; i < 9; i++) {
                document.getElementById('player' + numPlayers).innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="inScore(' + numPlayers + ')" id="player' + numPlayers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + numPlayers).innerHTML += '<div Class="col-xs-1" id="player' + numPlayers + 'total"></div>';
        } else if (holeId == 1) {
            for (var i = 9; i < 18; i++) {
                document.getElementById('player' + numPlayers).innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="outScore(' + numPlayers + ')" id="player' + numPlayers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + numPlayers).innerHTML += '<div Class="col-xs-1" id="player' + numPlayers + 'total"></div>';
        } else {
            document.getElementById('playerEntry2').innerHTML += '<div class="col-xs-12" id="playerContainer2"><div class="row" id="player' + numPlayers + '-2"></div></div>'
            document.getElementById('player' + numPlayers + '-2').innerHTML += '<div class="col-xs-2"></div>';
            for (var i = 0; i < 9; i++) {
                document.getElementById('player' + numPlayers).innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="totalScore(' + numPlayers + ')" id="player' + numPlayers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + numPlayers).innerHTML += '<div Class="col-xs-1" id="player' + numPlayers + 'fronttotal"></div>';
            for (var i = 9; i < 18; i++) {
                document.getElementById('player' + numPlayers + '-2').innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="totalScore(' + numPlayers + ')" id="player' + numPlayers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + numPlayers + '-2').innerHTML += '<div Class="col-xs-1" id="player' + numPlayers + 'total"></div>';


        }
    }
}