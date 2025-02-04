from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
    aws_s3_deployment as s3deploy,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_route53 as route53,
    aws_route53_targets as route53targets,
    aws_certificatemanager as acm,
    aws_lambda as lambda_,
    aws_apigateway as apigateway,
    aws_dynamodb as dynamodb,
    aws_ec2 as ec2,
)
from constructs import Construct
import json

with open("parameters.json", "r") as param_file:
    params = json.load(param_file) 

class InfrastructureStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)


        # Create VPC (removed fow now)
        
        vpc = ec2.Vpc(self, "SocialNetworkVPC",
                cidr=params["vpc_cidr"],
                max_azs=params["max_azs"],
                nat_gateways=params["nat_gateways"],  # Allows Lambda in private subnets to access the internet
                subnet_configuration=[
                    ec2.SubnetConfiguration(
                        name="PublicSubnet",
                        subnet_type=ec2.SubnetType.PUBLIC,
                        cidr_mask=params["subnet_cidr_mask"]
                    ),
                    ec2.SubnetConfiguration(
                        name="PrivateSubnet",
                        subnet_type=ec2.SubnetType.PRIVATE_WITH_NAT,
                        cidr_mask=params["subnet_cidr_mask"]
                    )
                ])
        


        # Create S3 Bucket

        static_bucket = s3.Bucket(self, "StaticBucket",
            bucket_name=params["bucket_name"],
            removal_policy=RemovalPolicy.DESTROY,
        )

        # Deploy Files to the S3 Bucket

        s3deploy.BucketDeployment(self, "DeployWebsite",
            sources=[s3deploy.Source.asset("./sources")],
            destination_bucket=static_bucket,
        )

        # Get existing ACM certificate from N. Virginia region (us-east-1)

        cert = acm.Certificate.from_certificate_arn(self,"ExistingCertificate",params["cloudfront_certificate_arn"])

        # Create CloudFront distribution with S3 region

        error = cloudfront.ErrorResponse(
            http_status=404,
            response_http_status=200,
            response_page_path="/main.html",
        )

        origin_access_identity = cloudfront.OriginAccessIdentity(
                self,
                'cdkOriginAccessIdentity'
        )

        static_bucket.grant_read(origin_access_identity)

        distribution = cloudfront.Distribution(self, "distro",
            certificate=cert,
            domain_names=params["cloudfront_domain"],
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(static_bucket, 
                    origin_access_identity=origin_access_identity,),
            ),
            error_responses=[error],
            default_root_object="main.html"
        )

        # Fetch existing Route53 hosted zone

        hostedZone = route53.HostedZone.from_lookup(self, "ExistingHostedZone", domain_name="4post.click")

        # Create DNS Entry in Route53

        route53.ARecord(self, "AliasRecord",
            zone=hostedZone,
            target=route53.RecordTarget.from_alias(route53targets.CloudFrontTarget(distribution))
        )

        route53.ARecord(self, "wwwAliasRecord",
            zone=hostedZone,
            target=route53.RecordTarget.from_alias(route53targets.CloudFrontTarget(distribution)),
            record_name="www"
        )


        # ----------------------------------------------------------------------------------------------------

        # API PART

        # Create DynamoDB table

        dynamo_table = dynamodb.Table(
            self, "4post_table",
            partition_key=dynamodb.Attribute(
                name="PK",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="SK",
                type=dynamodb.AttributeType.STRING
            )
        )

        # Create Lambda function
        
        my_lambda= lambda_.Function(self,id='apilambda4post',runtime=lambda_.Runtime.PYTHON_3_12,
                    handler='api_handler.lambda_handler', 
                    code= lambda_.Code.from_asset('./lambdas'),
                    vpc=vpc,
                    vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_WITH_NAT)
        ) 
        my_lambda.add_environment("TABLE_NAME", dynamo_table.table_name)

        # Grant Lambda permission to read/write data to DynamoDB table

        dynamo_table.grant_read_write_data(my_lambda)

        # Create VPC Endpoint for DynamoDB

        vpc.add_gateway_endpoint("DynamoDbEndpoint",
            service=ec2.GatewayVpcEndpointAwsService.DYNAMODB
        )
        
        cert2 = acm.Certificate.from_certificate_arn(self,"ExistingCertificate2",params["apigateway_certificate_arn"])

        # Create API Gateway to expose the Lambda function as an API

        my_api = apigateway.LambdaRestApi(self,
                id='lambdaapi4post',
                rest_api_name='api4post',
                handler=my_lambda,
                domain_name=apigateway.DomainNameOptions(
                    domain_name=params["api_domain"],
                    certificate=cert2,
                    security_policy=apigateway.SecurityPolicy.TLS_1_2,
                ),
                default_cors_preflight_options=apigateway.CorsOptions(
                    allow_origins=apigateway.Cors.ALL_ORIGINS,
                    allow_methods=apigateway.Cors.ALL_METHODS
                )
        )

        # Create DNS Entry in Route53

        route53.ARecord(self, "API-AliasRecord",
            zone=hostedZone,
            target=route53.RecordTarget.from_alias(route53targets.ApiGateway(my_api)),
            record_name="api"
        )
