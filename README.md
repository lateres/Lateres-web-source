# Lateres website source

This repo is the source for the Lateres static website. It uses hugo with the Syna theme.
Full Syna [documentation](https://syna.okkur.org/docs).

## Updating

The automation for updating the website is done as github actions. Any commits to the main branch are automatically pushed to the live website.

### Starting instructions

NOTE: This repo uses the Syna submodule.
As such remember to initialize and update the submodules as failure to do so will result in being unable to preview the site locally.
After pulling remember to run following commands: `git submodule init` and `git submodule update`

### Local preview

As the project uses Syna that has been tested to work on the hugo v0.76.5 extended version. As such it is recommended to use the included `docker-compose.yml` file to preview the made changes before committing. The command `docker-compose up` can be issued in the root folder to start the hugo preview server at the [http://localhost:1313](http://localhost:1313) address on the same machine.

---

_Code is licensed under the [Apache License, Version 2.0](/LICENSE)._  
_Documentation/examples are licensed under [Creative Commons BY-SA 4.0](/docs/LICENSE)._  
_Illustrations, trademarks and third-party resources are owned by their respective party and are subject to different licensing._

---
