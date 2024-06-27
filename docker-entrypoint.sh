#!/bin/sh
set -e

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- node "$@"
fi

cd /app/prisma
echo "Running Prisma migrations..."
npx prisma migrate deploy

cd /app
echo "Inserting Tesla dump data..."
# Iterate over and execute each SQL file in the /app/sql/tesla_data directory
for file in /app/sql/tesla_data/*.csv; do
  # Extract the table name from the filename
  table_name=$(basename "$file" .csv)

  # Truncate the table before importing the new data
  echo "Truncating table $table_name"
  psql $DATABASE_URL -c "TRUNCATE TABLE $table_name;"

  # Import the data into the corresponding table
  echo "Importing data from $file into table $table_name"
  psql $DATABASE_URL -c "\COPY $table_name FROM '$file' CSV HEADER;"
done

cd /app
echo "Creating store procedures..."
# Iterate over and execute each SQL file in the /app/sql/store_procedures directory
for sql_file in /app/sql/store_procedures/*.sql; do
  psql $DATABASE_URL -f "$sql_file"
done

echo "Creating foreign tables..."

# Iterate over and execute each SQL file in the /app/sql/foreign_table directory
for sql_file in /app/sql/foreign_tables/*.sql; do
  # Replace placeholders with environment variable values
  envsubst < "$sql_file" > "/tmp/processed.sql"
  psql $DATABASE_URL -f "/tmp/processed.sql"
done

cd /app
exec "$@"
