#!/bin/sh
cd /setup

# Create mts-api S3 bucket
sleep 7s

aws sqs create-queue --queue-name notifications-queue --endpoint-url http://localstack:4576

