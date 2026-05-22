// this is a Mess don't look

const size = 69;
const center = size >> 1;
const size1 = size - 1;

const config = {
	getAllRealDirections: false,
};

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const ringInput = document.getElementById("ring");
const rdInput = document.getElementById("rd");
const rdVal = document.getElementById("rdVal");

rdInput.addEventListener("input", () => {
	state.rd = rdInput.value | 0;
	rdVal.textContent = state.rd;
	draw();
});

const dpr = window.devicePixelRatio || 1;

const cssSize = 800;

let cell;
function resize() {
	const cssSize = Math.min(window.innerWidth, window.innerHeight - 120);
	canvas.style.width = cssSize + "px";
	canvas.style.height = cssSize + "px";
	canvas.width = cssSize * dpr;
	canvas.height = cssSize * dpr;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	cell = cssSize / size * dpr;
}

resize();
window.addEventListener("resize", () => {
	resize();
	draw();
});

const state = {
	x: 0,
	z: 0,
	rd: 32,
	ring: false,
	text: true,

	px: null,
	pz: null,

	hoverX: -1,
	hoverZ: -1,

	holdL: false,
	holdR: false,

	maybe: [],
	arrow: null,
};

function radiusAt(cx, cz, x, z) {
	const b = 2;

	let dx = x - cx;
	if (dx < 0) dx = -dx;
	if (dx > b) dx -= b;
	else dx = 0;

	let dz = z - cz;
	if (dz < 0) dz = -dz;
	if (dz > b) dz -= b;
	else dz = 0;

	return (((dx * dx + dz * dz) ** 0.5) | 0) + 1;
}

function getPos(e) {
	const rect = canvas.getBoundingClientRect();

	return {
		x: Math.floor(((e.clientX - rect.left) / rect.width) * size),
		z: Math.floor(((e.clientY - rect.top) / rect.height) * size),
	};
}

function setChecking(v) {
	checking = v;
	if (checking === 1 && state.maybe.length <= 1) checking = 2;
	draw();
}

let checking = 0; // 1 to add, -1 to remove, 2 to first add

let colors;
themeSelectChange();

function draw() {
	const cx = state.x;
	const cz = -state.z;

	ctx.clearRect(0, 0, cssSize, cssSize);

	for (let z = 0; z < size; z++) {
		for (let x = 0; x < size; x++) {
			const rx = x - center;
			const rz = center - z;

			const px = x * cell;
			const py = z * cell;

			let bg;
			let fg;

			if (x === 0 || z === 0 || x === size1 || z === size1) {
				bg = colors.border;
				fg = colors.borderText;
				if (state.hoverX === x || state.hoverZ === z) {
					bg = colors.borderHover;
				}

				let v;
				if ((x === 0 || x === size1) && (z === 0 || z === size1)) v = "";
				else if (x === 0 || x === size1) v = rz;
				else v = rx;

				ctx.fillStyle = bg;
				ctx.fillRect(px, py, cell + 1, cell + 1);

				ctx.fillStyle = fg;
				ctx.font = "7px sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(v, px + cell / 2, py + cell / 2);
				continue;
			}

			let r = radiusAt(cx, cz, rx, rz);
			if (r < 2) r = 2;

			const isPlayer = rx === cx && rz === cz;
			const point = `${x},${z}`;

			const outrd = r > state.rd || (state.ring && r < state.rd);

			if (checking !== 0) {
				if (checking === 2 && !outrd) state.maybe.push(point);
				else if (!outrd ^ (checking === 1) && state.maybe.includes(point))
					state.maybe.splice(state.maybe.indexOf(point), 1);
			}

			if (isPlayer) {
				bg = colors.player;
				fg = colors.playerText;
			} else {
				bg = colors.rings(r, outrd, state.hoverX === x || state.hoverZ === z, state.maybe.includes(point));
				fg = outrd ? colors.voidText : colors.text;
				if (state.px === x && state.pz === z) {
					bg = outrd ? colors.pointVoid : colors.point;
					fg = colors.pointText;
				}
			}

			if (config.getAllRealDirections) {
				realDirections[point] = r > 2 ? dirV0((ox, oz, rd) => check(-x + ox, -z + oz, rd)) : "Center";
			}

			ctx.fillStyle = bg;
			ctx.fillRect(px, py, cell + 1, cell + 1);

			if (state.text) {
				ctx.fillStyle = fg;
				ctx.font = "4px";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(r, px + cell / 2, py + cell / 2);
			}
		}
	}
	checking = 0;
	config.getAllRealDirections = false;
	if (state.arrow) drawArrow(state.arrow);
}

