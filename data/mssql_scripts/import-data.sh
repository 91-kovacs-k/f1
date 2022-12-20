#!/bin/sh
for i in {1..50};
do
    /opt/mssql-tools/bin/sqlcmd -S sqledge -U sa -P notPassword123 -d master -Q "SELECT \"READY\"" | grep -q "READY"
    if [ $? -eq 0 ]
    then
        /opt/mssql-tools/bin/sqlcmd -S sqledge -U sa -P notPassword123 -d master -i /opt/mssql_scripts/setup.sql
        echo "--->setup.sql completed"
        break
    else
        echo "--->not ready yet..."
        sleep 1
    fi
done