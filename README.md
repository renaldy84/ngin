# ngin.js

Extendable node.js application server with plugin support and easy configuration.

## What is ngin.js?
Its very simple and minimalistic application server. Main target audience are node.js developers, which look for the simple server
solution for developer machines and testing servers and don't want to build everything ourselves or install complex solutions, which
could be found online. For now best use case is to run multiple node.js http servers within simple manageable app.

To be able to use your applications, you need to maintain your <code>package.json</code> file, which contains all the necessary
information for ngin server and is the standard way how the node.js application and packages are described.

## Instalation

<pre>
  <code>git clone git://github.com/petrjanda/ngin.git
  cd ngin/
  npm install                              # Install necessary dependencies.
  mkdir apps/                              # You could make your apps directory wherever you want.
  ln -s /path/to/your/app apps/appname     # Simple symlink is enough to attach your app to server.
  bin/ngin --port 80 apps/                 # And here we go!</code>
</pre>

Your server will spawn each application and proxy will take care of the proper routing. Once DNS plugin is done, you can use proxy + dns together to setup super easy development server, where you can access your apps like <code>http://appname.dev</code>.

## Bundled plugins

### NPM
Most of the node.js application need additional libraries then ones provided by node.js core. Node package manager is the easy way how to manage them. To let ngin.js do even more work for you just list them properly in your package.json file and server will take care all deps are on the place before your app is started.

### HTTP proxy
HTTP proxy sits on the defined port to bypass requests to applications running on ngin.js server. To get it working only thing you need to specify is list of domain - application pairs, which you want to use for routing.

### Logger
If you are interested to know, what is happening inside your server, just plugin the Logger and you will know.

## More plugins to come

### DNS
The plugin targets mostly developers which would like to use ngin.js without having domain names for each app. You will be able to specify some easy pattern and then access you app easily. Lets say you are working on helloworld app, you can have it accesible by http://helloworld.dev. No need for ports or modifications to your hosts file. @WIP.

### Restarter
The main target of ngin.js is to sit on developer machines or testing servers atm. You will deploy lot of new releases to that server and mostly you will need to restart your app once new version is delivered. The Restarted plugin will take care about that. @TBA.

### Git integration
Easy deployment with git commands. @TBA.

## License

(The MIT License) Copyright © 2011 Petr Janda, CTT Innovations

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.