function drawArrow(dir) {
	const cx = (center + state.x) * cell + cell / 2;
	const cy = (center + state.z) * cell + cell / 2;

	let dx = 0;
	let dy = 0;

	if (dir.includes("N")) dy = -1;
	if (dir.includes("S")) dy = 1;
	if (dir.includes("W")) dx = -1;
	if (dir.includes("E")) dx = 1;

	const len = cell * 3;

	const x2 = cx + dx * len;
	const y2 = cy + dy * len;

	const headSize = cell;

	// line
	ctx.strokeStyle = colors.playerText;
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(x2, y2);
	ctx.stroke();

	// arrow head
	const angle = Math.atan2(y2 - cy, x2 - cx);

	const hx1 = x2 - Math.cos(angle - Math.PI / 6) * headSize;
	const hy1 = y2 - Math.sin(angle - Math.PI / 6) * headSize;

	const hx2 = x2 - Math.cos(angle + Math.PI / 6) * headSize;
	const hy2 = y2 - Math.sin(angle + Math.PI / 6) * headSize;

	ctx.beginPath();
	ctx.moveTo(x2, y2);
	ctx.lineTo(hx1, hy1);
	ctx.lineTo(hx2, hy2);
	ctx.closePath();
	ctx.fillStyle = colors.playerText;
	ctx.fill();
}

function applyPoint(x, z) {
	state.px = x;
	state.pz = z;
	draw();
}

function applyHold(e) {
	const { x, z } = getPos(e);
	if (x < 0 || z < 0 || x >= size || z >= size) return;

	if (state.holdL) applyPoint(x, z);
	if (state.holdR) movePlayer(x - center, z - center, 32);
}

canvas.addEventListener("pointerdown", e => {
	if (e.button === 0) state.holdL = true;
	if (e.button === 2) state.holdR = true;

	applyHold(e);
});

canvas.addEventListener("pointermove", e => {
	const { x, z } = getPos(e);

	state.hoverX = x;
	state.hoverZ = z;

	applyHold(e);
	draw();
});

canvas.addEventListener("pointerleave", () => {
	state.hoverX = -1;
	state.hoverZ = -1;
	draw();
});

window.addEventListener("pointerup", () => {
	state.holdL = false;
	state.holdR = false;
});

// arrow keys
window.addEventListener("keydown", e => {
	if (e.key === "ArrowUp" || e.key === "w") movePlayer(state.x, state.z - 1);
	else if (e.key === "ArrowDown" || e.key === "s") movePlayer(state.x, state.z + 1);
	else if (e.key === "ArrowLeft" || e.key === "a") movePlayer(state.x - 1, state.z);
	else if (e.key === "ArrowRight" || e.key === "d") movePlayer(state.x + 1, state.z);
	else if (e.key === "-") {
		state.rd = Math.max(state.rd - 1, 2);
		rdInput.value = state.rd;
		rdVal.innerHTML = state.rd;
		draw();
	} else if (e.key === "=") {
		state.rd = Math.min(state.rd + 1, 32);
		rdInput.value = state.rd;
		rdVal.innerHTML = state.rd;
		draw();
	} else if (e.key === "[") setChecking(-1);
	else if (e.key === "]") setChecking(1);
	else if (e.key === " ") chopdar();
});

canvas.addEventListener("contextmenu", e => e.preventDefault());

function movePlayer(x, z) {
	state.x = x;
	state.z = z;

	ringInput.checked = state.ring;
	draw();
}

function resetPlayer() {
	state.ring = false;
	movePlayer(0, 0, 32);
}

function reset() {
	state.px = null;
	state.pz = null;
	state.maybe = [];
	state.arrow = null;
	resetPlayer();
}

resetPlayer();
