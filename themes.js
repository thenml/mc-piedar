const colorsViolet = {
	text: "#fff",
	border: "#d49aed",
	borderText: "#000",
	borderHover: "#ffffff",
	player: "#09c6ff",
	playerText: "#000",
	voidText: "#ffffff8e",
	point: "#ffe600",
	pointVoid: "#9b8e1a",
	pointText: "#000",
	rings: (r, outrd, hover, pp) => {
		const h0 = 255,
			h1 = 300;
		const t = r * 0.3;
		const hue = (pp ? -180 : 0) + h0 + (h1 - h0) * (t - (t | 0));
		return `hsl(${hue}, ${outrd ? 20 : 65}%, ${(hover ? 68 : 48) - (outrd ? 30 : 0)}%)`;
	},
};

const colorsWater = {
	text: "#f4ffff",
	border: "#7ee7ff",
	borderText: "#001018",
	borderHover: "#d9fbff",
	player: "#00d9ff",
	playerText: "#001018",
	voidText: "#b8f7ff8e",
	point: "#7df9ff",
	pointVoid: "#2b7c86",
	pointText: "#001018",
	rings: (r, outrd, hover, pp) => {
		const h0 = 180,
			h1 = 220;

		const t = r <= state.rd ? r / (state.rd + 1) : (state.rd - r) / 100;
		const hue = (pp ? -25 : 0) + h0 + (h1 - h0) * (t - (t | 0));

		const sat = outrd ? 28 : 78;
		const light = (hover ? 66 : 50) - (outrd ? 26 : 0);
		return `hsl(${hue}, ${sat}%, ${light}%)`;
	},
};

const colorsSolar = {
	text: "#2b1400",
	border: "#ffb347",
	borderText: "#2b1400",
	borderHover: "#ffe3b3",
	player: "#ff5e00",
	playerText: "#2b1400",
	voidText: "#ffcfb08e",
	point: "#ffe066",
	pointVoid: "#8c6d1f",
	pointText: "#2b1400",
	rings: (r, outrd, hover, pp) => {
		const h0 = -20,
			h1 = 40;
		const t = r <= state.rd ? r / (state.rd + 1) : (state.rd - r) / 100;
		const hue = (pp ? 140 : 0) + h0 + (h1 - h0) * (t - (t | 0));
		const sat = outrd ? 35 : 92;
		const light = (hover ? 70 : 52) - (outrd ? 24 : 0);
		return `hsl(${hue}, ${sat}%, ${light}%)`;
	},
};

const colorsGray = {
	text: "#0a0a0a",
	border: "#9a9a9a",
	borderText: "#0a0a0a",
	borderHover: "#e0e0e0",
	player: "#09c6ff",
	playerText: "#000",
	void: "#0b0b0b",
	voidText: "#bdbdbd",
	voidHover: "#1a1a1a",
	point: "#ffe600",
	pointVoid: "#9b8e1a",
	pointText: "#000",
	rings: (r, outrd, hover, pp) => {
		const t = r * 0.5;

		const sat = pp ? 40 : 0;
		const lightBase = 75 + (t - (t | 0)) * 15;

		const light = (hover ? lightBase + 10 : lightBase) - (outrd ? 48 : 0);
		return `hsl(90, ${sat}%, ${light}%)`;
	},
};

function themeSelectChange() {
	if (themeSelect.value === "purple") colors = colorsViolet;
	else if (themeSelect.value === "water") colors = colorsWater;
	else if (themeSelect.value === "solar") colors = colorsSolar;
	else if (themeSelect.value === "gray") colors = colorsGray;
	draw();
}

const themeSelect = document.getElementById("theme");
themeSelect.addEventListener("change", themeSelectChange);
