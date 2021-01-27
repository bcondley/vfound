import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { WeatherLambda } from '../construct/weatherLambda';
import { WeatherApi } from '../lib/apigateway/weather';
import { WebsiteConfigurator } from '../lib/customres/siteConfigurator';
import { WeatherWebsiteBucket } from '../lib/s3/websiteBucket';

const app = new App();
const stack = new Stack(app, 'BCondley-TestStack', {
    description: 'Test stack',
    stackName: 'BCondley-TestStack',
});
// Attempt to determine the region from the app creation, default to us-east-2.
const region = app.region || 'us-east-2';

const weatherLambda = new WeatherLambda(
    stack,
    'WeatherLambda',
    {
        codeLocation: 'lib/lambda/',
    }
);

const weatherApiGateway: WeatherApi = new WeatherApi(
    stack,
    'WeatherApiGateway',
    {
        weatherLambda,
        apiName: 'bcondley-weather-api'
    }
);

const s3Website = new WeatherWebsiteBucket(
    stack,
    'WebsiteBucket',
    {

    }
);

const configurator = new WebsiteConfigurator(
    stack,
    'WebsiteConfig',
    {
        bucket: s3Website.getBucket(),
        gatewayId: weatherApiGateway.getGatewayId(),
        targetRegion: region,
    }
);

const websiteUrl = new CfnOutput(stack, 'UrlOutput', {
    exportName: 'WebsiteUrl',
    value: s3Website.getBucket().bucketWebsiteUrl
});
websiteUrl.node.addDependency(s3Website);
