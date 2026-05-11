let currentIntensity = 4;
let isEnabled = true;

// Inject CSS variable for global control
const style = document.createElement('style');
style.id = 'blurify-styles';
document.head.appendChild(style);

function updateBlurStyle() {
    if (isEnabled) {
        style.textContent = `
            /* Chat List: Names, Previews, and Icons */
            [data-testid="last-msg-status"], img {
                filter: blur(${currentIntensity}px) !important;
                transition: filter 0.2s ease;
            }
            
            /* Main Chat Window: Messages and Media */
            [data-testid="msg-content"] video {
                filter: blur(${currentIntensity}px) !important;
                transition: filter 0.2s ease;
            }

            /* Extra protection for images/media */
            img, video {
                filter: blur(${currentIntensity > 0 ? currentIntensity + 10 : 0}px);
            }
        `;
    } else {
        style.textContent = '';
        console.log("Blur disabled");
    }
}

// Initial load from storage
chrome.storage.local.get(['isBlurEnabled', 'intensity'], (result) => {
    if (result.isBlurEnabled !== undefined) isEnabled = result.isBlurEnabled;
    if (result.intensity !== undefined) currentIntensity = result.intensity;
    updateBlurStyle();
});

// Listen for updates from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_SETTINGS') {
        isEnabled = message.isEnabled;
        currentIntensity = message.intensity;
        updateBlurStyle();
    }
});