output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "deploy_role_arn" {
  description = "ARN of the GitHub Actions deploy role"
  value       = aws_iam_role.github_deploy.arn
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.site.arn
}
