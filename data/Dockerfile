FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

COPY setup.sql setup.sql
COPY import-data.sh import-data.sh
COPY entrypoint.sh entrypoint.sh

RUN chmod +x entrypoint.sh

EXPOSE 1433

CMD /bin/bash ./entrypoint.sh