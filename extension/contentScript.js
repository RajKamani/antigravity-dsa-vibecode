// O(1) Knot - LeetCode Content Script
// Monitors for "Accepted" submissions and extracts problem data

console.log("O(1) Knot: Content script injected on LeetCode.");

let lastProcessedSubmissionUrl = null;

// Function to extract problem details from the DOM
function extractProblemDetails() {
  try {
    // 1. Get Problem Title
    let title = "";
    // Try to get title from the URL path first as it's the most reliable on LeetCode SPA
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === "problems") {
      const slug = pathParts[2];
      title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    // Fallback to DOM if URL didn't have it
    if (!title) {
      const titleElement = document.querySelector('div[data-cy="question-title"]') || document.querySelector('.text-title-large');
      if (titleElement && titleElement.innerText) {
        title = titleElement.innerText.split('. ').pop() || titleElement.innerText;
      }
    }

    // 2. Get URL
    const url = window.location.origin + window.location.pathname;

    // 3. Get Difficulty
    let difficulty = "medium";
    const difficultyEl = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard') || 
                         document.querySelector('[class*="text-sd-"]'); // Alternate new UI
    if (difficultyEl) {
      difficulty = difficultyEl.innerText.toLowerCase();
    }

    // 4. Get Tags
    let tags = [];
    const tagElements = document.querySelectorAll('a[href^="/tag/"]');
    tagElements.forEach(el => {
      tags.push(el.innerText);
    });

    // 5. Get Code (this might be tricky depending on which tab is open)
    let code = "";
    const codeLines = document.querySelectorAll('.view-lines .view-line');
    if (codeLines.length > 0) {
      code = Array.from(codeLines).map(line => line.innerText).join('\n');
    }

    return {
      title: title,
      platform: "leetcode",
      difficulty: difficulty,
      topics: tags,
      url: url,
      code: code,
      pattern: "" // User can fill this later or AI predicts
    };

  } catch (error) {
    console.error("O(1) Knot: Error extracting details:", error);
    return null;
  }
}

// Function to handle a successful submission
function handleSuccessfulSubmission() {
  // Prevent duplicate processing of the same submission on URL change
  if (lastProcessedSubmissionUrl === window.location.href) {
    return;
  }
  lastProcessedSubmissionUrl = window.location.href;

  console.log("O(1) Knot: Accepted submission detected!");
  
  const problemData = extractProblemDetails();
  
  if (problemData) {
    console.log("O(1) Knot: Extracted Data:", problemData);
    
    // Send to background script
    chrome.runtime.sendMessage({
      type: "SUBMISSION_DETECTED",
      payload: problemData
    });
    
    // Fallback: Also copy to clipboard for manual entry just in case
    try {
      navigator.clipboard.writeText(JSON.stringify(problemData, null, 2));
      console.log("O(1) Knot: Data copied to clipboard as fallback.");
    } catch (e) {
      console.error("O(1) Knot: Could not copy to clipboard:", e);
    }
  }
}

// Set up MutationObserver to watch for the "Accepted" text
// LeetCode shows "Accepted" in a specific div when a submission passes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      // Check if any added node contains the "Accepted" text
      const addedText = mutation.target.innerText || "";
      if (addedText.includes("Accepted") && document.querySelector('[data-e2e-locator="submission-result"]')) {
         const resultEl = document.querySelector('[data-e2e-locator="submission-result"]');
         if(resultEl && resultEl.innerText.includes("Accepted")) {
            handleSuccessfulSubmission();
            break;
         }
      }
    }
  }
});

// Start observing the body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also monitor URL changes since LeetCode is an SPA
let previousUrl = window.location.href;
setInterval(() => {
  if (previousUrl !== window.location.href) {
    previousUrl = window.location.href;
    // Reset submission tracker on new problem
    if (!window.location.href.includes('/submissions/')) {
        lastProcessedSubmissionUrl = null;
    } else if (window.location.href.includes('/submissions/') && document.body.innerText.includes("Accepted")) {
        // if navigating directly to an accepted submission
        handleSuccessfulSubmission();
    }
  }
}, 1000);
