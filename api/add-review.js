/**
 * Vercel Serverless Function: POST /api/add-review
 * Updates public/reviews.json directly in the GitHub repository.
 * This triggers a Vercel rebuild to redeploy the site with the new reviews.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const { name, role, message } = req.body || {};

  // Validate inputs
  if (!name || !message) {
    return res.status(400).json({ success: false, error: 'Name and Message are required fields.' });
  }

  // Retrieve GitHub Token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Missing GITHUB_TOKEN environment variable.');
    return res.status(500).json({
      success: false,
      error: 'GitHub Token is not configured in Vercel settings.',
      setupHelp: 'Please configure GITHUB_TOKEN in your Vercel project Environment Variables.'
    });
  }

  // Repository configuration from environment or fallbacks
  const owner = process.env.VERCEL_GIT_REPO_OWNER || 'Nashaf-engr';
  const repo = process.env.VERCEL_GIT_REPO_SLUG || 'New-portfolio-theme';
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';
  const path = 'public/reviews.json';

  const gitHubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 1. Fetch current file content and commit SHA from GitHub
    console.log(`Fetching ${path} from ${owner}/${repo} on branch ${branch}...`);
    const getResponse = await fetch(`${gitHubUrl}?ref=${branch}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      }
    });

    let currentReviews = [];
    let fileSha = null;

    if (getResponse.status === 200) {
      const data = await getResponse.json();
      fileSha = data.sha;
      const contentDecoded = Buffer.from(data.content, 'base64').toString('utf8');
      try {
        currentReviews = JSON.parse(contentDecoded);
        if (!Array.isArray(currentReviews)) {
          currentReviews = [];
        }
      } catch (err) {
        console.error('Error parsing existing reviews JSON, initializing empty array:', err);
        currentReviews = [];
      }
    } else if (getResponse.status === 404) {
      // File does not exist yet, we will create it
      console.log('reviews.json not found in repository. Creating a new one.');
    } else {
      const errorText = await getResponse.text();
      console.error(`Failed to fetch from GitHub (Status ${getResponse.status}):`, errorText);
      return res.status(getResponse.status).json({
        success: false,
        error: `GitHub API error fetching file: Status ${getResponse.status}`,
        details: errorText
      });
    }

    // 2. Prepend the new review
    const newReview = {
      name,
      role: role || 'Client',
      message,
      avatar: '/assets/icon.png' // Default avatar placeholder
    };

    const updatedReviews = [newReview, ...currentReviews];
    const updatedContentBase64 = Buffer.from(JSON.stringify(updatedReviews, null, 2)).toString('base64');

    // 3. Commit/Push updated content back to GitHub
    console.log(`Committing updated reviews to ${owner}/${repo} on branch ${branch}...`);
    const putResponse = await fetch(gitHubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify({
        message: `Add review from ${name} [skip ci]`, // [skip ci] can be added to skip CI triggers, but Vercel requires deployment commits, so do not add skip ci if it stops Vercel builds. Let's just use a normal commit message.
        content: updatedContentBase64,
        sha: fileSha || undefined, // If file doesn't exist, sha is undefined to create it
        branch: branch
      })
    });

    if (putResponse.ok) {
      console.log('Successfully committed updated reviews to GitHub.');
      return res.status(200).json({
        success: true,
        message: 'Review successfully submitted and committed to GitHub.',
        review: newReview
      });
    } else {
      const errorText = await putResponse.text();
      console.error(`Failed to commit to GitHub (Status ${putResponse.status}):`, errorText);
      return res.status(putResponse.status).json({
        success: false,
        error: `GitHub API error committing file: Status ${putResponse.status}`,
        details: errorText
      });
    }

  } catch (error) {
    console.error('Unhandled error in serverless function:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
