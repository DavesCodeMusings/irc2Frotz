irc2Frotz -- Play interactive fiction over an IRC channel.

irc2Frotz.js is a short little program that acts as an IRC client while
getting it's input and output from an interactive fiction z-machine like
Frotz. The result is anything typed in the IRC channel is interpreted as
an action in the interactive fiction story.

Example of signing into the default #game channel and running the command
"node irc2Frotz.js sample.z8"

GameMaster:   To Live and Die in Suburbia
GameMaster:   An Interactive Fiction by David Horton
GameMaster:   Release 1 / Serial number 200712 / Inform 7 build 6M62 (I6/v6.33 lib 6/12N)
GameMaster: .
GameMaster:   Sidewalk
GameMaster:   You are standing on the Sidewalk between a two-story, post World War II red
GameMaster:   brick bungalow with a nicely manicured front lawn, and a Quiet Neighborhood
GameMaster:   Street. Tall oaks cast dappled shadows all around, and the birds are
GameMaster:   exchanging pleasantries through song. There is a man standing on his front
GameMaster:   porch. He is not smiling.
GameMaster: > >
Dave: go south
GameMaster:    Quiet Neighborhood Street
GameMaster: .
GameMaster:   Quiet Neighborhood Street
GameMaster:   You're standing in the middle of the street. Probably not the safest place
GameMaster:   to be, despite the lack of traffic at the moment.
GameMaster: > > 

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
tools for C programs installed.

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
Unless you want to play the short little sample game, you'll need to download
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
Registering the #game channel.

*** You'll need an IRC client.
There are many choices for IRC clients. The previously mentioned SDF wiki
page gives examples for setting up Pidgin and Thunderbird. Hexchat is another
popular option.

Once oyu have the client set up to attach to your IRC server, join the #game
channel. Anytime someone new joins, irc2Frotz.js will issue the "look" command
to dfrotz so new players can get their bearings.

*** You may need to adjust fakelag on your IRC server.
IRC servers sometimes have a feature to slow down the output of any user who
is sending mass content. The replies from dfrotz invariably run up against
this rule. If you see responses suddenly slow to a crawl, check your IRC
configuration for fakelag. In inspirc.conf it's called commandrate.

*** Keeping irc2Frotz running.
There is no provision within irc2Frotz.js to run as a daemon precess. The
usual methods of sending stdout to a file and putting it in the background
will work. For example: node irc2Frotz.js ZORK1.DAT > irc2Frotz.log &

*** In case things go badly.
irc2Frotz.js has a setting for debug. Normally, it is set to false and output
is minimal. Set it to true and conversations between irc2Frotz and the IRC
server are disected and logged on the console.

If a player dies or otherwise quits the game, irc2Frotz will leave the channel.
This is normal behavior.

Congratulations on getting everything installed and happy group adventuring!

*** Some interesting, possibly helpful, features of irc2Frotz.
Messages can be exchanged between players when they are prefaced by "/me".
For example: "/me So humid!" sends the message "Dave So humid!" to all players
in the channel, but does not send it to the z-machine interpreter.

/me is a standard IRC feature called an "Action". All actions are blocked from
reaching the z-machine interpreter. This way, you can talk to other players
without getting replies from the z-machine like "I don't know the word 'So.'"