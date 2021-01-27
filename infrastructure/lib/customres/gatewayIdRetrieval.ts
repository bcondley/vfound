import { RestApi } from "@aws-cdk/aws-apigateway";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "@aws-cdk/custom-resources";

export interface GatewayIdRetrievalProps {
    /** RestAPI where this CustomResource will pull information */
    readonly restApi: RestApi;
    /** Custom name to assign to the underlying Lambda function.
     * @default bcondley-apigateway-cr
     */
    readonly functionName?: string;
}

export class GatewayIdRetrieval extends Construct {
    private customResource: AwsCustomResource;

    constructor(scope: Construct, id: string, props: GatewayIdRetrievalProps) {
        super(scope, id);

        const createOperation = {
            service: 'APIGateway',
            action: 'getRestApi',
            parameters: {
                restApiId: props.restApi.restApiId,
            },
            physicalResourceId: PhysicalResourceId.of('bcondley-gateway-custres')
        };
        const updateOperation = createOperation; // Does the same thing as the create.
        const deleteOperation = undefined; // There is currently no operation performed on delete of this resource.

        this.customResource = new AwsCustomResource(
            scope,
            'ApiGatewayCustomResource',
            {
                policy: AwsCustomResourcePolicy.fromStatements([
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: ["apigateway:GET"],
                        resources: AwsCustomResourcePolicy.ANY_RESOURCE // In the real world, this policy would be substantially more restrictive!
                    })
                ]),
                onCreate: createOperation,
                onUpdate: updateOperation,
                onDelete: deleteOperation,
                functionName: props.functionName || 'bcondley-apigateway-cr'
            }
        );
    }

    getGatewayId(): string {
        return this.customResource.getResponseField('id');
    }

}