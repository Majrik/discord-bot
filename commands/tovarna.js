const request = require("request");
exports.run = (client, message, args) => {
	const key = `${message.guild.id}-${message.author.id}`;
	let points = client.points.get(key, "points");
	const datetime = new Date();
	//let datetimeAddHour;
	const [first, second, third, fourth, fifth] = args;
	let discordMessage = "";
	const testEnv = client.config.test;

	if (first == null) {
		message.channel.send(`Welcome to the Tower Simulator. To build your new tower type \`.tower build\``);
	}
	else if (first == "build") {
		if (client.tower.indexes.indexOf(key) == -1) { // pro key neni vytvoren zadny zaznam v db
			client.tower.ensure(key, {
				user: message.author.id,
				guild: message.guild.id,
				tower: [{
					level: 1,
					costToBuild: 0,
					builtAt: new Date().getTime(),
					employee: {
						id: null
					},
					restock: "new",
					wasRestocked: 0
				}],
				unhiredEmployees: []
			});

			message.channel.send(`You've just built your ${client.tower.get(key, "tower[0].level")}st floor in your tower!
Now you can hire your 1st employee by typing \`.tower employee hire\``);
		} else {
			message.channel.send(`You already built your tower.`);
		}
	} else if (first == "floor" && second == "build" && third == null) {
		let delka = client.tower.get(key, "tower").length;
		let cost = client.tower.get(key, `tower[${delka - 1}].costToBuild`);
		cost = cost + delka * 6;

		if (delka > 29) {
			cost = Math.round(Math.pow(1.07, delka + 1) * 2000);
		}

		//let timeAddHour = datetime.setHours(datetime.getHours() + (delka + 1));

		message.channel.send(`\:construction_site: **__You are about to build another floor in your tower__** \:construction_site:
		
**Floor:** \`${delka + 1}\`
**Price:** \`${cost}\` Kc
**Stock price:** \`${(delka + 1) * 2}\` Kc
**Income:** \`${delka + 1}\` Kc/h
**Build time:** \`${delka + 1}\` h

**Confirmy by typing \`.tower floor build confirm\`.**`);
	} else if (first == "tower" && second == "build" && third == "confirm") {
		let delka = client.tower.get(key, "tower").length;
		let cost = client.tower.get(key, `tower[${delka - 1}].costToBuild`);
		cost = cost + delka * 6;
		let timeAddHour;

		if (delka > 29) {
			cost = Math.round(Math.pow(1.07, delka + 1) * 2000);
		}

		if (testEnv == false) {
			timeAddHour = datetime.setHours(datetime.getHours() + (delka + 1));
		}
		else {
			timeAddHour = datetime.setMinutes(datetime.getMinutes() + (delka + 1));
		}

		points = points - cost;

		if (points < 0) {
			message.channel.send(`You don't have enough coins.`);
		} else {
			client.points.set(key, points, "points");
			client.tower.push(key, {
				level: delka + 1,
				costToBuild: cost,
				builtAt: timeAddHour,
				restock: "new"
			}, "tower");
			message.channel.send(`**You've just built the \`${delka + 1}.st\` floor in your tower! It will be finished in \`${delka + 1}\` hours.**`);
		}
	} else if (first == "employee" && second == "hire" && third == null) {
		let delka = client.tower.get(key, "unhiredEmployees").length;
		let cost = client.tower.get(key, `unhiredEmployees[${delka - 1}].cost`);
		//console.log("delka: " + delka);
		if (delka == 0) {
			cost = 0;
		} else {
			cost = cost + delka * 2;
		}

		discordMessage += `\:construction_worker: **__You are about to hire another employee in your tower__** \:construction_worker:

**Price**: \`${cost}\` Kc

Confirmy by typing \`.tower employee hire confirm\`
`;

		message.channel.send(discordMessage);
	} else if (first == "employee" && second == "hire" && third == "confirm") {
		let delka = client.tower.get(key, "unhiredEmployees").length;
		let cost = client.tower.get(key, `unhiredEmployees[${delka - 1}].cost`);
		if (delka == 0) {
			cost = 0;
		} else {
			cost = cost + delka * 2;
		}

		if (cost > points) {
			message.channel.send(`You don't have enough coins.`);
		} else {

			function callback(error, response, body) {
				const bodyParsed = JSON.parse(body);
				const name = bodyParsed.results[0].name.first;
				let nameUp = name.charAt(0).toUpperCase() + name.slice(1);
				const last = bodyParsed.results[0].name.last;
				let lastUp = last.charAt(0).toUpperCase() + last.slice(1);
				const gender = bodyParsed.results[0].gender;
				const genderUp = gender.charAt(0).toUpperCase() + gender.slice(1);
				let rarity, incomeCoefficient;

				//nameUp = "Genesis";
				//lastUp = "Howell";
				const duplicateName = client.tower.get(key, `tower`).findIndex(emp => {
					try {
						return emp.employee.name == nameUp && emp.employee.last == lastUp;
					}
					catch (error) {

					}
				});

				if (duplicateName != -1) {
					message.channel.send(`The name is already used. Calling the function again.`);
					return request("https://randomuser.me/api/?results=1&nat=us", callback);
				}

				function getRandomInt(number) {
					return Math.floor(Math.random() * Math.floor(number));
				}

				const rarityNumber = getRandomInt(100);

				if (rarityNumber > 94 && rarityNumber < 100) {
					rarity = "legendary";
					incomeCoefficient = 2;
				}
				else if (rarityNumber > 84 && rarityNumber < 95) {
					rarity = "rare";
					incomeCoefficient = 1.5;
				}
				else if (rarityNumber > 69 && rarityNumber < 85) {
					rarity = "uncommon";
					incomeCoefficient = 1.25;
				}
				else {
					rarity = "common";
					incomeCoefficient = 1;
				}

				client.tower.push(key, {
					id: delka + 1,
					name: nameUp,
					last: lastUp,
					cost: cost,
					rarity: rarity,
					incomeCoefficient: incomeCoefficient
				}, "unhiredEmployees");
				points = points - cost;
				client.points.set(key, points, "points");

				discordMessage += `\:construction_worker: **__You've just hired a new employee__** \:construction_worker:

**Name:** ${nameUp} ${lastUp}
**Gender:** ${genderUp}
**Rarity:** ${rarity}
			
Assign your new employee to a floor \`.tower assign ${nameUp} ${lastUp} {floor ID}.\``;
				message.channel.send(discordMessage);
			}

			request("https://randomuser.me/api/?results=1&nat=us", callback);
		}
	} else if (first == "assign") {
		const name = second;
		const last = third;
		const level = fourth
		let delka = client.tower.get(key, "tower").length;
		let delka2 = client.tower.get(key, "unhiredEmployees").length;
		let validEmployee = 0;
		let validLevel = 0;
		let employeeAlreadyEmployed = 0;
		let levelOccupied = 0;
		let noEmployeesHired = 0;
		let levelNotBuilt = 0;
		const employee = client.tower.get(key, "unhiredEmployees").findIndex(i => i.name == name && i.last == last) + 1;

		if (level > 0 && level % 1 == 0) {

			for (let i = 0; i < client.tower.get(key, "unhiredEmployees").length; i++) {
				if (name == client.tower.get(key, `unhiredEmployees[${i}].name`) && last == client.tower.get(key, `unhiredEmployees[${i}].last`)) {
					validEmployee = 1;
				}
			}
			for (let i = 0; i < client.tower.get(key, `tower`).length; i++) {
				if (level == client.tower.get(key, `tower[${i}].level`)) {
					validLevel = 1;
				}
			}

			for (let i = 0; i < client.tower.get(key, `tower`).length; i++) {
				const aaa = client.tower.get(key, `tower[${i}].employee.id`);
				if (employee == client.tower.get(key, `tower[${i}].employee.id`)) {
					employeeAlreadyEmployed = 1;
				}
			}

			if (client.tower.get(key, "unhiredEmployees").length == 0) {
				noEmployeesHired = 1;
			}

			if (client.tower.get(key, `tower[${level - 1}].employee.id`) != null) {
				//console.log("patro obsazeno");
				levelOccupied = 1
			} else {
				//console.log("patro neobsazeno");
				//console.log(client.tower.get(key, `tower[${level - 1}].employee.id`));
			}

			if (noEmployeesHired == 1) {
				message.channel.send(`You don't have a hired employee.`)
			}

			if (Date.now() < client.tower.get(key, `tower[${level - 1}].builtAt`)) {
				levelNotBuilt = 1;
			}

			if (validEmployee == 0) {
				message.channel.send(`This employee doesn't exist.`);
			} else if (validLevel == 0) {
				message.channel.send(`This floor doesn't exist.`);
			} else if (employeeAlreadyEmployed == 1) {
				message.channel.send(`This employee already works on another floor.`);
			} else if (levelOccupied == 1) {
				message.channel.send(`There is already hired an employee on this floor.`)
			} else {
				client.tower.set(key, {
					id: parseInt(delka2),
					name: client.tower.get(key, `unhiredEmployees[${delka2 - 1}].name`),
					last: client.tower.get(key, `unhiredEmployees[${delka2 - 1}].last`),
					cost: client.tower.get(key, `unhiredEmployees[${delka2 - 1}].cost`),
					rarity: client.tower.get(key, `unhiredEmployees[${delka2 - 1}].rarity`),
					incomeCoefficient: client.tower.get(key, `unhiredEmployees[${delka2 - 1}].incomeCoefficient`)
				}, `tower[${level - 1}].employee`);
				message.channel.send(`An employee **${name} ${last}** was assigned to the **${level}.** floor.
In order to have your tower generating income, it must be stocked \`.tower restock\`.`);
			}

		} else {
			message.channel.send(`You have entered a wrong number.`)
		}



	} else if (first == "restock") {
		let cumulativeIncome = 0;
		let tax = 0;
		let incomeAfterThreeHours = 0;
		const array = client.tower.get(key, "tower").length;
		let wasRestocked = [];
		let incomePerLevel = 0;
		let cantBeRestockedNoMoney = [];
		let stillStocked = [];
		let levelCollected = [];
		let levelNotBuiltMessage = [];
		let noEmployeeAssigned = [];
		let notEnoughMoney = [];
		let restockTime = [];
		let intervalEnabled = 0;

		for (let i = 0; i < array; i++) {
			if (Date.now() > client.tower.get(key, `tower[${i}].builtAt`) && Date.now() > client.tower.get(key, `tower[${i}].restock`) && client.tower.get(key, `tower[${i}].restock`) != "new") {
				incomePerLevel = Math.round(client.tower.get(key, `tower[${i}].level`) * client.tower.get(key, `tower[${i}].employee.incomeCoefficient`));
				incomeAfterThreeHours = incomePerLevel * 3;
				cumulativeIncome = cumulativeIncome + incomeAfterThreeHours;
				points = points + incomeAfterThreeHours;
				client.points.set(key, points, "points");
				levelCollected.push(client.tower.get(key, `tower[${i}].level`));
			}
		}

		for (let i = 0; i < array; i++) {
			if (Date.now() < client.tower.get(key, `tower[${i}].restock`)) {
				stillStocked.push(client.tower.get(key, `tower[${i}].level`));
			}
			else if (Date.now() < client.tower.get(key, `tower[${i}].builtAt`)) {
				levelNotBuiltMessage.push(client.tower.get(key, `tower[${i}].level`));
			}
			else if (client.tower.get(key, `tower[${i}].employee.id`) == null) {
				noEmployeeAssigned.push(client.tower.get(key, `tower[${i}].level`));
			}
			/*else if (tax > points) {
				notEnoughMoney.push(client.tower.get(key, `tower[${i}].level`));
			}*/
			else {
				if (client.tower.get(key, `tower[0].restock`) == "new") {
					tax = 0;
					//discordMessage += `\nPatro **1** bylo zasobeno.`;
				}
				else {
					tax = client.tower.get(key, `tower[${i}].level`) * 2;
				}

				if (tax > points) {
					//cantBeRestockedNoMoney.push(client.tower.get(key, `tower[${i}].level`));
					//client.tower.set(key, 0, `tower[${cantBeRestockedNoMoney[i] - 1}].wasRestocked`);
					notEnoughMoney.push(client.tower.get(key, `tower[${i}].level`));
				}
				else {
					points = points - tax;
					client.points.set(key, points, "points");
					wasRestocked.push(client.tower.get(key, `tower[${i}].level`));
					const datetime2 = new Date();
					let datetimeAddThreeHours;

					if (testEnv == false) {
						datetimeAddThreeHours = datetime2.setHours(datetime2.getHours() + 3);
					}
					else {
						datetimeAddThreeHours = datetime2.setMinutes(datetime2.getMinutes() + 3);
					}

					client.tower.set(key, datetimeAddThreeHours, `tower[${i}].restock`);
					//client.tower.set(key, 1, `tower[${i}].wasRestocked`);
					intervalEnabled = 1;
				}
			}
		}

		if (notEnoughMoney.length == 1) {
			discordMessage = discordMessage + `\nThe **${notEnoughMoney[0]}** floor was not stocked because you don't have enough coins.`;
		} else if (notEnoughMoney.length > 1) {
			discordMessage = discordMessage + `\nThe **${notEnoughMoney[0]}**-**${notEnoughMoney[notEnoughMoney.length - 1]}** floors were not stocked because you don't have enough coins.`;
		}

		if (levelNotBuiltMessage.length == 1) {
			discordMessage = discordMessage + `\nThe **${levelNotBuiltMessage[0]}** floor has 0 income and was not stocked because it hasn't been built yet.`;
		} else if (levelNotBuiltMessage.length > 1) {
			discordMessage = discordMessage + `\nThe **${levelNotBuiltMessage[0]}**-**${levelNotBuiltMessage[levelNotBuiltMessage.length - 1]}** floors have 0 income and were not stocked because it hasn't been built yet.`;
		}

		if (noEmployeeAssigned.length == 1) {
			discordMessage = discordMessage + `\nThe **${noEmployeeAssigned[0]}** has 0 income and was not stocked because there is no empoyee assigned.`;
		} else if (noEmployeeAssigned.length > 1) {
			discordMessage = discordMessage + `\nThe **${noEmployeeAssigned[0]}**-**${noEmployeeAssigned[noEmployeeAssigned.length - 1]}** have 0 income and were not stocked because there is no empoyee assigned.`;
		}

		if (levelCollected.length == 1) {
			discordMessage = discordMessage + `\nThe **${levelCollected[0]}** floor has had their earnings collected.`;
		} else if (levelCollected.length > 1) {
			discordMessage = discordMessage + `\nPatro **${levelCollected[0]}**-**${levelCollected[levelCollected.length - 1]}** floors have had their earnings collected.`;
		}

		if (wasRestocked.length == 1) {
			discordMessage = discordMessage + `\nThe **${wasRestocked[0]}** floor was restocked.`;
		} else if (wasRestocked.length > 1) {
			discordMessage = discordMessage + `\nThe **${wasRestocked[0]}**-**${wasRestocked[wasRestocked.length - 1]}** floors were restocked.`;
		}

		if (stillStocked.length == 1) {
			discordMessage = discordMessage + `\nThe **${stillStocked[0]}** is still stocked.`;
		} else if (stillStocked.length > 1) {
			discordMessage = discordMessage + `\nThe **${stillStocked[0]}**-**${stillStocked[stillStocked.length - 1]}** is still stocked.`;
		}

		discordMessage += `\n\n\:money_with_wings: **Your employees earned \`${cumulativeIncome}\` Kc. You have \`${points}\` Kc.**`;

		for (let i = 0; i < array; i++) {
			if (client.tower.get(key, `tower[${i}].restock]`) != "new" && client.tower.get(key, `tower[${i}].restock]`) > Date.now()) {
				restockTime.push(client.tower.get(key, `tower[${i}].restock]`));
			}
		}

		let countdown = Math.min(...restockTime);
		const interval = countdown - new Date().getTime();
		const hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((interval % (1000 * 60)) / 1000);

		if (restockTime.length > 0) {
			discordMessage += `\n:\alarm_clock: **Don't forget to restock your tower in \`${hours}\` h, \`${minutes}\` min and \`${seconds}\` s.**`;

			if (intervalEnabled == 1) {
				setTimeout(() => message.channel.send(`${message.author.username}, you can now restock your tower.`), interval);
			}

		} else {
			discordMessage += `\n**Resolve the problems written above and restock your tower again.**`;
		}

		message.channel.send(discordMessage);
	} else if (first == "reset") {
		if (message.author.id == 135385664454787072) {
			const user = message.mentions.users.first();
			//const key = `${message.guild.id}-${user.id}`;
			client.tower.delete(key);
		} else {
			message.channel.send(`You are not an admin ${kacenka_emoji}`);
		}
	}
	else if (first == "floors") {
		discordMessage += `**__Tower floors__**\n`;
		//let hiredEmployee;
		let page = second;

		if (page == null) {
			page = 1;
		}

		let lastPage = page * 10;
		let firstPage = lastPage - 10;

		for (let i = firstPage; i < lastPage; i++) {
			let countdown = client.tower.get(key, `tower[${i}].restock`);
			let interval = countdown - new Date().getTime();
			let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((interval % (1000 * 60)) / 1000);
			try {
				//hiredEmployee = client.tower.get(key, "tower").findIndex(emp => emp.employee.id == client.tower.get(key, `unhiredEmployees[${i}].id`));
				//console.log(hiredEmployee);
				if (Date.now() < client.tower.get(key, `tower[${i}].builtAt`)) {
					discordMessage += `\n__The **#${client.tower.get(key, `tower[${i}].level`)}** floor__ - restock price: **${client.tower.get(key, `tower[${i}].level`) * 2}** Kc, **floor is not built yet** `;
				}
				else if (client.tower.get(key, `tower[${i}].level`)) {
					discordMessage += `\n__The **#${client.tower.get(key, `tower[${i}].level`)}** floor__ - income: **${client.tower.get(key, `tower[${i}].level`)}x${client.tower.get(key, `tower[${i}].employee.incomeCoefficient`)}**=**${Math.round(client.tower.get(key, `tower[${i}].level`) * client.tower.get(key, `tower[${i}].employee.incomeCoefficient`))}** Kc/h., restock price: **${client.tower.get(key, `tower[${i}].level`) * 2}** Kc, **restock in \`${hours}\` h, \`${minutes}\` min and \`${seconds}\` s** `;
				}
				else {
					//discordMessage += `\n${client.tower.get(key, `tower[${i}].level`)}`;
				}
				
			}
			catch (e) {
				/*if (client.tower.get(key, `unhiredEmployees[${i}].id`) == undefined) {
					break;
				}
				discordMessage += `\nThe employee **${client.tower.get(key, `unhiredEmployees[${i}].name`)} ${client.tower.get(key, `unhiredEmployees[${i}].last`)}** is not working on **any** floor.`;
			*/}
		}

		const paginationLast = Math.ceil(client.tower.get(key, `tower`).length/10);
		discordMessage += `**\n\nPage ${page}/${paginationLast}**`;
		message.channel.send(discordMessage);
	}
	else if (first == "employees") {
		discordMessage += `**__Tower employees__**\n`;
		//let hiredEmployee;
		let page = second;

		if (page == null) {
			page = 1;
		}

		let lastPage = page * 10;
		let firstPage = lastPage - 10;

		for (let i = firstPage; i < lastPage; i++) {
			try {
				//hiredEmployee = client.tower.get(key, "tower").findIndex(emp => emp.employee.id == client.tower.get(key, `unhiredEmployees[${i}].id`));
				//console.log(hiredEmployee);
				if (client.tower.get(key, `tower[${i}].employee.name`)) {
					discordMessage += `\n**${client.tower.get(key, `tower[${i}].employee.name`)} ${client.tower.get(key, `tower[${i}].employee.last`)}** (\`${client.tower.get(key, `tower[${i}].employee.rarity`)}\`) is assigned to the **${client.tower.get(key, `tower[${i}].level`)}.** floor.`;
				}
				else {
					//discordMessage += `\n**${client.tower.get(key, `unhiredEmployees[${i}].name`)} ${client.tower.get(key, `unhiredEmployees[${i}].last`)}** (\`${client.tower.get(key, `tower[${i}].employee.rarity`)}\`) isn't assigned to **any** floor.`;
				}
				
			}
			catch (e) {
				if (client.tower.get(key, `unhiredEmployees[${i}].id`) == undefined) {
					break;
				}
				discordMessage += `\nThe employee **${client.tower.get(key, `unhiredEmployees[${i}].name`)} ${client.tower.get(key, `unhiredEmployees[${i}].last`)}** is not working on **any** floor.`;
			}
		}

		const paginationLast = Math.ceil(client.tower.get(key, `unhiredEmployees`).length/10);
		discordMessage += `**\n\nPage ${page}/${paginationLast}**`;
		message.channel.send(discordMessage);
	}
	else if (first == "close") {
		if (message.author.id == 135385664454787072) {
			client.tower.close();
			client.points.close();
			process.exit(0);
		} else {
			message.channel.send(`You're not an admin`);
		}
	}
	else if (first == "swap") {
		const name1 = second;
		const surname1 = third;
		const name2 = fourth;
		const surname2 = fifth;

		const findEmployee1 = client.tower.get(key, `tower`).findIndex(emp => {
			return emp.employee.name == name1 && emp.employee.last == surname1;
		});
		const findEmployee2 = client.tower.get(key, `tower`).findIndex(emp => {
			return emp.employee.name == name2 && emp.employee.last == surname2;
		});

		if (Date.now() < client.tower.get(key, `tower[${findEmployee1}].restock`) || Date.now() < client.tower.get(key, `tower[${findEmployee2}].restock`)) {
			discordMessage += `The employees can't be swapped since the floor is still in construction.`;
		}
		else {
			const employee1 = client.tower.get(key, `tower[${findEmployee1}].employee`);
			const employee2 = client.tower.get(key, `tower[${findEmployee2}].employee`);
	
			client.tower.set(key, employee2, `tower[${findEmployee1}].employee`);
			client.tower.set(key, employee1, `tower[${findEmployee2}].employee`);

			discordMessage += `The employees were swapped.`;
		}
		message.channel.send(discordMessage);		
	}

	console.log(client.tower.get(key));
}