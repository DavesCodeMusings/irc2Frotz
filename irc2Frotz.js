/**
 * ircFrotz -- Open an IRC channel and pipe input/output to Frotz.
 * @author David Horton https://github.com/DavesCodeMusings
 */
const net = require('net');
const path = require('path');
const childProcess = require('child_process');
const { on } = require('process');

// Change the host and port number based on your IRC server. 
const ircHost = "localhost";
const ircPort = 6667;

// Change based on your z-machine setup.
const zMachinePath = '/usr/local/bin/dfrotz';

// Generate a lot of extra output with debug on.
const debug = false;
function debugLog(output) {
  if (debug) console.log(output);
}

// Read command-line to see what game we're playing. Default to the included sample.
var zFilePath = 'Suburbia.z8';
var ircChannel = "#irc2Frotz";
var ircNickname = "SampleGame";
if (process.argv.length > 2) {
  zFilePath = process.argv[2];
  ircNickname = path.basename(zFilePath, path.extname(zFilePath));
  ircChannel = '#' + ircNickname;
}

// To be used later when creating the child process.
var zMachine;

// Create a client connection to the IRC server and log in.
const ircClient = net.createConnection(ircPort, ircHost, () => {
  console.log(`Connecting to IRC server ${ircHost}:${ircPort}...`);
});
ircClient.on('connect', () => {
  console.log('Connected.');
  console.log(`Registering nickname ${ircNickname}.`);
  ircClient.write(`NICK ${ircNickname}\r\n`);
  ircClient.write('USER zmachine 0 * Z-Machine Interpreter\r\n');
});
ircClient.on('error', (err) => {
  console.log(`IRC client error: ${err}. Review the IRC server log for more specific information.`);
});
ircClient.on('data', (data) => {
  
  // Split the input buffer into lines of text. 
  let messageLines = data.toString().split("\r\n");

  // Examine each line for [:prefix] <response> <params>
  messageLines.forEach(line => {
    if (line.length > 0) {
      debugLog(line);
      let prefix = '';
      let response = '';
      let params = '';
      let endOfPrefix = -1;

      // The prefix is optional. If it's there, it starts with a colon.
      if (line.charAt(0) == ':') {
        endOfPrefix = line.indexOf(' ');
        prefix = line.slice(0, endOfPrefix);
      }
      debugLog(`  Prefix is...   '${prefix}'`);

      // The Server Response comes after the prefix and can be 3-digit numeric or variable-
      // length alpha. The end of the response is delimited by a space character.
      let endOfResponse = line.indexOf(' ', endOfPrefix + 1);
      response = line.slice(endOfPrefix + 1, endOfResponse);

      debugLog(`  Server said... '${response}'`);

      // Anything after the prefix and the command response is captured as parameters and
      // shown in console output, but is not acted upon by this program.
      params = line.slice(endOfResponse + 1);
      debugLog(`  With params... '${params}'`);

      // Compare server responses to decide what to do next.
      if (response == '004') {  // 001 - 004 are generated in sequence on successful registration.
        console.log(`Registering channel ${ircChannel}.`);
        ircClient.write(`JOIN ${ircChannel}\r\n`);
        ircClient.write(`TOPIC ${ircChannel} Interactive Fiction\r\n`);

        // Spawn the Interactive Fiction interpreter, passing text back and forth.
        console.log(`Starting z-machine ${zMachinePath} ${zFilePath}.`);
        zMachine = childProcess.spawn(zMachinePath, [zFilePath]);
        zMachine.on('error', (err) => {
          console.log(`Z-machine error: ${err}.`); 
          ircClient.end();
        });
        zMachine.stdout.on('data', (data) => {
          let stdoutLines = data.toString().split("\n");
          stdoutLines.forEach(line => {
            if (line.length > 0) {
              ircClient.write(`PRIVMSG ${ircChannel} :${line}\r\n`);
            }
          });
        });
        zMachine.stdin.on('error', () => {
          console.log(`Z-Machine  died.`);
          ircClient.end();
        });
      }
      else if (response == 'PING') {  // Keep the connection alive by responding to pings.
        debugLog(`PONG ${params}`);
        ircClient.write(`PONG ${params}\r\n`);
      }
      else if (response == 'JOIN') { // Welcome newcomers, while ignoring bot's nickname.
        if (!prefix.includes(ircNickname)) {
          console.log(`${prefix} joined the channel.`);
          ircClient.write(`PRIVMSG ${ircChannel} :Welcome new player ${prefix}.\r\n`);
          zMachine.stdin.write(`look\r\n`);
        }
      }
      else if (response == 'PRIVMSG') {  // Send any messages to dfrotz and reply with output.
        let command = params.slice(params.indexOf(':') + 1);
        // Filter out any ACTION (/me) commands. This allows players to chat without confusing Frotz.
        if (!command.includes('ACTION')) {
          zMachine.stdin.write(`${command}\r\n`);
          debugLog(`Sent '${command}' to z-machine.`);
        }
      }
    }
  });
});

// Keeps going until someone presses CTRL+C or kicks us from IRC.
ircClient.on('end', () => {
  console.log('Disconnected from server.');
});
