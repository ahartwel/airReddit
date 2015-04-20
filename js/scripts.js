/**
 * Created by ahartwel on 4/19/15.
 */


var threads = [];
var currentThread = 1;

var level = 0;

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/redditCall.php?url=" + encodeURI(theUrl), false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getImgurImage(id) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/getImgurImage.php?imgid=" + encodeURI(id), false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}



var subreddits = JSON.parse(httpGet("reddit.com/subreddits/popular.json"));
var subs = [];
for (var i = 0; i<subreddits.data.children.length; i++) {
    subs[i] = subreddits.data.children[i];
    subs[i].elem = document.createElement('li');
    subs[i].elem.url = subs[i].data.url;
    subs[i].elem.innerHTML = subs[i].data.display_name;

    if (i==0) {
        subs[i].elem.className = "selected";
    }

    document.getElementById("subList").getElementsByTagName("ul")[0].appendChild(subs[i].elem);

}


var selectedSub = 0;

function changeSub(offset) {
    selectedSub+=offset;
    if (selectedSub<0) {
        selectedSub = 0;
    }

    if (selectedSub>subs.length-1) {
        selectedSub = subs.length-1;
    }

    for (i = 0; i<subs.length; i++) {

        subs[i].elem.className = "";

        if (i==selectedSub) {
            subs[i].elem.className = "selected";
        }

    }



    document.getElementById("subList").style.transform = "translate3d(0px," + (selectedSub*-120) + "px,0px)";

}


function enterSub() {
    level = 1;
    subs[selectedSub].elem.className = "selected inIt";

    setTimeout(function() {
        currentThread = 0;
        loadThreads();
        var commentsSection = displayThread();
        console.log(commentsSection);
        loadComments(commentsSection);
    }, 800);

}

function moveSub(whichWay) {
    currentThread+=whichWay;
    if (currentThread<0) {
        currentThread=0;
    }
    if (currentThread>=threads.length) {
        currentThread = threads.length-1;
    }
    var commentsSection = displayThread();
    loadComments(commentsSection);


}



function displayComments(commentsSection) {


}


function displayThread() {



        var view = document.getElementsByClassName("selected")[0];  //whole view
        view.innerHTML = "";

        var title = createElement("h2", "fadeIt");  //title
        title.innerHTML = threads[currentThread].data.title;

        var author = createElement("h3", "fadeIt");   //author
        author.innerHTML = threads[currentThread].data.author;

        var image = createElement("img", "threadImg fadeIt");  //post image


        var count = 0;
            count += threads[currentThread].data.url.indexOf(".jpg");   //checking to see if we have image file
            count += threads[currentThread].data.url.indexOf(".jpeg");
            count += threads[currentThread].data.url.indexOf(".png");
            count += threads[currentThread].data.url.indexOf(".gif");

        imageUrl = threads[currentThread].data.url;
        if (count<0) {
            var imageData = getImgurImage(threads[currentThread].data.url.split("/")[3]);   //getting image link if not a file
            imageUrl = JSON.parse(imageData).data.link;

        }

        image.src = imageUrl;

        image.onload = function() {

            var w = this.clientWidth;
            var h = this.clientHeight;

            if (this.clientWidth>document.getElementsByClassName("imgContainer")[0].clientWidth) {
                var sizing = document.getElementsByClassName("imgContainer")[0].clientWidth/this.clientWidth - .05;
                console.log(sizing);
                this.width = (w * sizing);
                this.style.height = (h * sizing) + "px";


            }

        }

        var container = createElement("div", "threadContainer fadeIt");   //thread Container


        var imageDiv = createElement("div", "imgContainer");   //img container
        var commentsDiv = createElement("div", "commentsContainer")  //comments container

        var menu = createElement("div", "threadMenu");  //menu with up vote/ down vote/ comment count

        var upVote = createElement('div', 'upVote vote');
        var UVimg = createElement("img", 'voteImg upVote');
        UVimg.src = "images/icons-01.svg";
        var upcount = createElement("div", "count");
        upcount.innerHTML = threads[currentThread].data.ups;

        var downVote = createElement('div', 'downVote vote');
         var DVimg = createElement("img", 'voteImg downVote');
        DVimg.src = "images/icons-01.svg";
    var downcount = createElement("div", "count");
    downcount.innerHTML = threads[currentThread].data.downs;

        var commentCount = createElement('div', 'commentCount vote');
        var CCimg = createElement("img", 'voteImg cc');
        CCimg.src = "images/icons-02.svg";
        var commentcount = createElement("div", "count");
        commentcount.innerHTML = threads[currentThread].data.num_comments;

        upVote.appendChild(UVimg);
        upVote.appendChild(upcount);
        downVote.appendChild(DVimg);
        downVote.appendChild(downcount);
        commentCount.appendChild(CCimg);
        commentCount.appendChild(commentcount);

        menu.appendChild(upVote);
        menu.appendChild(downVote);
        menu.appendChild(commentCount);

        var titleDiv = createElement("div", "titleContainer");  //title container


        var upNext = "";
        if (currentThread+1<threads.length) {
            upNext = createElement("div", "upNext");


            var upTitle = createElement("h4", "upNextTitle");
            upTitle.innerHTML = threads[currentThread+1].data.title;

            var upAuthor = createElement("h5", "upNextTitle");
            upAuthor.innerHTML = threads[currentThread+1].data.author;

            upNext.appendChild(upTitle);
            upNext.appendChild(upAuthor);

        }




        container.appendChild(imageDiv);
        container.appendChild(commentsDiv);
        container.appendChild(titleDiv);

        imageDiv.appendChild(image); //imageContainer

        titleDiv.appendChild(title); //titleContainer
        titleDiv.appendChild(author);

    if (currentThread+1<threads.length) {

        titleDiv.appendChild(upNext);

    }

        commentsDiv.appendChild(menu);



        view.appendChild(container);

        return commentsDiv;

}

