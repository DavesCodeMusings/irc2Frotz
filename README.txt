irc2Frotz -- Play interactive fiction over an IRC channel.

irc2Frotz.js is a short little program that acts as an IRC client while
getting it's input and output from an interactive fiction z-machine like
Frotz. The result is anything typed in the IRC channel is interpreted as
an action in the interactive fiction story.

When starting a game from command-line with the supplied shell script:
irc2Frotz$ ./startgame Suburbia.z8

In your IRC client, on channel #Suburbia, you will see: 

Suburbia:   To Live and Die in Suburbia
Suburbia:   An Interactive Fiction by David Horton
Suburbia:   Release 1 / Serial number 200712 / Inform 7 build 6M62 (I6/v6.33 lib 6/12N)
Suburbia: .
Suburbia:   Sidewalk
Suburbia:   You are standing on the Sidewalk between a two-story, post World War II red
Suburbia:   brick bungalow with a nicely manicured front lawn, and a Quiet Neighborhood
Suburbia:   Street. Tall oaks cast dappled shadows all around, and the birds are
Suburbia:   exchanging pleasantries through song. There is a man standing on his front
Suburbia:   porch. He is not smiling.
Suburbia: > >
Dave: go south
Suburbia:    Quiet Neighborhood Street
Suburbia: .
Suburbia:   Quiet Neighborhood Street
Suburbia:   You're standing in the middle of the street. Probably not the safest place
Suburbia:   to be, despite the lack of traffic at the moment.
Suburbia: > > 

The idea is to allow multiple people to share in what would typically be a
single-player adventure.

If this sounds even remotely interesting, read on...

*** You'll need the Node.js package for your OS.
This should not be difficult. Node.js is popular enough that it should be
available as a pre-compiled package.

For FreeBSD, the command is: pkg install node

*** You'll need access to an IRC server on your LAN.
Refer to your operating system's pacakage management tool for details on
setting one up. If you happen to run FreeBSD, see the venerable SDF website
wiki at: https://wiki.sdf.org/doku.php?id=installing_irc_at_home

*** You'll need a Z-Machine.
This is the tricky part, because it has to be a z-machine capable of outputing
to a dumb terminal. For this, I used dfrotz on FreeBSD. dfrotz is "dumb Frotz"
a version of Frotz tailored to dumb terminals. Unfortunately, dfrotz is not
included in the FreeBSD package for Frotz. This means compiling from source.

It's not terribly difficult, but you will need the git client and developer
tools for C programs installed as prerequisites.

Here's the commands needed for FreeBSD:
1. git https://github.com/DavidGriffith/frotz.git
2. cd frotz
3. gmake dfrotz
4. su
5. cp dfrotz /usr/local/bin

Compiling for Linux and other Unix-like OS should be similar. Replace gmake
with make on GNU/Linux systems and use sudo instead of su.

Congratulations, it gets much easier from here on out.

*** You'll need a story file.
Unless you want to play my short little sample game, you'll need to download
an interactive fiction game in the z-machine format. Old Infocom Zork games
are available from: http://infocom-if.org/downloads/downloads.html and plenty
more can be found at: https://www.ifarchive.org/

In this exampe, we'll use the classic Zork I from infocom-if.org.
1. Open the zip file and extract ZORK1.DAT.
2. Copy ZORK1.DAT into the same directory as irc2Frotz.js
3. Run with the command "node irc2Frotz.js ZORK1.DAT"

If all goes well, you'll see the following output:
Using z-machine file: ZORK1.DAT
Connecting to IRC server.
Registering the #ZORK1 channel.

*** You'll need an IRC client.
There are many choices for IRC clients. The previously mentioned SDF wiki
page gives examples for setting up Pidgin and Thunderbird. Hexchat is another
popular option.

Once you have the client set up to attach to your IRC server, join the #<game>
channel. The actual name of the channel is the story file minus the extension.
So running Game.z8 creates a channel called #Game. This way you can easily
run multiple games, each on its own channel, named after its z-file.

Anytime someone new joins, irc2Frotz.js will automatically issue the "look"
command to dfrotz so new players can get their bearings.

*** You may need to adjust fakelag on your IRC server.
IRC servers sometimes have a feature to slow down the output of any user who
is sending mass content. The replies from dfrotz invariably run up against
this rule. If you see responses suddenly slow to a crawl, check your IRC
configuration for fakelag. In inspirc.conf it's a setting called commandrate.

*** Keeping irc2Frotz running.
There is a shell script called startgame that will take the name of a z-file
and do all the work of firing it up, putting it in the background, and sending
log messages to a similarly named file (the z-file name with a .log extension.)

The manual equivalent is "node irc2Frotz.js ZORK1.DAT > ZORK1.DAT.log &

*** In case things go badly.
irc2Frotz.js has a setting for debug. Normally, it is set to false and output
is minimal. Set it to true and conversations between irc2Frotz and the IRC
server are disected and logged on the console.

If you're having trouble with games not starting, check the log file output.
A successful startup will look like this:

Connecting to IRC server localhost:6667...
Connected.
Registering nickname Suburbia.
Registering channel #Suburbia.
Starting z-machine /usr/local/bin/dfrotz Suburbia.z8.

If there are errors:
* Make sure the game file exists.
* Try running the game using dfrotz on the command-line.
* Check the IRC server logs. Many servers limit the max. number of connections.

*** Making it stop.
If a player dies or otherwise quits the game, irc2Frotz will leave the channel.
This is normal behavior. You can also end the game by killing its process ID.
To get a listing of PIDs on Unix-like OS, run the lsgames shell script.

It will output a list of games, like this:
irc2Frotz$ ./lsgames
EventHorizon.z8 (64710)
Suburbia.z8 (64734)

The PID is in parentheses. Just copy and paste to kill it.

*** Some interesting, possibly helpful, features of irc2Frotz.
Messages can be exchanged between players when they are prefaced by "/me".
For example: Dave types: "/me So humid!" and irc2Frotz sends the message
"Dave So humid!" to all players in the channel, but not to the z-machine
interpreter.

/me is a standard IRC feature called an "Action". All actions are blocked
from reaching the z-machine. This way, players can interact without getting
replies from the z-machine like "I don't know the word 'So.'"


Congratulations on getting everything installed and happy group adventuring!
