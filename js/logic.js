function resetPage() {
    location.reload();
}

function initialize(holes) {
    golfers = 0;
    var holeID = document.getElementById('teeLoc').value;
    document.getElementById('courseInf').innerHTML = '<div class="col-xs-2"><div class="courseNum">Hole</div><div class="yardage">Yardage</div><div class="par">Par</div></div>';
    document.getElementById('infoBox').innerHTML = '';

    if (holes == 'front9') {
        document.getElementById('addPlayer').innerHTML = '<div class="col-xs-2"><button class="btn btn-success" type="submit" onclick="addPlayer(0)">Add Player</button></div><div class="col-xs-1"><button class="btn btn-danger" type="submit" onclick="resetPage()">Reset</button></div>'
        for (var i = 0; i < 9; i++) {
            document.getElementById('courseInf').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeList(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseInfo.course.holes[i].tee_boxes[holeID].yards + '</div><div class="par text-center" >' + courseInfo.course.holes[i].tee_boxes[holeID].par + '</div></div>';
        }
        document.getElementById('courseInf').innerHTML += '<div class="col-xs-1"><div class="text-center courseNum">Total</div><div class="text-center yardage">' + courseInfo.course.tee_types[holeID].front_nine_yards + '</div><div class="par text-center" id="par">' + courseInfo.course.tee_types[holeID].front_nine_par + '</div></div>';
    } else if (holes == 'back9') {
        document.getElementById('addPlayer').innerHTML = '<div class="col-xs-2"><button class="btn btn-success" type="submit" onclick="addPlayer(1)">Add Player</button></div><div class="col-xs-1"><button class="btn btn-danger" type="submit" onclick="resetPage()">Reset</button></div>'
        for (var i = 9; i < 18; i++) {
            document.getElementById('courseInf').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeList(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseInfo.course.holes[i].tee_boxes[holeID].yards + '</div><div class="par text-center">' + courseInfo.course.holes[i].tee_boxes[holeID].par + '</div></div>';
        }
        document.getElementById('courseInf').innerHTML += '<div class="col-xs-1"><div class="courseNum text-center">Total</div><div class="yardage text-center">' + courseInfo.course.tee_types[holeID].back_nine_yards + '</div><div class="par" id="par">' + courseInfo.course.tee_types[holeID].back_nine_par + '</div></div>';

    } else {
        document.getElementById('addPlayer').innerHTML = '<div class="col-xs-2"><button class="btn btn-success" type="submit" onclick="addPlayer(2)">Add Player</button></div><div class="col-xs-1"><button class="btn btn-danger" type="submit" onclick="resetPage()">Reset</button></div>'
        document.getElementById('courseAdd').innerHTML = '<div class="col-xs-2"><div class="courseNum">Hole</div><div class="yardage">Yardage</div><div class="par">Par</div></div>';

        for (var i = 0; i < 9; i++) {
            document.getElementById('courseInf').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeList(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseInfo.course.holes[i].tee_boxes[holeID].yards + '</div><div class="par text-center" >' + courseInfo.course.holes[i].tee_boxes[holeID].par + '</div></div>';
        }
        document.getElementById('courseInf').innerHTML += '<div class="col-xs-1"><div class="courseNum">Total</div><div class="yardage">' + courseInfo.course.tee_types[holeID].front_nine_yards + '</div><div class="par" id="par">' + courseInfo.course.tee_types[holeID].front_nine_par + '</div></div>';
        for (var i = 9; i < 18; i++) {
            document.getElementById('courseAdd').innerHTML += '<div class="col-xs-1"><div class="text-center"><button class="courseNum btn btn-default text-center" type="submit" onclick="holeList(' + i + ')">' + (i + 1) + '</Button></div><div class="yardage text-center">' + courseInfo.course.holes[i].tee_boxes[holeID].yards + '</div><div class="par text-center">' + courseInfo.course.holes[i].tee_boxes[holeID].par + '</div></div>';
        }
        document.getElementById('courseAdd').innerHTML += '<div class="col-xs-1"><div class="courseNum text-center">Total</div><div class="yardage text-center">' + (courseInfo.course.tee_types[holeID].front_nine_yards + courseInfo.course.tee_types[holeID].back_nine_yards) + '</div><div class="par text-center" id="par2">' + (courseInfo.course.tee_types[holeID].front_nine_par + courseInfo.course.tee_types[holeID].back_nine_par) + '</div></div>';

    }
}


function addPlayer(holeId) {
    golfers++
    if (golfers <= 4) {
        document.getElementById('infoBox').innerHTML += '<div class="row" id="player' + golfers + '"></div>';
        var teeId = document.getElementById('teeLoc').value;
        document.getElementById('player' + golfers).innerHTML = '<div class="col-xs-2"><input class="form-control" type="text" placeholder="Name"  id="playerName' + golfers + '"></div>';
        if (holeId == 0) {
            for (var i = 0; i < 9; i++) {
                document.getElementById('player' + golfers).innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="scoreKeep(' + golfers + ')" id="player' + golfers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + golfers).innerHTML += '<div Class="col-xs-1" id="player' + golfers + 'total"></div>';
        } else if (holeId == 1) {
            for (var i = 9; i < 18; i++) {
                document.getElementById('player' + golfers).innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="scoreTotal(' + golfers + ')" id="player' + golfers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + golfers).innerHTML += '<div Class="col-xs-1" id="player' + golfers + 'total"></div>';
        } else {
            document.getElementById('entry').innerHTML += '<div class="col-xs-12" id="infoBox"><div class="row" id="player' + golfers + '-2"></div></div>'
            document.getElementById('player' + golfers + '-2').innerHTML += '<div class="col-xs-2"></div>';
            for (var i = 0; i < 9; i++) {
                document.getElementById('player' + golfers).innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="finalScore(' + golfers + ')" id="player' + golfers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + golfers).innerHTML += '<div Class="col-xs-1" id="player' + golfers + 'fronttotal"></div>';
            for (var i = 9; i < 18; i++) {
                document.getElementById('player' + golfers + '-2').innerHTML += '<div Class="col-xs-1"><input type="number" min="0" onchange="finalScore(' + golfers + ')" id="player' + golfers + 'hole' + (i + 1) + '" class="form-control"></div>';
            }
            document.getElementById('player' + golfers + '-2').innerHTML += '<div Class="col-xs-1" id="player' + golfers + 'total"></div>';


        }
    }
}