function createElement(type, classNames) {

    var elem = document.createElement(type);
    elem.className = classNames;

    return elem;
}


function leaveSub() {
    level = 0;
    var view = document.getElementsByClassName("selected")[0];
    view.innerHTML = "";
    view.innerHTML = subs[selectedSub].data.display_name;

    subs[selectedSub].elem.className = "selected";

}


var subData = {};
function loadThreads() {
    threads = JSON.parse(httpGet("reddit.com" + subs[selectedSub].data.url + ".json")).data.children;


}



function loadComments(commentsSection) {
    var coms = JSON.parse(httpGet("reddit.com/comments/" + threads[currentThread].data.id + ".json"))[1].data.children;
    //window.comments = JSON.parse(httpGet("reddit.com/comments/" + threads[0].data.id + ".json"))[1].children;

    var comments = [];

    var numOfTops = 3;
    if (coms.length < 3) {
        numOfTops = coms.length;
    }
    for (var i = 0; i < numOfTops; i++) {
        comments[i] = {};
        comments[i].container = createElement("div", "topComContainer");
        comments[i].author = createElement("div", "commentAuthor");
        comments[i].author.innerHTML = coms[i].data.author;
        comments[i].title = createElement("div", "commentTitle");
        comments[i].title.innerHTML = coms[i].data.body;

        comments[i].container.appendChild(comments[i].author);
        comments[i].container.appendChild(comments[i].title);

        commentsSection.appendChild(comments[i].container);


    }
}


var frontPage = document.getElementsByTagName("li");
var page = "";
//    frontPage.addEventListener("click", function() {
//        frontPage.className = "selected full";
//        page = frontPage.innerHTML;
//        frontPage.innerHTML = "";
//
//        var list = document.getElementsByTagName("li");
//        for (i = 0; i<list.length; i++) {
//            if (list[i].className!="selected full") {
//                list[i].style.opacity = 0;
//
//            }
//        }
//
//        document.getElementById("subView").style.display = "block";
//        setTimeout(function() {
//            document.getElementById("postImage").className = "fullOpac";
//            document.getElementById("menu").className = "fullOpac";
//            document.getElementById("topComment").className = "fullOpac";
//        },800);
//
//
//    }, false);

var logo = document.getElementById("logo");
logo.addEventListener("click", function() {
    frontPage.className = "selected";
    frontPage.innerHTML = page;

    var list = document.getElementsByTagName("li");
    for (i = 0; i<list.length; i++) {
        if (list[i].className!="selected full") {
            list[i].style.opacity = 1;

        }
    }
    document.getElementById("subView").style.display = "";
    document.getElementById("postImage").className = "";
    document.getElementById("menu").className = "";
    document.getElementById("topComment").className = "";
}, false);




