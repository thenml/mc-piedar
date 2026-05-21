// an attempt to solve the piedar problem

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
	const dir = dirV5();
	draw();
	return { dir, timecost, correct: realDirections[state.px + "," + state.pz] };
}

function chopdar() {
	if (state.px === null || state.pz === null) {
		alert("select a point first (click on the map!)");
		return;
	}
	state.maybe = [];
	if (debug) draw();
	const { dir } = find();
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

/** complex but 100% accurate */
// similar to standard 1.16.1 piedar
function dirV5() {
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

	// algorithm begins
	move.rd(rd);

	move.n();
	let n1 = move.check();

	move.e();
	let ne1 = move.check();

	move.s();
	let e1 = move.check();

	let n2 = n1,
		ne2 = ne1,
		e2 = e1;

	if (!e1 || !ne1 || !n1) {
		move.rd(rd + 1);
		if (!e1) e2 = move.check();

		move.n();
		if (!ne1) ne2 = move.check();

		move.w();
		if (!n1) n2 = move.check();

		move.s();
	} else {
		move.w();
	}

	let sN = n1 ? 1 : n2 ? 2 : 3;
	let sE = e1 ? 1 : e2 ? 2 : 3;
	let sNE = ne1 ? 1 : ne2 ? 2 : 3;

	let dirZ = sN === 1 ? "N" : sN === 3 ? "S" : "";
	let dirX = sE === 1 ? "E" : sE === 3 ? "W" : "";

	// tie breakers
	if (sN === 2 && sE === 2 && sNE === 1) {
		dirZ = "N";
		dirX = "E";
	} else if (sN === 2 && sE === 3 && sNE === 2) {
		dirZ = "N";
	} else if (sN === 3 && sE === 2 && sNE === 2) {
		dirX = "E";
	}

	return dirZ + dirX || "Center";
}
