import { Integration, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

const DEFAULT_FUNCTION_NAME: string = 'bcondley-weather-lambda';
const LAMBDA_HANDLER: string = 'index.handler';

export interface WeatherLambdaProps {
    /** Location (folder) of the source code for the Lambda function */
    readonly codeLocation: string;
    /** Custom name for this Lambda function.
     * @default bcondley-weather-lambda
     */
    readonly functionName?: string;
}

export class WeatherLambda extends Function {
    constructor(scope: Construct, id: string, props: WeatherLambdaProps) {
        super(scope, id, {
            runtime: Runtime.NODEJS_12_X,
            handler: LAMBDA_HANDLER,
            code: Code.fromAsset(props.codeLocation),
            functionName: props.functionName || DEFAULT_FUNCTION_NAME
        });
    }

    getIntegration(): Integration {
        return new LambdaIntegration(this, {allowTestInvoke: true});
    }
}