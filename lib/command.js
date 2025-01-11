const commands = [];

function cmd(info, func) {
    const commandData = { ...info, function: func, dontAddCommandList: false };
    commands.push(commandData);
    return commandData;
}

module.exports = { cmd, commands };
