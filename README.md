# Running a Parse Server on OpenShift

This code will get you up and running on [OpenShift](https://www.openshift.com/]) with the [Parse Server](https://github.com/ParsePlatform/parse-server).

## Steps to get running
Create an account at [http://openshift.redhat.com/](http://openshift.redhat.com/)

Create a namespace

    rhc domain create <yournamespace>

Create a nodejs application (you can name it anything via -a)

    rhc app create -a parseserver -t nodejs-0.10

Add the github nodejs-custom-version-openshift repository

    cd parseserver
    git remote add upstream -m master git://github.com/ramr/nodejs-custom-version-openshift.git
    git pull -s recursive -X theirs upstream master

Optionally, specify the custom version of Node.js you want to run with (Default is v4.2.3). If you want to more later version of Node (example v4.2.42), you can change to that by just writing it to the end of the NODEJS_VERSION file and committing that change.

    echo 4.2.42 >> .openshift/markers/NODEJS_VERSION
    #
    # Or alternatively, edit the .openshift/markers/NODEJS_VERSION file
    # in your favorite editor aka vi ;^)
    #
    # Note: 4.2.42 doesn't exist (as yet) and is a fictitious version
    #       mentioned here solely for demonstrative purposes.
    #
    git commit . -m 'use Node version 4.2.42'

Install the custom MongoDB cartridge. Remember, what comes after -a is what you named your application.

    rhc cartridge-add http://cartreflect-claytondev.rhcloud.com/github/icflorescu/openshift-cartridge-mongodb -a parseserver

Add your custom environment variables

    rhc env-set PARSE_APP_ID=whatever PARSE_MASTER_KEY=whatever -a parseserver

Then push to the OpenShift repo

    git push

Visit your app to make sure it's running

    http://parseserver-YOURNAMESPACE.rhcloud.com/

Test pushing data into your Parse database

    curl -X POST -H "X-Parse-Application-Id: YOUR_APP_ID" -H "Content-Type: application/json" -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' http://parseserver-YOURNAMESPACE.rhcloud.com/parse/classes/GameScore

Test getting your data back

    curl -X GET -H "X-Parse-Application-Id: YOUR_APP_ID" -H "X-Parse-Master-Key: YOUR_APP_MASTER_KEY" http://parseserver-YOURNAMESPACE.rhcloud.com/parse/classes/GameScore
