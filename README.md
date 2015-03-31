#Beanstalk Dashboard for Chrome

A Chrome packaged app that aims to provide a GUI dashboard for [beanstalkd](https://kr.github.io/beanstalkd/)

![Screenshot](https://raw.githubusercontent.com/pascalopitz/beanstalk-dashboard-for-chrome/master/img/screenshot.png)

##Features

* [x] Show all tubes
* [x] Show tube details
* [x] Empty tube
* [x] Pause tube
* [ ] Batch kick jobs
* [x] Peek ready, buried, delayed
* [ ] Kick job
* [ ] Delete job
* [ ] Bury job

##Install and Run

You will need node.js for this.

First, initialize the project:

	npm install

Second, build the compiled files into the js folder:

	npm run-script compile

Third, add the app in the extensions tab of chrome, via "Load unpacked extension". Select the project folder.
You will need to check the developer mode check box in order to be able to do that.
Now you should be able to run the app, and inspect console messages coming through via the window inspector.

For development, you can run the watch task, which will re-compile on change:

	npm run-script watch

##Credits

Icon by [Lorc](http://game-icons.net/lorc/originals/beanstalk.html), changed color.