import { Cors, Method, RestApi } from "@aws-cdk/aws-apigateway";
import { Construct } from "@aws-cdk/core";
import { WeatherLambda } from "../../construct/weatherLambda";
import { GatewayIdRetrieval } from "../customres/gatewayIdRetrieval";

export interface WeatherApiProps {
    /** Back-end Lambda function that interacts with the third-party weather API */
    readonly weatherLambda: WeatherLambda;
    /** Published resource name for the Rest Api */
    readonly apiName: string;
    /** Name to assign to the Lambda function used for the Custom Resource associated to the API Gateway
     * @default bcondley-apigateway-cr
     */
    readonly resourceFunctionName?: string;
}

export class WeatherApi extends Construct {
    private customResource: GatewayIdRetrieval;

    constructor(scope: Construct, id: string, props: WeatherApiProps) {
        super(scope, `${id}-Construct`);

        // Create the actual REST API
        const restApi = new RestApi(scope, id, {
            restApiName: props.apiName,
            binaryMediaTypes: [],
            deploy: true
        });

        // Add a GET method to the API (with CORS enabled)
        restApi.methods.push(
            new Method(
                scope,
                'GetApiMethod', {
                    httpMethod: 'GET',
                    integration: props.weatherLambda.getIntegration(),
                    resource: restApi.root,
                }
            ).resource.addCorsPreflight({
                allowMethods: Cors.ALL_METHODS,
                allowOrigins: Cors.ALL_ORIGINS
            })
        );

        // Create a custom resource that will retrieve the ID of the API Gateway
        this.customResource = new GatewayIdRetrieval(
            scope,
            'RestCustomResource',
            {
                restApi,
                functionName: props.resourceFunctionName
            }
        );
        this.customResource.node.addDependency(restApi);
    }

    /**
     * Retrieve the ID of the API Gateway.
     * Used to construct the default endpoint for communication from the website.
     */
    getGatewayId(): string {
        return this.customResource.getGatewayId();
    }
}