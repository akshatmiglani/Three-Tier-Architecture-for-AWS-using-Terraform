#!/bin/bash
bucket_name=$1
object_key=$2
expiration=$3

signed_url=$(aws s3 presign s3://$bucket_name/$object_key --expires-in $expiration)
echo "{\"signed_url\": \"$signed_url\"}"
