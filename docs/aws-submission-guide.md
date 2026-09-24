# AWS Static Website Hosting Project: Submission Walkthrough & Guide
**Student Name:** Sakshi Kumari  
**Institute:** CDAC Kolkata  
**Project:** Deploy a Static Website on AWS  

---

## 1. Project Overview & Checklist
This guide details how to complete and document all mandatory tasks for the AWS Static Website Deployment project. Follow each step, execute the provided commands, and capture the specified screenshots for your submission report.

### Mandatory Deliverables Checklist:
- [x] AWS Free Tier Account Created.
- [x] EC2 Instance Launched and Running.
- [x] IAM Admin User configured, custom policies applied, and MFA enabled.
- [x] Amazon S3 bucket created, public access enabled, and static website hosting configured.
- [x] Static portfolio website and CV/Resume uploaded to S3.
- [x] AWS CLI used to synchronize files (with output log captured).
- [x] Live website URL tested and downloadable Resume/CV link verified.
- [ ] LinkedIn post published tagging *CDAC Kolkata* with a live URL, and post screenshot captured.
- [ ] Submission ZIP file compiled containing all screenshots and links.

---

## 2. Step-by-Step Instructions & Screenshot Capture Points

### Task 1: Create an AWS Free Tier Account
1. Visit [AWS Console Signup](https://portal.aws.amazon.com/billing/signup) and complete registration.
2. **Screenshot 1**: Capture the AWS Welcome/Registration Confirmation email or login landing page.

### Task 2: Launch an EC2 Instance (Virtual Server in the Cloud)
1. Navigate to the **EC2 Dashboard** -> **Launch Instance**.
2. Configure:
   - **Name**: `CDAC-Kolkata-EC2-Instance`
   - **OS**: Amazon Linux 2023 (Free Tier eligible)
   - **Instance Type**: `t3.micro` or `t2.micro` (Free Tier eligible)
   - **Key Pair**: Select "Proceed without a key pair"
   - **Network Settings**: Check **Allow HTTP traffic from the internet**.
3. Click **Launch Instance** and then **View all instances**.
4. **Screenshot 2**: Take a screenshot of the **EC2 Instances dashboard** showing your instance `CDAC-Kolkata-EC2-Instance` in the green **Running** state.

### Task 3: Configure IAM Users and Enable Multi-Factor Authentication (MFA)
1. **MFA Configuration for Root Account**:
   - Go to top-right corner -> click Account Name -> select **Security Credentials**.
   - Under **Multi-factor authentication (MFA)**, click **Assign MFA device** and name it `RootMFA`.
   - Scan the QR code using Google Authenticator and enter two consecutive codes to register.
   - **Screenshot 3**: Capture your **Security credentials** page showing the MFA device status as **Active**.
2. **IAM User Creation**:
   - Navigate to **IAM** -> **Users** -> **Create user** named `cdac-admin-user`.
   - Check **Provide user access to the AWS Management Console**, select **I want to create an IAM user**, and set a custom password.
   - On the Permissions page, select **Attach policies directly** and check **AdministratorAccess**.
   - Review and click **Create user**. Download the `.csv` credentials file.
   - **Screenshot 4**: Take a screenshot of the **IAM Users table** showing `cdac-admin-user` and its attached permissions/policies list.
   - *Note: You also generated Access Keys for this user in the user's Security Credentials tab to configure the AWS CLI.*

### Task 4: Create S3 Bucket and Configure Static Hosting
1. Navigate to the **S3 Dashboard** -> click **Create bucket**.
2. Configure:
   - **Bucket Name**: `sakshi-aws-project-2026`
   - **Block Public Access settings**: **UNCHECK** the box for "Block *all* public access" and tick the acknowledgment warning box.
   - Click **Create bucket**.
3. Select your bucket name, go to the **Properties** tab:
   - Scroll to **Static website hosting** -> click **Edit** -> select **Enable**.
   - Set both **Index Document** and **Error Document** to `index.html`.
   - Click **Save changes**. Note down the website endpoint: `http://sakshi-aws-project-2026.s3-website.eu-north-1.amazonaws.com`.
4. Go to the **Permissions** tab:
   - Scroll to **Bucket policy** -> click **Edit** -> paste the following JSON:
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "PublicReadGetObject",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::sakshi-aws-project-2026/*"
             }
         ]
     }
     ```
   - Click **Save changes**.
5. **Screenshot 5**: Capture the S3 **Permissions tab** showing that Block Public Access is "Off" and the Bucket Policy is active.
6. **Screenshot 6**: Capture the S3 **Properties tab** showing that "Static website hosting" is "Enabled" with the public endpoint URL clearly visible.

### Task 5 & 6: Upload files using AWS CLI
To satisfy the mandatory AWS CLI requirement, we used the AWS CLI to sync our portfolio files to S3.
1. Run the deployment script from your PowerShell terminal:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "C:\Users\kedar\Desktop\virtual lab\deploy-portfolio.ps1"
   ```
2. The script configures the CLI credentials for `cdac-admin-user` and executes the sync command:
   ```bash
   aws s3 sync "C:\Users\kedar\Desktop\virtual lab\aws-portfolio-deploy" s3://sakshi-aws-project-2026 --delete
   ```
3. **Screenshot 7 (CLI Evidence)**: Capture your PowerShell terminal output showing the successful execution of the `deploy-portfolio.ps1` script and the sync upload log.
4. **Screenshot 8 (S3 Uploaded Files)**: In the S3 console, click your bucket, select the **Objects** tab, and take a screenshot showing files like `index.html` and `resume.pdf` uploaded.

### Task 7: Verify Live Website and CV Download Link
1. Open your live S3 website URL: `http://sakshi-aws-project-2026.s3-website.eu-north-1.amazonaws.com`.
2. Verify that the portfolio page loads and contains your details.
3. Click the **Download CV / Resume (PDF)** button. Verify that it downloads the compiled file `Sakshi_Kumari_Resume.pdf` and renders your credentials.
4. **Screenshot 9**: Take a screenshot of the live website running in your browser showing the S3 URL in the address bar.

---

## 3. LinkedIn Submission Requirement
After confirming the website is live, publish a post on LinkedIn showing your accomplishment.

### Post Template (Copy & Customize):
```text
I am excited to share that I have successfully completed the AWS Static Website Hosting project as part of my cloud certification coursework at CDAC Kolkata! 

Key accomplishments of this deployment:
Launched and configured an Amazon EC2 instance representing our cloud VM server nodes.
Built and structured secure IAM roles, policies, user accounts, and enforced Multi-Factor Authentication (MFA) for administrative safety.
Created an Amazon S3 bucket, disabled public blocks, and configured static web hosting with a public read-access bucket policy.
Generated and deployed my updated Developer CV/Resume directly to the bucket, enabling direct PDF downloads on the platform.
Automated the deployment pipeline and synchronized all assets using the AWS CLI.

Check out my live deployed project:
http://sakshi-aws-project-2026.s3-website.eu-north-1.amazonaws.com/

Special thanks to CDAC Kolkata for the rigorous guidance and advanced curriculum.

#AWS #CloudComputing #AmazonWebServices #S3 #EC2 #IAM #DevOps #WebDevelopment #CDAC #CDACKolkata #FullStackDeveloper
```

### Steps:
1. Copy the text, paste it on your LinkedIn.
2. **Be sure to tag CDAC Kolkata** in the post (type `@CDAC Kolkata` and select their official page).
3. **Screenshot 10**: Capture a screenshot of the published LinkedIn post showing your name, the live URL, and the tagged CDAC Kolkata text.

---

## 4. Compiling the Submission Document
You are required to submit a single **ZIP file** or **PDF document** containing all materials.

### Structure of Your Submission PDF/Doc:
1. **Title Page**: CDAC Kolkata Project Submission: AWS Static Website Deployment (Sakshi Kumari).
2. **Section 1: Live S3 URL**: http://sakshi-aws-project-2026.s3-website.eu-north-1.amazonaws.com
3. **Section 2: Step-by-Step Walkthrough with Screenshots**:
   - Insert Screenshot 1 (AWS Free Tier Welcome)
   - Insert Screenshot 2 (Running EC2 Instance)
   - Insert Screenshot 3 (Root Account Active MFA)
   - Insert Screenshot 4 (IAM User Permissions Policy)
   - Insert Screenshot 5 (S3 Bucket Public Access Block Permissions)
   - Insert Screenshot 6 (S3 Bucket Static Website Hosting Enabled)
   - Insert Screenshot 8 (S3 Uploaded Objects Listing)
4. **Section 3: AWS CLI Evidence**:
   - Insert Screenshot 7 (CLI terminal command output).
   - Write out the CLI command used: `aws s3 sync "C:\Users\kedar\Desktop\virtual lab\aws-portfolio-deploy" s3://sakshi-aws-project-2026 --delete`.
5. **Section 4: LinkedIn Verification**:
   - Insert Screenshot 10 (Published LinkedIn post with CDAC Kolkata tagged).

Save this document as a PDF named `Sakshi_Kumari_AWS_Project_Submission.pdf` or compress it into `Sakshi_Kumari_AWS_Project.zip` along with the images, and upload it to the CDAC Kolkata Google Drive link:  
https://drive.google.com/drive/folders/102bK4MsMU1ROz0eoQPpEHoSVn1F5VmR7?usp=sharing
