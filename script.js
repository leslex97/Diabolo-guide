window.addEventListener(
	"load",

	function () {
		var classNamedOld;
		var serializer = new XMLSerializer();
		var clicked = false;
		document.getElementById("alertBtn").onclick = function () {
			var xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(
						xhttp.responseText,
						"application/xml"
					);

					var xml = serializer.serializeToString(xmlDoc);
					var characterChoice = parseInt(
						document.getElementById("characterSelect").value
					);
					var nickName = document.getElementById("nickname").value;
					var heroes = xmlDoc.querySelectorAll("postac");
					var heroesList = [];

					for (let i = 0; i < heroes.length; i++) {
						let hero = heroes[i];
						heroesList.push(hero);
					}

					let hero = heroesList[characterChoice];

					showCharacters(hero, nickName);
					showDescription(hero);
					pushIntoTable(hero);
					selectWeapon(hero);
					showMeta(xml);
					showEquipInConsole(hero);
					clicked = true;
				}
			};

			function showCharacters(hero, nickName) {
				if (clicked === true) {
					let mainDiv = document.getElementById("mainDiv");
					mainDiv.removeChild(document.getElementById("character"));
				}

				var className = hero.attributes.className.value;
				var heroPictureLink = hero.getElementsByTagName("wyglad");
				heroPictureLink = heroPictureLink[0].innerHTML
					.replace("<![CDATA[", "")
					.replace("]]>", "");
				let mainDiv = document.querySelector("#mainDiv");
				let character = document.createElement("div");
				character.id = "character";
				mainDiv.append(character);
				mainDiv.insertBefore(
					character,
					document.getElementsByClassName("characterStats")[0]
				);
				let classLabel = document.createElement("h2");
				let photo = document.createElement("img");
				classLabel.innerHTML = className + " " + nickName;
				photo.src = heroPictureLink;
				photo.style.width = "300px";
				photo.style.height = "300px";
				character.append(classLabel, photo);
			}

			function showDescription(hero) {
				let description = hero.querySelector("opis").innerHTML;
				let descriptionTextarea = document.querySelector("#info");
				descriptionTextarea.innerHTML = description;
				descriptionTextarea.style.width = "600px";
				descriptionTextarea.style.height = "180px";
			}

			function pushIntoTable(hero) {
				let table = document.querySelector("tbody");
				let charactersStats = table.rows;
				var classNamed = hero.attributes.className.value;

				if (clicked === true) {
					for (let i = 1; i < charactersStats.length; i++) {
						charactersStats[i].style.display = null;
						let thSelect = document.querySelector(".tableHeader");
						thSelect.removeChild(document.querySelector(".thGeneric"));
						let tdSelect = document.querySelector("." + classNamedOld);
						tdSelect.removeChild(document.querySelector(".tdGeneric"));
					}
				}

				classNamedOld = classNamed;

				for (let i = 1; i < charactersStats.length; i++) {
					if (classNamed === charactersStats[i].className) {
						for (const name of hero.getAttributeNames()) {
							if (name == "id") {
								continue;
							}

							let thSelect = document.querySelector(".tableHeader");
							var th = document.createElement("th");
							th.className = "thGeneric";
							th.textContent = name;
							thSelect.append(th);

							const value = hero.getAttribute(name);
							let tdSelect = document.querySelector(`.${classNamed}`);
							var td = document.createElement("td");
							td.className = "tdGeneric";
							td.textContent = value;
							tdSelect.append(td);
						}

						continue;
					}

					charactersStats[i].style.display = "none";
				}
			}

			function selectWeapon(hero) {
				let characterDiv = document.querySelector("#character");
				let selectionArea = document.createElement("div");
				selectionArea.id = "selectionArea";
				characterDiv.appendChild(selectionArea);
				let selectionAreaHeader = document.createElement("h2");
				selectionAreaHeader.innerHTML = "Choose a weapon";

				let leftHandHeader = document.createElement("h3");
				leftHandHeader.innerHTML = "Left Hand";
				selectionArea.append(selectionAreaHeader, leftHandHeader);

				let leftHandWeapons =
					hero.querySelector("lewa_reka").firstElementChild.children;
				let leftHandSelect = document.createElement("select");
				leftHandSelect.id = "leftHand";

				selectionArea.appendChild(leftHandSelect);

				for (let j = 0; j < leftHandWeapons.length; j++) {
					let option = document.createElement("option");
					option.value = leftHandWeapons[j].innerHTML;
					option.text = leftHandWeapons[j].innerHTML;
					leftHandSelect.append(option);
				}

				let rightHandHeader = document.createElement("h3");
				rightHandHeader.innerHTML = "Right Hand";
				selectionArea.append(rightHandHeader);

				let rightHandWeapons =
					hero.querySelector("prawa_reka").firstElementChild.children;
				let rightHandSelect = document.createElement("select");
				rightHandSelect.id = "rightHand";
				selectionArea.appendChild(rightHandSelect);

				for (let j = 0; j < rightHandWeapons.length; j++) {
					let option = document.createElement("option");
					option.value = rightHandWeapons[j].innerHTML;
					option.text = rightHandWeapons[j].innerHTML;
					rightHandSelect.append(option);
				}
			}

			function showMeta(xml) {
				let mainDiv = document.querySelector("#mainDiv");

				if (clicked === true) {
					mainDiv.removeChild(document.getElementById("sourceField"));
				}
				let sourceField = document.createElement("input");
				sourceField.id = "sourceField";
				mainDiv.appendChild(sourceField);
				sourceField.style.width = "100%";
				let metaData = xml.slice(48, 200);
				sourceField.value = metaData;
			}

			function showEquipInConsole(hero) {
				console.clear();
				let equip = hero.children[2];

				let leftHandList = equip.querySelector("lewa_reka");
				leftHand = [];
				for (let i = 0; i < leftHandList.children.length; i++) {
					leftHand.push(leftHandList.children[i]);
				}

				let rightHandList = equip.querySelector("prawa_reka");
				let rightHand = [];
				for (let i = 0; i < rightHandList.children.length; i++) {
					rightHand.push(rightHandList.children[i]);
				}

				let armors = equip.querySelector("pancerze");
				let extraEquip1 = equip.querySelector("dodatki_1");
				let extraEquip2 = equip.querySelector("dodatki_2");

				console.log(`%c leftHand `, "background: #222; color: #c55");
				for (i = 0; i < leftHand.length; i++) {
					let leftWeapon = leftHand[i];
					console.log(
						`%c ${leftWeapon.attributes.equipName.value} `,
						"background: #222; color: #bada55"
					);
					for (let j = 0; j < leftWeapon.children.length; j++) {
						console.log(leftWeapon.children[j].innerHTML);
					}
					console.log(" ");
				}

				console.log(`%c rightHand `, "background: #222; color: #c55");

				for (i = 0; i < rightHand.length; i++) {
					let rightWeapon = rightHand[i];
					console.log(
						`%c ${rightWeapon.attributes.equipName.value} `,
						"background: #222; color: #bada55"
					);
					for (let j = 0; j < rightWeapon.children.length; j++) {
						console.log(rightWeapon.children[j].innerHTML);
					}
					console.log(" ");
				}

				console.log(
					`%c ${armors.attributes.equipName.value} `,
					"background: #222; color: #bada55"
				);
				for (let i = 0; i < armors.children.length; i++) {
					console.log(armors.children[i].innerHTML);
				}
				console.log(" ");

				console.log(
					`%c ${extraEquip1.attributes.equipName.value} `,
					"background: #222; color: #bada55"
				);

				for (let i = 0; i < extraEquip1.children.length; i++) {
					console.log(extraEquip1.children[i].innerHTML);
				}
				console.log(" ");

				console.log(
					`%c ${extraEquip2.attributes.equipName.value} `,
					"background: #222; color: #bada55"
				);
				for (let i = 0; i < extraEquip2.children.length; i++) {
					console.log(extraEquip2.children[i].innerHTML);
				}
			}
			xhttp.open("GET", "data_01_02.xml", true);
			xhttp.send();
		};
	},
	false
);
