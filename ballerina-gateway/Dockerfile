FROM ballerina/ballerina:2201.7.0

WORKDIR /app

COPY . .

# Build the Ballerina project
RUN bal build

# Expose ports for Twilio (9090) and Dashboard (9091)
EXPOSE 9090 9091

CMD ["bal", "run"]
