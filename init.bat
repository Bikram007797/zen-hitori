# Initialize Git Repository

# Remove any existing git repository
rm -rf .git

# Initialize new repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/Bikram007797/zen-hitori.git

# Set main as default branch
git branch -M main

# Push to GitHub
git push -u origin main