document.body.addEventListener("keyup", function(e) {
    console.log(e);

    if (e.keyCode==38) {
        if (level==0) {
            changeSub(-1);
        } else if (level==1) {
            moveSub(-1);
        }
    } else if (e.keyCode==40) {
        if (level==0) {
        changeSub(1);
            } else if (level==1) {
            moveSub(1);
        }
    } else if (e.keyCode==13) {
        if (level==0) {
            enterSub();
        }

    } else if (e.keyCode==37) {
        if (level==1) {
            leaveSub();
        }

    }

}, false);




var handData = [];
var grabData = [];
var startPointing = false;
var startGrabbing = false;
var justSwiped = false;
var timer = 0;

var lastSpeed = 0;
Leap.loop({enableGestures: true}, function(frame) {

    if (frame.hands.length > 0) {
        var hand = frame.hands[0];


        addGrabData(hand.grabStrength);

        if (Math.abs(lastSpeed) - Math.abs(hand.palmVelocity[1]) > 15 && justSwiped==false) {
            console.log("MMMAAAYYYBBBEEE")
            if (hand.direction[1]<.18) {
                if (level==0) {
                    changeSub(-1);
                }else if (level==1) {
                    console.log("shit");
                    moveSub(-1);
                    }
            } else {
                if (level==0) {
                    changeSub(1);
                } else if (level==1) {
                    moveSub(1);
                    console.log("shit");
                }
            }
            justSwiped = true;
        } else {
            timer++;
            if (timer>45) {
                justSwiped = false;
                timer=0;
            }

        }

        lastSpeed = hand.palmVelocity[1];



//            addFingerAngle(hand.palmPosition[0]);
//            addGrabData(hand.pinchStrength);



    } else {
        startPointing = true;

    }

});


function addFingerAngle(angle) {
    if (startPointing) {
        handData = [];
        startPointing = false;
    }

    if (handData.length<10) {
        handData.push(angle);
    } else {
        handData = handData.slice(1,handData.length);

        handData[handData.length] = angle;
        // console.log(checkSwipe());

        if (checkSwipe()) {

            if (handData[0] - handData[handData.length-1]<0) {
                if (level==0) {
                changeSub(1);
                } else if (level==1) {
                    moveSub(1);
                }
                console.log("shiiit");
            } else {
                if (level==0) {
                changeSub(-1);
                }else if (level==1) {
                moveSub(-1);
                }
            }



        } else {
            if (justSwiped) {
                timer++;
                if (timer>65) {
                    //  alert("!!!!");
                    justSwiped = false;
                    timer = 0;
                }
            }
        }



    }


    //console.log(handData);
}
var justGrabbed = false;
var grabbedTimer = 0;
function addGrabData(strength) {
    if (startGrabbing) {
        grabData = [];
        startGrabbing = false;
    }

    if (justGrabbed) {
        grabbedTimer++;

        if (grabbedTimer>50) {
            grabbedTimer=0;
            justGrabbed = false;
        }

    }

    if (grabData.length<10) {
        grabData.push(strength);
    } else {
        grabData = grabData.slice(1,grabData.length);

        grabData[grabData.length] = strength;
        // console.log(checkSwipe());

        if (checkGrab() && justGrabbed==false) {

            if (grabData[0] - grabData[grabData.length-1]<0) {
                //alert("OOOUUUTTT")
                console.log("zooooom out")
                if (level==1) {
                    console.log("levaing");
                    leaveSub();
                }
                justGrabbed = true;

            } else {
                console.log("zooooom in")
                if (level==0) {
                    console.log("entering");
                    enterSub();
                }
                justGrabbed = true;
            }



        }





    }


    //console.log(handData);
}


function checkSwipe() {
    console.log(justSwiped);
    if (Math.abs(handData[0] - handData[handData.length-1])>7 && justSwiped==false) {
        justSwiped = true;
        return true;

    }

    return false;

}
function checkGrab() {

    if (Math.abs(grabData[0] - grabData[grabData.length-1])>.37 && justSwiped==false) {
        justSwiped = true;
        return true;

    }

    return false;

}
