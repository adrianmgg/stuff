const root_elem = document.getElementById('root_elem');

function createElementHelper(tagName, parent, {style:{vars:styleVars={}, ...style}={}, attrs={}, events={}, classList=[], insertBefore=null, ...props}={}) {
	let elem = document.createElement(tagName);
	if(parent != null) {
		if(insertBefore != null) parent.insertBefore(elem, insertBefore);
		else parent.appendChild(elem);
	}
	for(let k in style) elem.style[k] = style[k];
	for(let k in styleVars) elem.style.setProperty(k, styleVars[k]);
	for(let k in attrs) elem.setAttribute(k, attrs[k]);
	for(let k in events) elem.addEventListener(k, events[k]);
	elem.classList.add.apply(elem.classList, classList);
	for(let k in props) elem[k] = props[k];
	return elem;
}

const colorData = {
//	black: {color: '#000000', bgcolor: '#000000', escape: '0'},
	dark_blue: {color: '#0000AA', bgcolor: '#00002A', escape: '1'},
	dark_green: {color: '#00AA00', bgcolor: '#002A00', escape: '2'},
	dark_aqua: {color: '#00AAAA', bgcolor: '#002A2A', escape: '3'},
	dark_red: {color: '#AA0000', bgcolor: '#2A0000', escape: '4'},
	dark_purple: {color: '#AA00AA', bgcolor: '#2A002A', escape: '5'},
	gold: {color: '#FFAA00', bgcolor: '#2A2A00', escape: '6'},
	gray: {color: '#AAAAAA', bgcolor: '#2A2A2A', escape: '7'},
	dark_gray: {color: '#555555', bgcolor: '#151515', escape: '8'},
	blue: {color: '#5555FF', bgcolor: '#15153F', escape: '9'},
	green: {color: '#55FF55', bgcolor: '#153F15', escape: 'a'},
	aqua: {color: '#55FFFF', bgcolor: '#153F3F', escape: 'b'},
	red: {color: '#FF5555', bgcolor: '#3F1515', escape: 'c'},
	light_purple: {color: '#FF55FF', bgcolor: '#3F153F', escape: 'd'},
	yellow: {color: '#FFFF55', bgcolor: '#3F3F15', escape: 'e'},
	white: {color: '#FFFFFF', bgcolor: '#3F3F3F', escape: 'f'}
};

let initFinished = false;
function updateForm() {
	if(!initFinished) return;
	let chatColor = chatColorDropdown.value;
	let nameColor = nameColorDropdown.value;
	let username = usernameInput.value;
	let rankName = `rank_for_${username.toLowerCase()}`;
	commandsDisplay.textContent = `with a rank:
/ranks create ${rankName}
/ranks set_permission ${rankName} power 101
/ranks add ${username} ${rankName}
/ranks set_permission ${rankName} ftbutilities.chat.name_format <&${colorData[nameColor].escape}{name}&r>
/ranks set_permission ${rankName} ftbutilities.chat.text.color ${chatColor}

with a nickname (won't change text color):
/nick &${colorData[nameColor].escape}${username}&r`;
	
	previewName.style.color = colorData[nameColor].color;
	previewName.style.setProperty('--bg-color', colorData[nameColor].bgcolor);
	previewMessage.style.color = colorData[chatColor].color;
	previewMessage.style.setProperty('--bg-color', colorData[chatColor].bgcolor);
}
function colorDropdownOnChange(e) {
	e.target.style.backgroundColor = '#000000';
	e.target.style.color = colorData[e.target.value].color;
	updateForm();
}

function createLabel(content, parent) {
	return createElementHelper('label', createElementHelper('div', parent), {textContent: content});
}

let root = createElementHelper('div', root_elem);
let commandsDisplay = createElementHelper('pre', root_elem, {
	style: {
		overflowX: 'auto'
	}
});
let previewRoot = createElementHelper('div', root_elem, {
	style: {
		fontFamily: `'Minecraftia', sans-serif`,
		fontSize: '16px',
		backgroundColor: '#000000',
		whiteSpace: 'pre',
		paddingTop: '2px',
		paddingBottom: '2px',
		paddingLeft: '6px',
		paddingRight: '6px',
		width: 'fit-content'
	},
	id: 'preview_root'
});

let nameColorDropdown = createElementHelper('select', createLabel('name color:', root), {
	events: {
		change: colorDropdownOnChange
	}
});
let chatColorDropdown = createElementHelper('select', createLabel('text color:', root), {
	events: {
		change: colorDropdownOnChange
	}
});

for(let colorDropdown of [nameColorDropdown, chatColorDropdown]) {
	for(let colorName in colorData) {
		createElementHelper('option', colorDropdown, {
			value: colorName,
			textContent: colorName,
			style: {
				color: colorData[colorName].color,
				backgroundColor: '#000000'
			}
		});
	}
	colorDropdown.value = 'white';
	colorDropdown.dispatchEvent(new Event('change'));
}

let usernameInput = createElementHelper('input', createLabel('username:', root), {
	value: 'username',
	events: {
		input: function(e) {
			previewName.textContent = e.target.value;
			updateForm();
		}
	}
});

function createPreviewElement(text) {
	return createElementHelper('span', previewRoot, {
		textContent: text,
		style: {
			color: colorData.white.color,
			vars: {
				'--bg-color': colorData.white.bgcolor
			}
		}
	});
}
createPreviewElement('<');
let previewName = createElementHelper('span', previewRoot, {
	contentEditable: true,
	style: {
		outline: '0px solid transparent',
	},
	events: {
		input: function(e) {
			usernameInput.value = e.target.textContent;
			updateForm();
		}
	},
	textContent: 'username',
	spellcheck: false,
});
createPreviewElement('> ');
let previewMessage = createElementHelper('span', previewRoot, {
	contentEditable: true,
	textContent: 'example message',
	style: {
		outline: '0px solid transparent',
	},
	spellcheck: false,
});

initFinished = true;
updateForm();