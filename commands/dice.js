const Discord = require("discord.js");

module.exports.run = (bot, message, args) => roll(bot, message, args);
const roll = (bot, message, args) => {
    if (args.lenght > 2) {
        return message.channel.send("Incorect number of arguments.");
    } else if (args.length == 0) {
        return roll(bot, message, ["D6"]);
    }

    results = parse(args[0])
    if (!(Array.isArray(results))) {
        return message.channel.send(results)
    }

    let rollCount
    if (args.length == 1) {
        rollCount = 1
    } else {
        for (let i = 0; i < args[1].length; i++) {
            if (!("0" <= args[1][i] && args[1][i] <= "9")) {
                return message.channel.send("Argument 2 is not a number")
            }
        }
        rollCount = parseInt(args[1])
    }

    let rolls = []
    for (i = 0; i < rollCount; i++) {
        rolls.push(diceRoll(results[0], results[1], results[2]).toString())
    }

    return message.channel.send(`🎲 Result of ${message.author}'s lucky roll${(rollCount == 1) ? " was" : "s were"} ${rolls.join(", ")}! 🎲`)

}
function parse(dieCode) {
    let usage = "Proper usage: `[number of dice]D[sides of dice]±[additive constant] [number of dice rolls]` like `2D6+3 2`"

    let numberOfDice = ""; // parsing number of dice
    let i = 0;
    while ("0" <= dieCode[i] && dieCode[i] <= "9") {
        numberOfDice += dieCode[i];
        i++;
    }

    if (parseInt(numberOfDice) == 0) {
        return "What the heck are you doing?!"; // rolling 0 dice
    }

    numberOfDice = parseInt(numberOfDice) || 1;

    if (dieCode[i] != "D") {
        return usage // char then D
    }
    i++;

    if (dieCode.length == i) {
        return usage // no number of sides
    }

    let sidesOfDice = "" // parsing number of sides

    if (dieCode[i] == "+" || dieCode[i] == "-") {
        sidesOfDice += dieCode[i]
        i++;
    }
    while ("0" <= dieCode[i] && dieCode[i] <= "9") {
        sidesOfDice += dieCode[i];
        i++;
    }

    if (parseInt(sidesOfDice) <= 0) {
        return "What the heck are you doing?!"; // non-existing die
    } else if (isNaN(parseInt(sidesOfDice))) {
        return usage // wierd characters
    }
    sidesOfDice = parseInt(sidesOfDice);

    if (dieCode.length == i) {
        return [numberOfDice, sidesOfDice, 0]; // no additive constant
    }

    let additiveConstant = "" // parsing additive constant
    if (dieCode[i] == "+" || dieCode[i] == "-") {
        additiveConstant = dieCode[i];
        i++;
        if (dieCode.length == i) {
            return usage; // no additive constant adter + or -
        }
    } else {
        return usage; // something at the end
    }

    while ("0" <= dieCode[i] && dieCode[i] <= "9") {
        additiveConstant += dieCode[i];
        i++;
    }
    additiveConstant = parseInt(additiveConstant);

    if (dieCode.length == i) {
        return [numberOfDice, sidesOfDice, additiveConstant];
    } else {
        return usage; // something at the end
    }

}


function diceRoll(number, sides, constant) {
    let result = constant;
    for (let i = 0; i < number; i++) {
        result += (Math.round(Math.random() * (sides - 1))) + 1
    }
    return result
}

module.exports.help = {
    name: "dice",
    help: "rolls a die"
}