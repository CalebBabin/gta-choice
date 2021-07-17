import Chat from 'twitch-chat-emotes';

let channels = ['moonmoon'];
const query_vars = {};
const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
	query_vars[key] = value;
});
if (query_vars.channels) {
	channels = query_vars.channels.split(',');
}

const ChatInstance = new Chat({
	channels,
	duplicateEmoteLimit: 1,
	duplicateEmoteLimit_pleb: 0,
	maximumEmoteLimit: 3,
	maximumEmoteLimit_pleb: 1,
})

const emoteSize = 56;

const emotePositions = [];
const emoteTextures = {};
const pendingEmoteArray = [];
ChatInstance.on("emotes", (e) => 
{
	//get 1/3rd of the emotes then pick the oldest from that selection - originally was a smaller selection but was meh
	for (let emoteIndex = 0; emoteIndex < e.emotes.length; emoteIndex++) 
	{
		var someRandomPositions = getRandomFromArray(emotePositions, Math.floor(emotePositions.length/3));
		
		var selectedPos = 0;
		var oldestPos = someRandomPositions[0].created;
		for (let index = 1; index < someRandomPositions.length; index++) {
			if(someRandomPositions[index].created < oldestPos || someRandomPositions[index].emote == null)
			{
				selectedPos = index;
			}
		}

		emotePositions[someRandomPositions[selectedPos].id].created = Date.now();
		emotePositions[someRandomPositions[selectedPos].id].emote = e.emotes[emoteIndex];
		
		if(shadowlordEmotes.includes(e.emotes[emoteIndex].name.toLowerCase()))
		{
			armGradual += 1;
		}
		else if(lennyEmotes.includes(e.emotes[emoteIndex].name.toLowerCase()))
		{	
			armGradual -= 1;
		}
		else if(actualShadowlordEmotes.includes(e.emotes[emoteIndex].name.toLowerCase()))
		{	
			shadowTogo += 0.5;
			counte++;
		}
		else if(dabEmotes.includes(e.emotes[emoteIndex].name.toLowerCase()))
		{
			if(dabGradual < 0.5)
			{
				dabGradual += 3;
			}
			else
			{
				dabGradual += 1.25;
			}
		}
	}
	
})

const actualshadowlordemotes = ["moon2sl", "vanish"];
const shadowlordemotes = ["hyperrobdab", "robdab", "taketherob", "robpls", "pentaweebey", "pentawcold", "pentawblockwork", "pentawmikeweird", "pentawmikef", "pentawblock"];
const lennyEmotes = ["moon2lenny", "click", "llenny", "kissabrother", "kkenny", "sexyofficer", "poolice", "born2run", "code1", "imvcb", "lennywalk", "lennybass", "baldyappp", "moon2huh", "mahalo", "weewoo"];
const dabemotes = ["moon2y", "moon2gn", "refracting"];

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const easeInOutSine = (currentIteration, startValue, changeInValue, totalIterations) => {
	return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
}

