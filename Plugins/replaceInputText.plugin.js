//META{"name":"replaceInputText"}*//

/*@cc_on
@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you mistakenly tried to run me directly. (don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.\nJust reload Discord with Ctrl+R.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 03x4) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!\nJust reload Discord with Ctrl+R.", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else @*/

var replaceInputText = (function() {
	var replacements;
	return class replaceInputText {
		getName() { return "Replace Input Text"; }
		getDescription() { return "Replace text with other text in the text input box"; }
		getVersion() { return "1.3.0"; }
		getAuthor() { return "lixbin"; }

		load() {}

		start() {
			replacements = replaceInputText.loadSettings();
			this.begin();
		}

		onSwitch() {
			this.begin();
		}

		stop() {
			$('.channel-text-area-default div textarea').off('keyup.QJsl');
		}

		begin() {
			const teA = $('.channel-text-area-default div textarea');
			if(!teA.length) return;
			teA.off('keyup.QJsl').on('keyup.QJsl', (e) => {
				replacements.forEach(function(value, key) {
					if(teA.val().includes(key)) {
						teA.val(teA.text().replace(key, value));
						teA.focus()[0].dispatchEvent(new Event('input', { bubbles: true }));
					}
				});
			});
		}
	
		static saveSettings(map) {
			bdPluginStorage.set("replaceInputText", "replacements", JSON.stringify([...map]));
		}

		static loadSettings() {
			var settingsJson = bdPluginStorage.get("replaceInputText", "replacements");
			if (settingsJson) {
				return new Map(JSON.parse(settingsJson));
			} else {
				var map = {};
				map = new Map([
					[":shrug2:","¯\\_(ツ)_/¯"],
					[":)",":blobsmile:"],
					[":-)",":blobsmile:"],
					[":(",":blobfrown:"],
					[":-(",":blobfrown:"],
					["-.-",":blobexpressionless:"],
					[":|",":blobexpressionless:"],
					[":-|",":blobexpressionless:"],
					[":P",":blobcheeky:"],
					[":-P",":blobcheeky:"],
					[":-/",":blobawkward:"],
					[":'(",":blobcry:"],
					[":D",":blobgrin:"],
					[":-D",":blobgrin:"],
					["O_O",":blobsleepless:"],
					[":o",":blobopenmouth:"],
					[">:(",":blobangry:"],
					[";)",":blobwink:"],
					[";-)",":blobwink:"],
					[":?:",":blobtilt:"]
				]);
				this.saveSettings(map);
				return map;
			}
		}

		getSettingsPanel() {
			return `
				<style>
					#settings_replaceInputText {
						color: #b0b6b9;
					}
					#settings_replaceInputText #title {
						float: left;
						margin-top: -30px;
						font-size: 24px;
					}
					#settings_replaceInputText #buttons {
						float: right;
						margin-top: -30px;
						margin-right: 20px;
						font-size: 0;
					}
					#settings_replaceInputText input[type=text] {
						border: 0px;
						width: 260px;
						height: 30px;
						padding: 0px 5px;
						margin: 2px;
						font-size: 16px;
						background-color: hsla(218,5%,47%,.3);
						color: hsla(0,0%,100%,.7);
						border-radius: 5px;
					}
					#settings_replaceInputText .blue_button {
						background-color: #1c97f3;
					}
					#settings_replaceInputText .red_button {
						background-color: #fd1200;
					}
					#settings_replaceInputText #add_button2 {
						margin-left: 529px;
					}
					#settings_replaceInputText button {
						font-size: 16px;
						margin: 2px;
						cursor: pointer;
						width: 30px;
						height: 30px;
						line-height: 9px;
						padding: 0px 5px;
						border-radius: 5px;
					}
					#settings_replaceInputText .headers span {
						width: 260px;
						padding: 8px 5px 0px 5px;
						margin: 0px 2px;
						font-size: 21px;
						display: inline-block;
					}
					#settings_replaceInputText div {
						margin: 0;
						white-space: nowrap;
					}
				</style>
				<div id="settings_replaceInputText">
					<span id="title">Replace Input Text Settings</span>
					<img src onerror='replaceInputText.settingsOnLoad()'>
					<div id="buttons">
						<button class="add_button blue_button">➕</button>
						<button class="save_button blue_button">💾</button>
						<button class="reload_button blue_button">🔃</button>
					</div>
					<div class="headers"><span>Find</span><span>Replace</span></div>
					<div id="lines"></div>
					<button id="add_button2" class="add_button blue_button">➕</button>
				</div>
			`;
		}

		static settingsOnLoad() {
			var wrapper = $("#settings_replaceInputText #lines");

			$("#settings_replaceInputText .add_button").click(function(e) {
				e.preventDefault();
				addBlankLine();
			})

			$("#settings_replaceInputText .reload_button").click(function(e) {
				e.preventDefault();
				fillLines(replacements);
			})

			function fillLines(map) {
				$("#settings_replaceInputText .line").remove();
				map.forEach(function(value, key) {
					$(wrapper).append('<div class="line"><input type="text" id="key" value="' + key + '" /><input type="text" id="value" value="' + value + '"/><button class="delete_button red_button">❌</button></div>');
				});
				addBlankLine();
			}
			fillLines(replacements);

			function addBlankLine() {
				$(wrapper).append('<div class="line"><input type="text" id="key" /><input type="text" id="value" /><button class="delete_button red_button">❌</button></div>');
				$("#settings_replaceInputText .delete_button").click(function(e) {
					e.preventDefault();
					$(this).parent('div').remove();
				});
			}

			$("#settings_replaceInputText .save_button").click(function(e) {
				e.preventDefault();
				var keys = $("#settings_replaceInputText input#key");
				var values = $("#settings_replaceInputText input#value");
				var inputs = new Map();
				for (var i = 0; i < keys.length; i++) {
					if (keys[i].value) {
						inputs.set(keys[i].value, values[i].value);
					}
				}
				replacements = inputs;
				replaceInputText.saveSettings(replacements);
				fillLines(replacements);
			});
		}
	};
})();

window.replaceInputText = replaceInputText;
/*@end @*/
