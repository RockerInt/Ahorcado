# AHORCADO

[Descripción]

Este es un Video-Juego Web del clasico juego de Ahorcado

[Instalación]

- Requisitos
- Versión
- Encargados del Proyecto

[Uso]

[Documentación]

[Roadmap]

[Licencia]


== Quickstarts

Servers used::
* localhost

Tools used::
* rhc
* git

A key tenet when Red Hat was designing OpenShift Origin was the ability for developers to be able to run their source code and application as is, without having to use proprietary API(s). To illustrate how easy it is for developers to get their existing application deployed on OpenShift Origin, the team has created a github space where they provide numerous quick start projects that make deploying common open source applications to the platform a painless task. Some of the popular open source projects the team provides a quick start for are:

* Drupal
* Review Board
* Wordpress
* Frog CMS
* Sugar CRM
* Redmine
* MediaWiki

=== Quickstart Installation
Point your browser to the following URL:

----
http://www.github.com/openshift
----

Given the number of available quick starts, you may have to use the search functionality of your browser to locate the quick start that you would like to install. For this example walkthrough, choose either the Wordpress or Drupal quick start and follow the instructions provided to install the application.

image:quickstart.png[image]

== Quickstart Creation

Servers used::
* localhost
* node host

Tools used::
* rhc
* git
* github

A common task that you will be asked to do is make a software developer's development environment easily deployable on OpenShift Origin. Development teams desire a quick and repeatable way to spin up an environment with their application code already deployed and integrated with various data stores. In the previous chapter, we described how to install applications via our quick start process. In this chapter, we will focus on the ability for users to create their own quick starts using the popular open source project Piwik as an example.

=== Download the Piwik Source Code
At the time of this writing, you can obtain the code directly from the Piwik website at: http://piwik.org/latest.zip. Once downloaded, save the file to _~/code/piwikstage_.

After you have downloaded the source code, extract the contents of the zip archive with the following command:

----
$ cd ~
$ mkdir code
$ mkdir piwikstage
$ unzip latest.zip
----

This will create a piwik directory under the ~/code/piwikstage directory.

=== Create an OpenShift Origin Application
We need to create an OpenShift Origin application to hold the source code as well as embed the MySQL database:

----
 $ cd ~/code
$ rhc app create-a piwik -t php
$ rhc cartridge add -a piwik -c mysql-5.5
----

OpenShift Origin, as you know, creates a default _index_ file for your application. Because we are going to be using the source code from our Piwik application, we need to remove the existing template.

----
$ rm -rf ~/code/piwik/php/*
----

At this point, we need to copy over the source code that we extracted from the zip archive to our _piwik_ OpenShift Origin application:

----
$ cp -av ~/code/piwikstage/piwik/* ~/code/piwik/php
----

Now we need to add and commit our changes to our _piwik_ application:

----
$ cd ~/code/piwik/php
$ git add .
$ git commit -am "Initial commit for Piwik"
$ git push
----

Assuming everything went as expected, you should be able to verify Piwik is running by opening up your web browser and pointing to the following URL:

----
http://piwik-<yourdomain>.example.com
----

image:piwik.png[image]

=== Creating a github Repository
NOTE: This step assumes that you already have a github account. If you don't, head on over to www.github.com and sign up (it's free).

Log in to the github website and create a new repository for our quick start. The direct link, after you are logged in, to create a new repository is:

----
https://github.com/repositories/new

----

Enter a project name and a description for your quick start. I suggest a name that identifies the project as a OpenShift Origin quick start. For example, a good name would be _Piwik-openshift-quickstart_.

image:piwik2.png[image]

On your newly created project space, grab the HTTP Git URL and add the github repository as a remote to your existing _piwik_ OpenShift Origin application.

image:piwik3.png[image]

----
$ cd ~/code/piwik
$ git remote add github ${github http URL from github}
----

=== Create Deployment Instructions
In order for developers to be able to use the quick start that you have created, you need to provide instructions on how to install the application. These instructions need to be in the _README_ and _README.md_ files. By default, github will display the contents of this file, using the markdown version if it exits, on the repository page. For example, a proper README file would contain the following contents:

----
Piwik on OpenShift
=========================
Piwik is a downloadable, open source (GPL licensed) real time web analytics software program. It provides you with detailed reports on your website visitors: the search engines and keywords they used, the language they speak, your popular pages, and so much more.

Piwik aims to be an open source alternative to Google Analytics, and is already used on more than 150,000 websites.

More information can be found on the official Piwik website at http://piwik.org

    Running on OpenShift
    --------------------

    Create an account at http://openshift.redhat.com/

    Create a PHP application

        rhc app create -a piwik -t php-5.3 -l $USERNAME

    Add mysql support to your application

        rhc cartridge add -a piwik -c mysql-5.5 -l $USERNAME
    Make a note of the username, password, and host name as you will need to use these to complete the Piwik installation on OpenShift

    Add this upstream Piwik quickstart repo

        cd piwik/php
        rm -rf *
        git remote add upstream -m master git://github.com/gshipley/piwik-openshift-quickstart.git
        git pull -s recursive -X theirs upstream master

    Then push the repo upstream to OpenShift

        git push

    That's it, you can now checkout your application at:

        http://piwik-$yourlogin.rhcloud.com
----

Create the _README_ and _README.md_ in the _~/code/piwik_ directory and add the contents provided above. Once you have created these files, add and commit them to your repository:

----
$ cd ~/code/piwik
$ git add .
$ git commit -am "Add installation instructions"
----

Now we need to push these changes to the github repository we created:

----
$ git push -u github master
----

=== Verify the Quickstart
Delete the _piwik_ OpenShift Origin application and follow the instruction you created for your Piwik quick start to verify that everything works as expected.

TIP: If your application requires an existing populated database, the way to accomplish this is by using the .openshift/action_hooks/build script located in your application directory. Once you have your database created locally, do a _mysqldump_ on the table and store the .sql file in the action_hooks directory. You can then modify an existing build file to import the schema on application deployment. For an example, take a look at the action_hooks directory of the Wordpress quick start.

