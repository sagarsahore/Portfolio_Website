# Certification Badge Images

This directory contains certification badge images for the website's certifications section.

## Required Badge Images

The following badge image files are required for the certifications section to display correctly:

### Salesforce Certifications
1. **salesforce_foundations.png** - Salesforce Platform Foundations badge
2. **salesforce_admin.png** - Salesforce Platform Administrator badge (already exists)
3. **salesforce_developer.png** - Salesforce Platform Developer badge
4. **salesforce_agentforce.png** - Salesforce Agentforce Specialist badge

### AWS Certifications
5. **aws_cloud.png** - AWS Cloud Foundation badge
6. **aws_genai.png** - AWS GenAI Foundation badge
7. **aws_ml.png** - AWS Machine Learning Foundation badge

## Image Specifications

- **Format**: PNG with transparency
- **Recommended size**: Approximately 200-300px width
- **Aspect ratio**: Badge/hexagon shape (as per official certification badges)

## Adding New Badges

To add or update certification badges:

1. Download the official badge image from your certification provider
2. Save it with the appropriate filename (as listed above)
3. Place it in this directory: `dist/assets/img/certifications/`
4. Ensure the image is in PNG format with transparent background
5. The website will automatically display the badge in the certifications section

## Notes

- The HTML already references these filenames, so simply uploading the images with the correct names will make them appear on the site
- Badge images should maintain consistent styling with the official certification badges from Salesforce and AWS
