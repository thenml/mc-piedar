// from minecraft code (js-ified)
function check(x, z, radius) {
	const bufferRange = 2;
	const deltaX = Math.max(0, Math.abs(x - (state.px - center)) - bufferRange);
	const deltaZ = Math.max(0, Math.abs(z - (state.pz - center)) - bufferRange);
	const distanceSquared = deltaX * deltaX + deltaZ * deltaZ;
	const radiusSquared = radius * radius;
	return distanceSquared < radiusSquared;
}
let timecost = 0;
let debug = false;

function find() {
	timecost = 0;
	state.rd = 1;
	const dir = dirV4();
	draw();
	return { dir, timecost, correct: realDirections[state.px + "," + state.pz] };
}

function chopdar() {
	if (state.px === null || state.pz === null) {
		alert("select a point first (click on the map!)");
		return;
	}
	timecost = 0;
	state.rd = 1;
	state.maybe = [];
	if (debug) draw();
	const dir = dirV4();
	state.arrow = dir;
	rdInput.value = state.rd;
	rdVal.innerHTML = state.rd;
	draw();
	console.log(dir, timecost);
}

const realDirections = {};

let sx = null;
let sz = null;
const move = {
	n: () => {
		state.z = state.z - 1;
		if (sz === null) sz = state.z + 0.5;
		if (Math.abs(state.z - sz) > 1) {
			sz = state.z + 0.5;
			timecost += 6;
		}
		timecost += 0.5;
		// draw();
	},
	s: () => {
		state.z = state.z + 1;
		if (sz === null) sz = state.z - 0.5;
		if (Math.abs(state.z - sz) > 1) {
			sz = state.z - 0.5;
			timecost += 6;
		}
		timecost += 0.5;
		// draw();
	},
	e: () => {
		state.x = state.x + 1;
		if (sx === null) sx = state.x - 0.5;
		if (Math.abs(state.x - sx) > 1) {
			sx = state.x - 0.5;
			timecost += 6;
		}
		timecost += 0.5;
		// draw();
	},
	w: () => {
		state.x = state.x - 1;
		if (sx === null) sx = state.x + 0.5;
		if (Math.abs(state.x - sx) > 1) {
			sx = state.x + 0.5;
			timecost += 6;
		}
		timecost += 0.5;
		// draw();
	},
	rd: rd => {
		state.rd = rd;
		timecost += 2.5;
		// draw();
	},
	check: () => {
		timecost += 0.4;
		const c = check(state.x, state.z, state.rd);
		if (debug) {
			if (c) setChecking(1);
			else setChecking(-1);
			draw();
		}
		return c;
	},
};

function dirV0(check) {
	const stepNorth = rd => check(0, -1, rd);
	const stepSouth = rd => check(0, 1, rd);
	const stepEast = rd => check(1, 0, rd);
	const stepWest = rd => check(-1, 0, rd);
	const center = rd => check(0, 0, rd);

	let high = 1;
	while (!center(high)) {
		high *= 2;
	}

	let low = 0;
	let baseR = high;
	while (low <= high) {
		let mid = Math.floor((low + high) / 2);
		if (center(mid)) {
			baseR = mid;
			high = mid - 1;
		} else {
			low = mid + 1;
		}
	}

	const strictR = baseR - 1;

	const getScore = movePointer => {
		if (movePointer(strictR)) {
			return 1;
		}

		if (movePointer(strictR + 1)) {
			return 2;
		}

		return 3;
	};

	const scoreN = getScore(stepNorth);
	const scoreS = getScore(stepSouth);
	const scoreE = getScore(stepEast);
	const scoreW = getScore(stepWest);

	let direction = "";

	if (scoreN < scoreS) direction += "N";
	if (scoreS < scoreN) direction += "S";

	if (scoreE < scoreW) direction += "E";
	if (scoreW < scoreE) direction += "W";

	return direction !== "" ? direction : "Center";
}
function dirV4() {
	// find radius
	let high = 1;
	let rd = 1;

	if (!move.check()) {
		while (true) {
			high *= 4;
			move.rd(high);
			if (move.check()) break;
		}

		let low = Math.floor(high / 4) + 1;
		rd = high;
		while (low <= high) {
			let mid = Math.floor((low + high) / 2);
			move.rd(mid);
			if (move.check()) {
				rd = mid;
				high = mid - 1;
			} else {
				low = mid + 1;
			}
		}
	}
	rd -= 1;
	if (rd < 2) return "Center";
	move.rd(rd);

	move.n();
	let isFWD = move.check();
	let isBCK = !isFWD;

	if (!isFWD) {
		move.rd(rd + 1);
		isBCK = !move.check();
	}
	move.s();
	move.e();
	let isRIGHT = false;
	let isLEFT = false;

	if (isFWD) {
		isRIGHT = move.check();
		if (!isRIGHT) {
			move.rd(rd + 1);
			isLEFT = !move.check();
		}
	} else {
		let checkNormal = move.check();
		if (!checkNormal) {
			isLEFT = true;
		} else {
			move.rd(rd);
			isRIGHT = move.check();
			move.rd(rd + 1);
		}
	}
	move.w();

	let dirZ = isFWD ? "N" : isBCK ? "S" : "";
	let dirX = isRIGHT ? "E" : isLEFT ? "W" : "";

	return dirZ + dirX || "Center";
}
