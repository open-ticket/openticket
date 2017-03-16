# Openticket
A self hosted events platform powered by Node.JS.

[![Test Coverage](https://codeclimate.com/github/open-ticket/openticket-server/badges/coverage.svg)](https://codeclimate.com/github/open-ticket/openticket-server/coverage) [![Build Status](https://travis-ci.org/open-ticket/openticket-server.svg?branch=master)](https://travis-ci.org/open-ticket/openticket-server)

![](https://github.com/open-ticket/openticket-meta/blob/master/banner.jpg?raw=true)

# Inspiration
While working on the TechSoc committee, I noticed that the majority of student societies, meetups and events had to rely on one of a small selection of proprietary ticketing providers that do not offer a lot of flexibility. I started the OpenTicket project because I want to give student societies and other small organisations control over how tickets for their own events are managed. The main targets for the project are:

* A powerful RESTful API that can be used to access and control most of the system, allowing organisations to roll their own interfaces if they wish.
* A simple yet graceful reference interface, that can be customized with the owners’ own branding.
* A highly configurable storefront that can be modified to the owners’ desires, using a sane templating system (most likely Liquid).
* Ability to work with payment providers like Stripe, Braintree, etc. (OpenTicket won’t have its own API key for these services however).
* (Possibly) a mobile app to allow for fast checkin for both attendees and organisers.

# Progress So Far
So far, I’ve been busy working on the modelling side of things as well as setting up a server with Node.JS. I’ve been somewhat hindered by life and university work, so my aim right now is to set up a framework to help others contribute to the platform.
