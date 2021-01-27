import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";
import { Construct } from "@aws-cdk/core";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "@aws-cdk/custom-resources";

const CONFIG_FILE_NAME = 'runtime-config.js';

export interface WebsiteConfigProps {
    /** Bucket this CustomResource is defined for */
    readonly bucket: Bucket;
    /** Published ID of the API Gateway (used to construct the public endpoint) */
    readonly gatewayId: string;
    /** Custom name to assign to the underlying Lambda function.
     * @default bcondley-test-configurator
     */
    readonly functionName?: string;
    /** Region where the stack is being deployed */
    readonly targetRegion: string;
}

/**
 * Custom Resource that builds the runtime configuration file for the React SPA
 */
export class WebsiteConfigurator extends Construct {
    constructor(scope: Construct, id: string, props: WebsiteConfigProps) {
        super(scope, id);

        // Create and update execute the same operation...
        const createOperation = {
            service: 'S3',
            action: 'putObject',
            parameters: {
                Body: this.getConfigFileContent(props.gatewayId, props.targetRegion),
                Bucket: props.bucket.bucketName,
                Key: CONFIG_FILE_NAME,
            },
            physicalResourceId: PhysicalResourceId.of('bcondley-siteconf-custres')
        };
        const updateOperation = createOperation;

        // Properties to execute a delete when the stack is being destroyed.
        const deleteOperation = {
            service: 'S3',
            action: 'deleteObject',
            parameters: {
                Bucket: props.bucket.bucketName,
                Key: CONFIG_FILE_NAME,
            },
            physicalResourceId: PhysicalResourceId.of(Date.now().toString())
        };

        // Creation of the actual CustomResource.
        const customResource = new AwsCustomResource(
            scope,
            'WebsiteConfiguratorCustomResource',
            {
                policy: AwsCustomResourcePolicy.fromStatements([
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: ["s3:PutObject", "s3:DeleteObject"],
                        resources: [`${props.bucket.bucketArn}/${CONFIG_FILE_NAME}`]
                    }),
                ]),
                onCreate: createOperation,
                onUpdate: updateOperation,
                onDelete: deleteOperation, // File is deleted with the bucket, no custom action required.
                functionName: props.functionName || 'bcondley-test-configurator'
            }
        );

        // Do not deploy this custom resource until after the bucket is created and available.
        customResource.node.addDependency(props.bucket);
    }

    /**
     * Function used to obtain the contents of the runtime configuration file used to set the
     * endpoint for the API Gateway.
     * @param gatewayId Resource ID of the API Gateway; used to contruct an endpoint
     * @example getConfigFileContent('a4htsheo3') returns "https://a4htsheo3.execute-api.us-east-1.amazonaws.com/prod"
     */
    private getConfigFileContent(gatewayId: string, region: string): string {
        return `
window['runConfig'] = {
    apiUrl: 'https://${gatewayId}.execute-api.${region}.amazonaws.com/prod'
}
        `;
    }

}