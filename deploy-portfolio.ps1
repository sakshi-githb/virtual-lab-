# AWS S3 Static Website Deployer for Portfolio
# Run this script to install AWS CLI, configure credentials, and upload files to your S3 bucket

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         CDAC KOLKATA AWS S3 PORTFOLIO DEPLOYER           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check/Install AWS CLI
Write-Host "[1/3] Checking AWS CLI installation..." -ForegroundColor Yellow
$awsAvailable = $false
try {
    $awsVersion = & aws --version 2>&1
    Write-Host "AWS CLI is already installed: $awsVersion" -ForegroundColor Green
    $awsAvailable = $true
} catch {
    Write-Host "AWS CLI is not installed. Initiating installer..." -ForegroundColor Red
    
    $msiUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
    $tempPath = Join-Path $env:TEMP "AWSCLIV2.msi"
    
    Write-Host "Downloading AWS CLI MSI from Amazon servers..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $msiUrl -OutFile $tempPath
    
    Write-Host "Installing AWS CLI... (If prompted by Windows User Account Control, click Yes)" -ForegroundColor Yellow
    $process = Start-Process msiexec.exe -ArgumentList "/i `"$tempPath`" /qn" -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "AWS CLI installed successfully!" -ForegroundColor Green
        # Refresh environment path in the current PowerShell process
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        $awsAvailable = $true
    } else {
        Write-Host "Installation failed with code: $($process.ExitCode). Please download and install AWS CLI manually from: https://aws.amazon.com/cli/" -ForegroundColor Red
        return
    }
}

# Step 2: Configure AWS Credentials
Write-Host ""
Write-Host "[2/3] Configuring AWS CLI credentials..." -ForegroundColor Yellow
Write-Host "Please enter your cdac-admin-user keys when prompted below." -ForegroundColor Cyan
Write-Host "Default region name should be: eu-north-1" -ForegroundColor Cyan
Write-Host "Default output format can be left blank (just press Enter)." -ForegroundColor Cyan
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

& aws configure

# Verify config works
Write-Host ""
Write-Host "Verifying authentication credentials..." -ForegroundColor Yellow
try {
    $identity = & aws sts get-caller-identity | ConvertFrom-Json
    Write-Host "Authentication Successful! Account ID: $($identity.Account)" -ForegroundColor Green
} catch {
    Write-Host "Authentication failed. Please verify your keys and run the script again." -ForegroundColor Red
    return
}

# Step 3: Sync files to S3
Write-Host ""
Write-Host "[3/3] Uploading static website files to S3 using AWS CLI..." -ForegroundColor Yellow
Write-Host "Syncing directory 'aws-portfolio-deploy' to S3 bucket 'sakshi-aws-project-2026'..." -ForegroundColor Cyan

try {
    & aws s3 sync "$PSScriptRoot/aws-portfolio-deploy" "s3://sakshi-aws-project-2026" --delete
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "   DEPLOYMENT SUCCEEDED!                                  " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Your website is live at: http://sakshi-aws-project-2026.s3-website.eu-north-1.amazonaws.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Evidence of AWS CLI Usage (Copy this for your report):" -ForegroundColor Green
    Write-Host "Command: aws s3 sync C:\Users\kedar\Desktop\virtual lab\aws-portfolio-deploy s3://sakshi-aws-project-2026 --delete" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
} catch {
    Write-Host "Failed to sync files to S3. Error: $_" -ForegroundColor Red
}
