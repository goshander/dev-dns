# dev-dns

---

DNS server for local development with `docker` and `traefik` integration

This service allow you to forgot about edit `hosts` file with big amount of hardcoded lines of routes to containers

All new domain from `traefik` labels automatically will be added to this dns table in runtime, also in runtime service watch `config.json` file from home user directory `${HOME}/.dev-dns`

---

DNS сервер для локальной разработки с использование `docker` и `traefik` в качестве веб-сервера

Сервис решает проблему частого редактирования файла `hosts` для добавления новых локальных маршрутов до контейнеров

Все новые домены тегов `traefik` для контейнеров автоматически добавляются в DNS таблицу сервера, также в автоматическом режиме отслеживаются изменения файла `config.js` из локальной директории пользователя `${HOME}/.dev-dns`. DNS сервер обновляется "налету"

---
---

OS specific help

**Linux**

For correct bind port `53` for dns server on linux system you need to allow bind it in `sysctl` config file: `/etc/sysctl.conf`

- add to config this line: `net.ipv4.ip_unprivileged_port_start=53`

- apply settings by run command as super user `sysctl --system`

**Windows**

None

---

Особенности работы на разных ОС

**Linux**

Для корректного использования порта `53` в качестве dns сервера на системах linux необходимо разрешить его использование в файле: `/etc/sysctl.conf`

- добавьте в конец файла следующую строку: `net.ipv4.ip_unprivileged_port_start=53`

- примените конфигурацию командой (выполнять от имени суперпользователя) `sysctl --system`

**Windows**

Ничего
