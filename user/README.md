# Openticket/User

User service for Openticket.

Built with containers in mind, but can be run without a container.

# Running the service

## Prebuilt Docker container

This service is already built as a dockerised container. You can grab it like
so, using the command line tool:

```bash
$ docker pull openticket/user:latest
```

You can also specify a specific version, which you can find a list of on
[Docker Hub](https://hub.docker.com/r/openticket/user/).

Next you'll want to set up your database. Either run it locally, on a server,
or even in a container too!

For storing database passwords etc, you may want to use an .env file to store
your environment variables (check out `.env.example` to see what variables we
use), or if you're using an orchestration system like Kubernetes, there may
be better ways of managing super secret keys. If you're using an environment
file, you can pass it into all of the `docker run` commands with the
`--env-file=<filename>` flag.

```bash
$ export dbname=userdb
$ docker run docker run --name $dbname -d postgres:alpine
```

Now you need to migrate the database tables to your database. We already provide a script for this, so you can run it, if you have the source code, using `yarn run migrate`. Alternatively you can use docker:

```bash
$ docker run --rm --link userdb:postgres openticket/user yarn run migrate
```

Now you can run the service!

```bash
$ docker run -d -p 3000:3000 --link userdb:postgres openticket/user
```
