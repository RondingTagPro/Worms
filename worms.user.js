// ==UserScript==
// @name          TagPro Worms
// @namespace     http://www.reddit.com/user/ronding/
// @description   Worms Flag Party
// @include       http://tagpro-*.koalabeast.com/*
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com/*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr/*
// @include       http://maptest.newcompte.fr:*
// @author        Ronding
// @version       0.1
// ==/UserScript==

(function(){

var script = document.createElement('script');
script.textContent = 'var worms = ' + GM_getValue('worms', '{}') + ';(' + function(){


var audio = new Audio();
function play(sounds)
{
 if(audio.paused)
 {
  var select = [];
  for(var i = 0; i < sounds.length; i++)
   if(sounds[i] in worms)
    select.push(i);
  if(select.length)
  {
   audio.src = worms[sounds[select[Math.floor(Math.random() * select.length)]]];
   audio.load();
   audio.play();
  }
  return true;
 }
 return false;
}

if(location.port == '')
{
 
 switch(location.pathname)
 {
  case '/':
   var a = document.createElement('a');
   a.href = '/';
   a.style.marginLeft = '20px';
   a.appendChild(document.createTextNode('Worms Speechbank'));
   a.addEventListener('click', function(event)
   {
    event.preventDefault();
    var article = document.getElementsByTagName('article')[0];
    for(var i = 0; i < article.childNodes.length;)
    {
     var child = article.childNodes[i];
     if(child.nodeName.toLowerCase() == 'h1')
     {
      var a = document.createElement('a');
      a.href = '/';
      article.replaceChild(a, child);
      a.appendChild(child);
      i++;
     }
     else
      article.removeChild(child);
    }
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Select the speech sound files to use. Click browse, go to the folder of the speechbank and select all the .wav files inside it.'));
    article.appendChild(p);
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.addEventListener('change', function(event)
    {
     var progress = document.createElement('progress');
     progress.max = 1;
     for(var i = 0; i < this.files.length; i++)
     {
      var name = this.files[i].name.toLowerCase();
      if(name.substr(-4) == '.wav')
      {
       ++progress.max;
       name = name.substr(0, name.length-4).replace(/[ \-_]/g, '');
       var reader = new FileReader();
       reader.onloadend = function(n, r)
       {
        worms[n] = r.result;
        if(++progress.value == progress.max-1)
        {
         var hidden = document.createElement('input');
         hidden.type = 'hidden';
         hidden.id = 'worms';
         hidden.value = JSON.stringify(worms);
         progress.parentNode.appendChild(hidden);
         location.reload();
        }
       }.bind(null, name, reader);
       reader.readAsDataURL(this.files[i]);
      }
     }
     input.parentNode.replaceChild(progress, input);
    });
    article.appendChild(input);
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Where to get the speech sound files?'));
    article.appendChild(p);
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('If you have any old Worms game in your possession, you can select the speechbanks right from the CD.'));
    ul.appendChild(li);
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('You can download the default English speechbank for free from the '));
    var a = document.createElement('a'); a.href = 'http://www.worms2.com/main.html?page=mult&area=audi&file=9'; a.target = '_blank'; a.appendChild(document.createTextNode('official Team17 website')); li.appendChild(a);
    li.appendChild(document.createTextNode('. Extract the zip, then select the sounds above.'));
    ul.appendChild(li);
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('Many customized, unofficial speechbanks can be found on the internet. Here’s just '));
    var a = document.createElement('a'); a.href = 'http://www.tus-wa.com/files/soundbanks/'; a.target = '_blank'; a.appendChild(document.createTextNode('one of the sites')); li.appendChild(a);
    li.appendChild(document.createTextNode(' that collect speechbanks. Make sure you extract the sound files before you feed them to TagPro above.'));
    ul.appendChild(li);
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('With a microphone, you can record you own speech. Just '));
    var a = document.createElement('a'); a.href = 'http://worms2d.info/Soundbanks'; a.target = '_blank'; a.appendChild(document.createTextNode('follow these filenames')); li.appendChild(a);
    li.appendChild(document.createTextNode(' and use your imagination.'));
    ul.appendChild(li);
    article.appendChild(ul);
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Note that the speechbank does not need to be complete: this userscript will try to play other available sound files if some are unavailable. If your speechbank contains uncustomized sounds or contains speech that is unsuitable within the TagPro context, you can hence exclude them by not selecting these above.'));
    article.appendChild(p);
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('This userscript was brought to you by '));
    var a = document.createElement('a'); a.href = 'https://www.reddit.com/user/Ronding/'; a.target = '_blank'; a.appendChild(document.createTextNode('Ronding')); p.appendChild(a);
    p.appendChild(document.createTextNode('.'));
    article.appendChild(p);
   });
   document.getElementsByClassName('section smaller')[0].appendChild(a);
   break;
  case '/boards':
   var iframe = document.createElement('iframe');
   iframe.width = 420;
   iframe.height = 315;
   iframe.src = 'https://www.youtube-nocookie.com/embed/6D4Yr3ebNoQ?rel=0&showinfo=0&autoplay=1';
   iframe.style.border = 'none';
   var h2 = document.getElementsByTagName('h2')[0];
   var center = document.createElement('center');
   center.style.marginTop = '32px';
   center.appendChild(iframe);
   h2.parentNode.insertBefore(center, h2);
 }

}
else
{

 var unfinished = true, hurry = true, firstblood = true, alive = NaN, lastX = NaN, lastY = NaN, lastLastSpeed = NaN, lastSpeed = NaN, lastPups = 0, lastFlag = false, lastOurScore = NaN, lastTheirScore = NaN, lastPlayers = {};
 setInterval(function()
 {
  var player = tagpro.players[tagpro.playerId];
  var ourScore = player.team == 1 ? tagpro.score.r : tagpro.score.b;
  var theirScore = player.team == 1 ? tagpro.score.b : tagpro.score.r;
  switch(tagpro.state)
  {
   case 2:
    if(unfinished)
    {
     if(theirScore > ourScore) unfinished = !play(ourScore == 0 ? ['ohdear','ohdeer'] : ['byebye']);
     else if(theirScore == ourScore) unfinished = !play(['boring','hmm']);
     else unfinished = !play(theirScore == 0 ? ['flawless','surf'] : ['victory']);
    }
    break;
   case 3:
    alive = 0;
    break;
   case 1:
    var pups = player.grip | player.bomb << 1 | player.tagpro << 2 | player.speed << 3;
    var flag = player.flag !== null;
    var players = {};
    for(var otherId in tagpro.players)
     if(otherId != tagpro.playerId)
     {
      var other = tagpro.players[otherId];
      players[otherId] = other.draw && !other.dead ? Math.max(Math.abs(other.x - player.x), Math.abs(other.y - player.y)) : Infinity;
     }
    var nearby = [false, false, false, false], missed = false;
    for(var otherId in lastPlayers)
     if(otherId in tagpro.players && lastPlayers[otherId] < 120)
     {
      var other = tagpro.players[otherId];
      nearby[other.dead << 1 | (other.team == player.team ? 1 : 0)] = true;
      if((flag || other.tagpro) && other.dead && other.team != player.team) missed = true;
     }
    if(player.dead)
    {
     if(lastSpeed == lastSpeed)
     {
      if(firstblood && nearby[2]) play(['firstblood']);
      else if(nearby[0]) play(alive < 60 ? ['leavemealone','goaway'] : ['illgetyou','justyouwait','youllregretthat']);
      else if(nearby[1]) play(['traitor','whatthe']);
      else if(nearby[2]) play(['revenge','kamikaze']);
      else play(['stupid','bummer','ouch']);
      firstblood = false;
      alive = 0;
     }
     lastX = NaN, lastY = NaN, lastLastSpeed = NaN, lastSpeed = NaN;
    }
    else
    {
     var speed = Math.max(Math.abs(player.x - lastX), Math.abs(player.y - lastY));
     if(ourScore > lastOurScore) play(['excellent','perfect','amazing','brilliant']);
     else if(theirScore > lastTheirScore) play(['comeonthen','hello','hellouk','hellous','uhoh','nooo']);
     else if(missed) play(['missed','coward']);
     else if(alive != alive) { play(['yessir','jump1','jump2']); alive = 0; }
     else if(!lastFlag && flag) play(['watchthis','fire','orders']);
     else if(nearby[2]) play(firstblood ? ['firstblood'] : ['fatality','laugh','dragonpunch','fireball']);
     else if(nearby[3]) play(firstblood ? ['firstblood'] : ['oops','oinutter']);
     else if(~lastPups & pups) play(['collect','drop']);
     else if(speed - Math.max(lastSpeed, lastLastSpeed) > 10 && speed > 20) play(['incoming','takecover','takeover','grenade','runaway','wobble','bungee']);
     else if(speed - Math.min(lastSpeed, lastLastSpeed) < -5 && speed < 10) play(nearby[0] ? ['ow1','ow2','ow3'] : ['ooff1','ooff2','ooff3','oof1','oof2','oof3']);
     else if(hurry && theirScore >= ourScore && tagpro.gameEndsAt - Date.now() < 60000) hurry = !play(['hurry']);
     if(nearby[2]) firstblood = false;
     alive++;
     lastX = player.x, lastY = player.y, lastLastSpeed = lastSpeed, lastSpeed = speed;
    }
    lastPups = pups, lastFlag = flag, lastPlayers = players, lastOurScore = ourScore, lastTheirScore = theirScore;
  }
 }, 50);

}

} + ')();';
document.body.appendChild(script);
document.body.removeChild(script);

window.addEventListener('beforeunload', function()
{
 var hidden = document.getElementById('worms');
 if(hidden)
  GM_setValue('worms', hidden.value);
});

})();
