# Brian Condley - Coding Assignment

A sample coding exercise that creates an AWS API Gateway, Lambda Function and S3 bucket with an SPA to diplay current weather conditions in Tulsa, OK

## Prerequisites
This project has dependencies managed using yarn (https://yarnpkg.com/)
CDK operations are handled using ts-node (https://www.npmjs.com/package/ts-node), which in turn is installed via NodeJS Package Manager (https://www.npmjs.com/get-npm)

To install dependencies prior to deployment, ensure that yarn is installed and execute (from the ./infrastructure folder):
```
yarn install
```

To build the website code that is published to the S3 bucket during the deployment, run (from the ./weather folder):
```
yarn build
```

## Resources
This project will deploy the following resources:
### API Gateway
The API Gateway exposes the public endpoint and interfaces with the backing Lambda function.
### Lambda Function
The Lambda function serves as the "functional" back-end resource, and calls the API used to retrieve current weather information.
### S3 Website Bucket
An S3 bucket created that contains and serves web content via a single-page application, written in ReactJS
### Website Content
React SPA built locally and deployed using the CDK BucketDeployment object (currently Beta functionality) [https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-deployment-readme.html]

## Deploying
Once prerequisites have been installed, the following commands can be used to control the deployment of the website and required AWS resources.
All commands should be executed from the ./infrastructure folder.

### Validation (synthesizes the CDK Code into a CloudFormation template)
```
yarn cdk synth --require-approval never --region us-east-1 --profile personal --app 'ts-node bin/cdk.ts' "*"
```

### Installation (creates/update the CloudFormation stack)
```
yarn cdk deploy --require-approval never --region us-east-1 --profile personal --app 'ts-node bin/cdk.ts' "*"
```
Note: The profile argument in the above command assumes a valid profile configuration in the ~/.aws/credentials file on your machine

### Destruction (removes the CloudFormation stack)
```
yarn cdk destroy --region us-east-1 --profile personal --app 'ts-node bin/cdk.ts' "*"
```
