import { Bucket } from "@aws-cdk/aws-s3";
import { BucketDeployment, CacheControl, Source } from "@aws-cdk/aws-s3-deployment";
import { Construct, Duration, RemovalPolicy } from "@aws-cdk/core";

export interface WebsiteBucketProps {
    /** Name of the S3 bucket where the deployment will be targeted.
     * @default bcondley-test-bucket
     */
    readonly bucketName?: string;
    /** Location of the website contents
     * @default ../weather/build/
     */
    readonly sourceFolder?: string;
}

/**
 * S3 construct using a Bucket and BucketDeployment used to deploy the entire website
 */
export class WeatherWebsiteBucket extends Construct {
    private bucket: Bucket;

    constructor(scope: Construct, id: string, props: WebsiteBucketProps) {
        super(scope, `${id}-Construct`);

        this.bucket = new Bucket(scope, id, {
            bucketName: props.bucketName || 'bcondley-test-bucket',
            websiteIndexDocument: 'index.html',
            removalPolicy: RemovalPolicy.DESTROY,
            publicReadAccess: true,
        });

        const deployment = new BucketDeployment(scope, 'SiteDeployment', {
            sources: [Source.asset(props.sourceFolder || '../weather/build/')],
            destinationBucket: this.bucket,
            contentType: "text/html",
            contentLanguage: "en",
            cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.hours(1))],
            retainOnDelete: false,
            prune: false,
        });

        // Don't start the website deployment until the bucket is available.
        deployment.node.addDependency(this.bucket);
    }

    /**
     * Returns the Bucket resource created with this construct
     */
    getBucket(): Bucket {
        return this.bucket;
    }

}