function getRandomFromArray(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

const getSpawnPosition = () => {
	
	let rand = Math.floor(Math.random() * emotePositions.length)
	
	let x = emotePositions[rand].x
	let y = emotePositions[rand].y

	return { x, y, created };
}

function populateBoxLocations()
{
	let idCount = 0;
	for (let boxRowCount = 0; boxRowCount < boxRows; boxRowCount++) 
	{
		for (let boxColCount = 0; boxColCount < boxCols; boxColCount++) 
		{
			const output = {
				x: boxTopLeftX + boxOffsetX + (boxColCount * emoteSize),
				y: boxTopLeftY + boxOffsetY + (boxRowCount * emoteSize),
				emote: null,
				created: Date.now(),
				id: idCount
			};
			idCount++;
			
			emotePositions.push(output);
		}
		
	}
}

let armAngle = 0;
let armGradual = 0;
let angleAdjust = 0;
let doIdle = false;
let moveDelay = 0;

let dabShake = 999999;
let dabGradual = 0;

let direction = 0;
let directFlip = false;
let iters = 400;

let armdirection = 0;
let armdirectFlip = false;
let armiters = 250;

let boxCols = 8;
let boxRows = 10;

let boxTopLeftX = 100;
let boxTopLeftY = 50;
let boxOffsetX = 5;
let boxOffsetY = 115;
let gameBoxWidth = 366*1.25;
let gameBoxHeight = 500*1.320;

let diskWidth = 1000 * 0.5;
let diskHeight = 1000 * 0.5;
let lennyDiskPosX = 600;
let lennyDiskPosY = 300;
let shadowDiskPosX = 1200;
let shadowDiskPosY = 300;

let handWidth = 891 * 0.75;
let handHeight = 1136 * 0.75;
let handPosX = 750;
let handPosY = 500;

let dabDiskWidth = 1200 * 0.50;
let dabDiskHeight = 1200 * 0.50;
let dabDiskPosX = -100;
let dabDiskPosY = 700;

let shadowSneakDiskWidth = 1200 * 0.50;
let shadowSneakDiskHeight = 1200 * 0.50;
let shadowSneakDiskPosX = 1325;
let shadowSneakDiskPosY = 1080;

let shadowAdjust = 0;
let shadowTogo = 0;

let fullWidth = window.innerWidth;
let fullHeight = window.innerHeight;

let halfx = window.innerWidth / 2;
let halfy = window.innerHeight / 2;

const backgroundSrc = require('./images/backgroundNew.png');
const background = new Image(window.innerWidth, window.innerHeight);
background.src = backgroundSrc;

const lennyDiskSrc = require('./images/lenny.png');
const lennyDisk = new Image(diskWidth, diskHeight);
lennyDisk.src = lennyDiskSrc;

const shadowDiskSrc = require('./images/ro.png'); //yeah im lazy, deal with it
const shadowDisk = new Image(diskWidth, diskHeight);
shadowDisk.src = shadowDiskSrc;

const handSrc = require('./images/moonhandNew.png');
const hand = new Image(handWidth, handHeight);
hand.src = handSrc;

const dabDiskSrc = require('./images/dabbroke.png');
const dabDisk = new Image(dabDiskWidth, dabDiskHeight);
dabDisk.src = dabDiskSrc;

const shadowSneakDiskSrc = require('./images/shadowlord.png');
const shadowSneak = new Image(shadowSneakDiskWidth, shadowSneakDiskHeight);
shadowSneak.src = shadowSneakDiskSrc;

const gameboxSrc = require('./images/gamebox.png');
const gamebox = new Image(gameBoxWidth, gameBoxHeight);
gamebox.src = gameboxSrc;

const gameboxOutlineSrc = require('./images/gameBoxOutline.png');
const gameboxOutline = new Image(gameBoxWidth, gameBoxHeight);
gameboxOutline.src = gameboxOutlineSrc;

const gameboxBackSrc = require('./images/gameboxBack.png');
const gameboxBack = new Image(gameBoxWidth, gameBoxHeight);
gameboxBack.src = gameboxBackSrc;

window.addEventListener('DOMContentLoaded', () => {
	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		fullWidth = window.innerWidth;
		fullHeight = window.innerHeight;
	}
	function init() {
		window.addEventListener('resize', resize)
		document.body.appendChild(canvas);
		
		populateBoxLocations();
	}

	let lastFrame = Date.now();
	function draw() {
		requestAnimationFrame(draw);

		const delta = (Date.now() - lastFrame) / 1000;
		lastFrame = Date.now();

		if (directFlip) direction++;
		else direction--;
		if (Math.abs(direction) >= iters) directFlip = !directFlip;
		
		ctx.drawImage(background, 0, 0, fullWidth, fullHeight);
		
		if(dabGradual > 0.01)
		{
			dabGradual -= 0.05;
			dabShake = 10;
		}
		else if(dabShake < 999999)
		{
			dabShake *= 19;
		}
		
		dabDiskPosX = easeInOutSine(direction, 0, 10, dabShake);
		ctx.drawImage(dabDisk, dabDiskPosX, dabDiskPosY, dabDiskWidth, dabDiskHeight);
		
		ctx.drawImage(gameboxBack, boxTopLeftX, boxTopLeftY, gameBoxWidth, gameBoxHeight);

		for (let index = emotePositions.length - 1; index >= 0; index--) {
			const element = emotePositions[index];
			
			if(element.emote != null)
			{
				ctx.drawImage(element.emote.material.canvas,
					element.x,
					(element.y) - emoteSize / 2,
					emoteSize,
					emoteSize
				);
			}
			
		}

		ctx.drawImage(gamebox, boxTopLeftX, boxTopLeftY, gameBoxWidth, gameBoxHeight);
		ctx.drawImage(gameboxOutline, boxTopLeftX, boxTopLeftY, gameBoxWidth, gameBoxHeight);
		
		ctx.drawImage(shadowDisk, shadowDiskPosX, shadowDiskPosY, diskWidth, diskHeight);
		ctx.drawImage(lennyDisk, lennyDiskPosX, lennyDiskPosY, diskWidth, diskHeight);
		
		if(shadowTogo > 0)
		{
			if(shadowAdjust < 400)
			{
				shadowAdjust += 1;
			}
			shadowTogo -= 0.04;
		}
		else if(shadowAdjust > 1.01)
		{
			shadowAdjust *= 0.9991
		}
		
		ctx.drawImage(shadowSneak, shadowSneakDiskPosX, shadowSneakDiskPosY - shadowAdjust, shadowSneakDiskWidth, shadowSneakDiskHeight);
		
		if(doIdle)
		{
			if (armdirectFlip) armdirection++;
			else armdirection--;
			if (Math.abs(armdirection) >= armiters) armdirectFlip = !armdirectFlip;
		}
		
		let armChanged = false;
		
		if(armGradual > 0.01)
		{
			if(armAngle < 15.5 && Math.abs(armGradual) > 1)
			{
				doIdle = false;
				armAngle += 0.08
			}
			armGradual -= 0.04
			moveDelay = 1
			armChanged = true
		}
		else if(armGradual < -0.01)
		{
			if(armAngle > -15.5 && Math.abs(armGradual) > 1)
			{
				doIdle = false;
				armAngle -= 0.08
			}
			armGradual += 0.04
			moveDelay = 1
			armChanged = true
		}
		else if(moveDelay > 0)
		{
			armChanged = true
			moveDelay -= 0.05
		}
		
		if(doIdle)
		{
			armAngle = easeInOutSine(armdirection, 0, 1.95, 250);
		}
		else if(armAngle < 0.025 && armAngle > -0.025 && !doIdle)
		{
			angleAdjust = armAngle;
			doIdle = true;
			armdirection = 0;
			armdirectFlip = false;
			armiters = 250;
		}
		else if(!armChanged)
		{
			if(Math.abs(armAngle) < 0.2)
			{
				armAngle = armAngle * 0.97
			}
			else if(Math.abs(armAngle) < 1)
			{
				armAngle = armAngle * 0.99
			}
			else if(Math.abs(armAngle) < 4)
			{
				armAngle = armAngle * 0.998
			}
			else
			{
				armAngle = armAngle * 0.9991
			}
		}
		
		ctx.save()
		ctx.translate( handPosX + handWidth/4, handPosY + handHeight*1.5); //this is incredibly janky because im dumb
		ctx.rotate(armAngle * Math.PI / 180)
		ctx.drawImage(hand, -150, -handPosY*2.40, handWidth, handHeight);
		ctx.restore();
	}

	resize();

	init();
	draw();
})