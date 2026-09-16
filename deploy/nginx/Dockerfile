# Altijd-actieve reverse proxy vóór jehova-app — zie CLAUDE.md /
# docs/DEPLOY-SYNOLOGY.md voor waarom deze er is (voorkomt dat bezoekers een
# Cloudflare-foutpagina zien tijdens het updaten van jehova-app).
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY maintenance.html /usr/share/nginx/html/maintenance.html
