# CDK

Deploy ere'thaaang.

## First time setup

### GitHub Actions Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
HCAPTCHA_SECRET | https://dashboard.hcaptcha.com/settings, "Secret key"
```

### Bootstrap
```bash
# npm install -g aws-cdk
cdk bootstrap aws://888213573687/us-east-1 -vv
```

### Policy actions for bootstrap

 ```json
[
	"apigateway:DELETE",
	"apigateway:GET",
	"apigateway:PATCH",
	"apigateway:POST",
	"apigateway:PUT",
	"cloudformation:CreateChangeSet",
	"cloudformation:DeleteChangeSet",
	"cloudformation:DeleteStack",
	"cloudformation:DescribeChangeSet",
	"cloudformation:DescribeStackEvents",
	"cloudformation:DescribeStacks",
	"cloudformation:ExecuteChangeSet",
	"cloudformation:GetTemplate",
	"cloudfront:CreateCloudFrontOriginAccessIdentity",
	"ecr:CreateRepository",
	"ecr:DeleteRepository",
	"ecr:DescribeRepositories",
	"ecr:GetLifecyclePolicy",
	"ecr:ListTagsForResource",
	"ecr:PutImageScanningConfiguration",
	"ecr:SetRepositoryPolicy",
	"iam:AttachRolePolicy",
	"iam:CreateRole",
	"iam:DeleteRole",
	"iam:DeleteRolePolicy",
	"iam:DetachRolePolicy",
	"iam:GetRole",
	"iam:getRolePolicy",
	"iam:ListRoleTags",
	"iam:PassRole",
	"iam:PutRolePolicy",
	"iam:TagRole",
	"lambda:AddPermission",
	"lambda:CreateFunction",
	"lambda:DeleteFunction",
	"lambda:DeleteLayerVersion",
	"lambda:GetFunction",
	"lambda:PublishLayerVersion",
	"s3:*Object",
	"s3:CreateBucket",
	"s3:DeleteBucket",
	"s3:GetBucketLocation",
	"s3:ListBucket",
	"s3:PutBucketPolicy",
	"s3:PutBucketPublicAccessBlock",
	"s3:PutBucketTagging",
	"s3:PutBucketVersioning",
	"s3:PutBucketWebsite",
	"s3:PutEncryptionConfiguration",
	"ssm:DeleteParameter",
	"ssm:GetParameters",
	"ssm:PutParameter"
]
```

### Policy actions for GitHub Actions

 ```json
[
	"apigateway:DELETE",
	"apigateway:GET",
	"apigateway:PATCH",
	"apigateway:POST",
	"apigateway:PUT",
	"cloudformation:GetTemplate",
	"cloudfront:CreateCloudFrontOriginAccessIdentity",
	"iam:PassRole",
	"lambda:AddPermission",
	"lambda:CreateFunction",
	"lambda:DeleteFunction",
	"lambda:DeleteLayerVersion",
	"lambda:GetFunction",
	"lambda:PublishLayerVersion",
	"s3:*Object",
	"s3:DeleteBucket",
	"s3:GetBucketLocation",
	"s3:ListBucket",
	"s3:PutBucketTagging",
	"s3:PutBucketWebsite"
]
```

### Policy statement for GitHub Actions

 ```json
{
	"Effect": "Allow",
	"Action": [
		"sts:AssumeRole"
	],
	"Resource": [
		"arn:aws:iam::*:role/cdk-*"
	]
}
```

## Resources

Examples:

- https://bobbyhadz.com/blog/aws-cdk-cognito-user-pool-example
