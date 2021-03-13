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
	maximumEmoteLimit_pleb: 1,
})

const emoteSize = 56;

const emotePositions = [];
const emoteTextures = {};
const pendingEmoteArray = [];
ChatInstance.on("emotes", (e) => 
{
	//get 1/10th of the emotes then pick the oldest from that selection
	var fiveRandomPositions = getRandomFromArray(emotePositions, 8); //i named this "five random" but then changed it to 8 :)
	
	var selectedPos = 0;
	var oldestPos = fiveRandomPositions[0].created;
	for (let index = 1; index < fiveRandomPositions.length; index++) {
		if(fiveRandomPositions[index].created < oldestPos || fiveRandomPositions[index].emote == null)
		{
			selectedPos = index;
		}
	}

	emotePositions[fiveRandomPositions[selectedPos].id].created = Date.now();
	emotePositions[fiveRandomPositions[selectedPos].id].emote = e.emotes[0];
	
	if(shadowlordEmotes.includes(e.emotes[0].name))
	{
		armGradual += 1;
	}
	else if(lennyEmotes.includes(e.emotes[0].name))
	{	
		armGradual -= 1;
	}
	else if(dabEmotes.includes(e.emotes[0].name))
	{
		dabGradual += 1.25;
	}
	
})

const shadowlordEmotes = ["moon2SL", "VANiSH"];
const lennyEmotes = ["moon2LENNY", "CLICK", "LLenny", "Kissabrother", "KKenny", "SexyOfficer"];
const dabEmotes = ["moon2Y", "moon2GN"];

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

let dabShake = 999999;
let dabGradual = 0;

let direction = 0;
let directFlip = false;
let iters = 400;

let boxCols = 8;
let boxRows = 10;

let boxTopLeftX = 100;
let boxTopLeftY = 100;
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

let fullWidth = window.innerWidth;
let fullHeight = window.innerHeight;

let halfx = window.innerWidth / 2;
let halfy = window.innerHeight / 2;

const backgroundSrc = require('./images/disks.png');
const background = new Image(window.innerWidth, window.innerHeight);
background.src = backgroundSrc;

const lennyDiskSrc = require('./images/lenny.png');
const lennyDisk = new Image(diskWidth, diskHeight);
lennyDisk.src = lennyDiskSrc;

const shadowDiskSrc = require('./images/shadowlord.png');
const shadowDisk = new Image(diskWidth, diskHeight);
shadowDisk.src = shadowDiskSrc;

const handSrc = require('./images/moonhand.png');
const hand = new Image(handWidth, handHeight);
hand.src = handSrc;

const dabDiskSrc = require('./images/dabbroke.png');
const dabDisk = new Image(dabDiskWidth, dabDiskHeight);
dabDisk.src = dabDiskSrc;

const gameboxSrc = require('./images/gamebox.png');
const gamebox = new Image(gameBoxWidth, gameBoxHeight);
gamebox.src = gameboxSrc;

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
			dabShake *= 9;
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
		
		ctx.drawImage(shadowDisk, shadowDiskPosX, shadowDiskPosY, diskWidth, diskHeight);
		ctx.drawImage(lennyDisk, lennyDiskPosX, lennyDiskPosY, diskWidth, diskHeight);
		
		ctx.save()
		ctx.translate( handPosX + handWidth/4, handPosY + handHeight*1.5); //this is incredibly janky because im dumb
		ctx.rotate(armAngle * Math.PI / 180)
		ctx.drawImage(hand, -150, -handPosY*2.40, handWidth, handHeight);
		ctx.restore();
		
		if(armGradual > 0.01)
		{
			if(armAngle < 15)
			{
				armAngle += 0.05
			}
			armGradual -= 0.05
		}
		else if(armGradual < -0.01)
		{
			if(armAngle > -15)
			{
				armAngle -= 0.05
			}
			armGradual += 0.05
		}
		else
		{
			armAngle = armAngle * 0.9975
		}
	}

	resize();

	init();
	draw();
})